"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  calculateQualityMetrics,
  dpcmEncode,
  generateAnalogSignal,
  pcmEncode,
  type SignalParameters,
} from "@/lib/pcm";
import { Activity, BarChart3, Settings, Zap } from "lucide-react";
import { useMemo, useState } from "react";

// Signal visualization component
function SignalPlot({
  signals,
  title,
  width = 600,
  height = 200,
}: {
  signals: { data: number[]; label: string; color: string }[];
  title: string;
  width?: number;
  height?: number;
}) {
  // Filter out invalid signals
  const validSignals = signals.filter((s) => s.data && s.data.length > 0);

  if (validSignals.length === 0) {
    return (
      <div className="space-y-2">
        <h4 className="font-semibold text-sm">{title}</h4>
        <div className="border rounded p-8 bg-muted/20 text-center text-muted-foreground">
          <p>No signal data available</p>
          <p className="text-xs mt-1">Waiting for signal generation...</p>
        </div>
      </div>
    );
  }

  const padding = 40;
  const plotWidth = width - 2 * padding;
  const plotHeight = height - 2 * padding;

  // Find global min/max for scaling
  const allValues = validSignals.flatMap((s) => s.data);
  const minValue = Math.min(...allValues);
  const maxValue = Math.max(...allValues);
  const range = maxValue - minValue || 1;

  const getY = (value: number) =>
    padding + plotHeight - ((value - minValue) / range) * plotHeight;
  const getX = (index: number, dataLength: number) =>
    padding + (index / (dataLength - 1)) * plotWidth;

  // Color mapping for better SVG compatibility
  const getActualColor = (color: string) => {
    switch (color) {
      case "hsl(var(--primary))":
        return "#3b82f6"; // Blue
      case "hsl(var(--destructive))":
        return "#ef4444"; // Red
      case "hsl(var(--secondary))":
        return "#10b981"; // Green
      case "hsl(var(--muted))":
        return "#6b7280"; // Gray
      case "hsl(var(--muted-foreground))":
        return "#374151"; // Dark gray
      case "hsl(var(--foreground))":
        return "#111827"; // Very dark gray
      default:
        return color;
    }
  };

  return (
    <div className="space-y-2">
      <h4 className="font-semibold text-sm">{title}</h4>
      <svg
        width={width}
        height={height}
        className="border rounded bg-white dark:bg-gray-900"
      >
        {/* Grid */}
        <defs>
          <pattern
            id={`grid-${title.replace(/\s+/g, "")}`}
            width="40"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 20"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill={`url(#grid-${title.replace(/\s+/g, "")})`}
        />

        {/* Axes */}
        <line
          x1={padding}
          y1={padding}
          x2={padding}
          y2={height - padding}
          stroke="#6b7280"
          strokeWidth="1"
        />
        <line
          x1={padding}
          y1={height - padding}
          x2={width - padding}
          y2={height - padding}
          stroke="#6b7280"
          strokeWidth="1"
        />

        {/* Y-axis labels */}
        <text x={padding - 30} y={padding + 5} fontSize="10" fill="#6b7280">
          {maxValue.toFixed(1)}
        </text>
        <text
          x={padding - 30}
          y={height - padding + 5}
          fontSize="10"
          fill="#6b7280"
        >
          {minValue.toFixed(1)}
        </text>

        {/* Plot signals */}
        {validSignals.map((signal, sigIndex) => {
          if (!signal.data || signal.data.length === 0) return null;

          const actualColor = getActualColor(signal.color);
          const pathData = signal.data
            .map((value, index) => {
              const x = getX(index, signal.data.length);
              const y = getY(value);
              return `${index === 0 ? "M" : "L"} ${x} ${y}`;
            })
            .join(" ");

          return (
            <g key={sigIndex}>
              <path
                d={pathData}
                fill="none"
                stroke={actualColor}
                strokeWidth="2"
                opacity="0.9"
              />
              {/* Sample points for small datasets */}
              {signal.data.length < 50 &&
                signal.data.map((value, index) => (
                  <circle
                    key={index}
                    cx={getX(index, signal.data.length)}
                    cy={getY(value)}
                    r="3"
                    fill={actualColor}
                  />
                ))}
            </g>
          );
        })}

        {/* Legend */}
        <g transform={`translate(${width - 150}, 20)`}>
          {validSignals.map((signal, index) => (
            <g key={index} transform={`translate(0, ${index * 18})`}>
              <line
                x1={0}
                y1={0}
                x2={20}
                y2={0}
                stroke={getActualColor(signal.color)}
                strokeWidth="3"
              />
              <text x={25} y={4} fontSize="12" fill="#374151">
                {signal.label}
              </text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}

export function PulseCodeModulation() {
  const [signalParams, setSignalParams] = useState<SignalParameters>({
    frequency: 5,
    amplitude: 1,
    phase: 0,
    duration: 1,
    signalType: "sine",
  });

  const [samplingRate, setSamplingRate] = useState([100]);
  const [quantizationBits, setQuantizationBits] = useState([4]);
  const [modulationType, setModulationType] = useState<"PCM" | "DPCM">("PCM");
  const [predictorOrder, setPredictorOrder] = useState([1]);

  // Generate analog signal
  const analogSignal = useMemo(() => {
    return generateAnalogSignal(signalParams, 1000); // High-resolution for display
  }, [signalParams]);

  // PCM/DPCM processing
  const processed = useMemo(() => {
    try {
      let result;
      if (modulationType === "PCM") {
        result = pcmEncode(
          analogSignal,
          samplingRate[0],
          quantizationBits[0],
          1000
        );
      } else {
        result = dpcmEncode(
          analogSignal,
          samplingRate[0],
          quantizationBits[0],
          predictorOrder[0]
        );
      }

      return result;
    } catch (error) {
      console.error("PCM Processing Error:", error);
      return null;
    }
  }, [
    analogSignal,
    samplingRate,
    quantizationBits,
    modulationType,
    predictorOrder,
  ]);

  // Quality metrics
  const qualityMetrics = useMemo(() => {
    if (!processed?.sampledSignal || !processed?.reconstructedSignal) {
      return { mse: 0, snr: 0, psnr: 0, thd: 0 };
    }
    return calculateQualityMetrics(
      processed.sampledSignal,
      processed.reconstructedSignal
    );
  }, [processed]);

  return (
    <div className="space-y-6">
      {/* Signal Generation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Analog Signal Generator
          </CardTitle>
          <CardDescription>
            Generate test signals for PCM/DPCM demonstration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Signal Type</label>
              <Select
                value={signalParams.signalType}
                onValueChange={(value) =>
                  setSignalParams((prev) => ({
                    ...prev,
                    signalType: value as any,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sine">Sine Wave</SelectItem>
                  <SelectItem value="cosine">Cosine Wave</SelectItem>
                  <SelectItem value="square">Square Wave</SelectItem>
                  <SelectItem value="triangle">Triangle Wave</SelectItem>
                  <SelectItem value="sawtooth">Sawtooth Wave</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Frequency: {signalParams.frequency} Hz
              </label>
              <Slider
                value={[signalParams.frequency]}
                onValueChange={([value]) =>
                  setSignalParams((prev) => ({ ...prev, frequency: value }))
                }
                max={50}
                min={1}
                step={1}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Amplitude: {signalParams.amplitude}
              </label>
              <Slider
                value={[signalParams.amplitude]}
                onValueChange={([value]) =>
                  setSignalParams((prev) => ({ ...prev, amplitude: value }))
                }
                max={2}
                min={0.1}
                step={0.1}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* PCM/DPCM Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            {modulationType} Configuration
          </CardTitle>
          <CardDescription>
            Configure sampling rate, quantization, and encoding parameters
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex gap-4">
              <Button
                variant={modulationType === "PCM" ? "default" : "outline"}
                onClick={() => setModulationType("PCM")}
              >
                PCM
              </Button>
              <Button
                variant={modulationType === "DPCM" ? "default" : "outline"}
                onClick={() => setModulationType("DPCM")}
              >
                DPCM
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Sampling Rate: {samplingRate[0]} Hz
                </label>
                <Slider
                  value={samplingRate}
                  onValueChange={setSamplingRate}
                  max={200}
                  min={10}
                  step={5}
                />
                <div className="text-xs text-muted-foreground">
                  Nyquist: {signalParams.frequency * 2} Hz minimum
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Quantization: {quantizationBits[0]} bits
                </label>
                <Slider
                  value={quantizationBits}
                  onValueChange={setQuantizationBits}
                  max={8}
                  min={2}
                  step={1}
                />
                <div className="text-xs text-muted-foreground">
                  {Math.pow(2, quantizationBits[0])} levels
                </div>
              </div>

              {modulationType === "DPCM" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Predictor Order: {predictorOrder[0]}
                  </label>
                  <Slider
                    value={predictorOrder}
                    onValueChange={setPredictorOrder}
                    max={5}
                    min={1}
                    step={1}
                  />
                  <div className="text-xs text-muted-foreground">
                    Number of previous samples
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2 sm:pb-3">
            <CardDescription className="text-xs sm:text-sm">
              Bit Rate
            </CardDescription>
            <CardTitle className="text-lg sm:text-xl lg:text-2xl">
              {((samplingRate[0] * quantizationBits[0]) / 1000).toFixed(1)} kbps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              {samplingRate[0]} × {quantizationBits[0]} bits/sec
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 sm:pb-3">
            <CardDescription className="text-xs sm:text-sm">
              SNR
            </CardDescription>
            <CardTitle className="text-lg sm:text-xl lg:text-2xl">
              {processed?.signalToNoiseRatio?.toFixed(1) || "0.0"} dB
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">Signal quality</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 sm:pb-3">
            <CardDescription className="text-xs sm:text-sm">
              THD
            </CardDescription>
            <CardTitle className="text-lg sm:text-xl lg:text-2xl">
              {qualityMetrics.thd.toFixed(2)}%
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              Harmonic distortion
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 sm:pb-3">
            <CardDescription className="text-xs sm:text-sm">
              {modulationType === "DPCM" ? "Compression" : "Efficiency"}
            </CardDescription>
            <CardTitle className="text-lg sm:text-xl lg:text-2xl">
              {modulationType === "DPCM"
                ? `${(processed?.compressionRatio || 1).toFixed(1)}:1`
                : `${(
                    (1 -
                      (processed?.quantizationError?.reduce(
                        (sum, e) => sum + Math.abs(e),
                        0
                      ) || 0) /
                        (processed?.sampledSignal?.length || 1)) *
                    100
                  ).toFixed(1)}%`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              {modulationType === "DPCM" ? "vs PCM" : "Accuracy"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Signal Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Signal Processing Chain</CardTitle>
            <CardDescription>
              Sampling, quantization, and reconstruction
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SignalPlot
              signals={[
                {
                  data: analogSignal.slice(0, 200) || [],
                  label: "Original",
                  color: "hsl(var(--primary))",
                },
                {
                  data: processed?.sampledSignal || [],
                  label: "Sampled",
                  color: "hsl(var(--destructive))",
                },
                {
                  data: processed?.reconstructedSignal || [],
                  label: "Reconstructed",
                  color: "hsl(var(--secondary))",
                },
              ].filter((signal) => signal.data && signal.data.length > 0)}
              title="Signal Comparison"
              width={500}
              height={200}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quantization Analysis</CardTitle>
            <CardDescription>
              Quantization levels and error analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SignalPlot
              signals={[
                {
                  data: processed?.quantizationError || [],
                  label: "Quantization Error",
                  color: "hsl(var(--destructive))",
                },
              ].filter((signal) => signal.data && signal.data.length > 0)}
              title="Quantization Error"
              width={500}
              height={200}
            />
          </CardContent>
        </Card>
      </div>

      {/* Encoded Data */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Digital Output
          </CardTitle>
          <CardDescription>
            Binary representation and quality metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Encoded Binary Stream</h4>
              <div className="p-3 bg-muted rounded font-mono text-xs break-all max-h-32 overflow-y-auto">
                {processed?.encodedBits?.slice(0, 200) || "No data available"}
                {(processed?.encodedBits?.length || 0) > 200 && "..."}
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                Total bits: {processed?.encodedBits?.length || 0} | Samples:{" "}
                {processed?.sampledSignal?.length || 0} | Bits per sample:{" "}
                {quantizationBits[0]}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-3 border rounded">
                <div className="text-lg font-semibold">
                  {qualityMetrics.mse.toExponential(2)}
                </div>
                <div className="text-xs text-muted-foreground">
                  Mean Squared Error
                </div>
              </div>
              <div className="text-center p-3 border rounded">
                <div className="text-lg font-semibold">
                  {qualityMetrics.snr.toFixed(1)} dB
                </div>
                <div className="text-xs text-muted-foreground">
                  Signal-to-Noise Ratio
                </div>
              </div>
              <div className="text-center p-3 border rounded">
                <div className="text-lg font-semibold">
                  {qualityMetrics.psnr.toFixed(1)} dB
                </div>
                <div className="text-xs text-muted-foreground">Peak SNR</div>
              </div>
              <div className="text-center p-3 border rounded">
                <div className="text-lg font-semibold">
                  {processed?.quantizationLevels || 0}
                </div>
                <div className="text-xs text-muted-foreground">
                  Quantization Levels
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Information Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            {modulationType} Information
          </CardTitle>
          <CardDescription>Understanding the encoding process</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-semibold">Process Steps:</h4>
              <ul className="space-y-1 text-muted-foreground text-xs">
                <li>
                  • <strong>Sampling:</strong> Convert analog to discrete-time
                </li>
                <li>
                  • <strong>Quantization:</strong> Map to finite amplitude
                  levels
                </li>
                <li>
                  • <strong>Encoding:</strong> Convert to binary representation
                </li>
                {modulationType === "DPCM" && (
                  <>
                    <li>
                      • <strong>Prediction:</strong> Estimate next sample value
                    </li>
                    <li>
                      • <strong>Difference:</strong> Quantize prediction error
                    </li>
                  </>
                )}
                <li>
                  • <strong>Reconstruction:</strong> Decode back to analog
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Key Properties:</h4>
              <ul className="space-y-1 text-muted-foreground text-xs">
                <li>
                  • <strong>Nyquist Rate:</strong> fs ≥ 2 × fmax
                </li>
                <li>
                  • <strong>Quantization Noise:</strong> ∝ 1/2^n
                </li>
                <li>
                  • <strong>Bit Rate:</strong> fs × n bits/second
                </li>
                {modulationType === "DPCM" && (
                  <>
                    <li>
                      • <strong>Compression:</strong> Exploits correlation
                    </li>
                    <li>
                      • <strong>Prediction Gain:</strong> Reduces bit rate
                    </li>
                  </>
                )}
                <li>
                  • <strong>SNR:</strong> 6n + 1.8 dB (theory)
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
