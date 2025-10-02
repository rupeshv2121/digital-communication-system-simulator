/**
 * Pulse Code Modulation (PCM) and Differential PCM (DPCM) Implementation
 * Analog-to-Digital conversion techniques for audio/signal processing
 */

export interface PCMResult {
  type: "PCM" | "DPCM";
  originalSignal: number[];
  sampledSignal: number[];
  quantizedSignal: number[];
  encodedBits: string;
  reconstructedSignal: number[];
  samplingRate: number;
  quantizationLevels: number;
  bitsPerSample: number;
  signalToNoiseRatio: number;
  quantizationError: number[];
  compressionRatio?: number;
}

export interface SignalParameters {
  frequency: number;
  amplitude: number;
  phase: number;
  duration: number;
  signalType: "sine" | "cosine" | "square" | "triangle" | "sawtooth";
}

/**
 * Generate test analog signals
 */
export function generateAnalogSignal(
  params: SignalParameters,
  samplingRate: number
): number[] {
  const { frequency, amplitude, phase, duration, signalType } = params;
  const numSamples = Math.floor(samplingRate * duration);
  const signal: number[] = [];

  for (let n = 0; n < numSamples; n++) {
    const t = n / samplingRate;
    const omega = 2 * Math.PI * frequency;
    let sample = 0;

    switch (signalType) {
      case "sine":
        sample = amplitude * Math.sin(omega * t + phase);
        break;
      case "cosine":
        sample = amplitude * Math.cos(omega * t + phase);
        break;
      case "square":
        sample = amplitude * Math.sign(Math.sin(omega * t + phase));
        break;
      case "triangle":
        sample =
          amplitude * (2 / Math.PI) * Math.asin(Math.sin(omega * t + phase));
        break;
      case "sawtooth":
        sample =
          amplitude *
          (2 *
            ((omega * t + phase) / (2 * Math.PI) -
              Math.floor((omega * t + phase) / (2 * Math.PI) + 0.5)));
        break;
    }

    signal.push(sample);
  }

  return signal;
}

/**
 * PCM Encoding: Sampling → Quantization → Encoding
 */
export function pcmEncode(
  signal: number[],
  samplingRate: number,
  quantizationBits: number,
  originalSamplingRate?: number
): PCMResult {
  const originalSignal = [...signal];
  const quantizationLevels = Math.pow(2, quantizationBits);

  // Step 1: Sampling (if downsampling needed)
  const downsampleFactor = originalSamplingRate
    ? Math.floor(originalSamplingRate / samplingRate)
    : 1;
  const sampledSignal =
    downsampleFactor > 1
      ? signal.filter((_, index) => index % downsampleFactor === 0)
      : [...signal];

  // Step 2: Find signal range for quantization
  const maxValue = Math.max(...sampledSignal);
  const minValue = Math.min(...sampledSignal);
  const range = maxValue - minValue;
  const stepSize = range / quantizationLevels;

  // Step 3: Uniform Quantization
  const quantizedSignal: number[] = [];
  const quantizationError: number[] = [];
  let encodedBits = "";

  sampledSignal.forEach((sample) => {
    // Quantize
    const quantizedLevel = Math.round((sample - minValue) / stepSize);
    const clampedLevel = Math.max(
      0,
      Math.min(quantizationLevels - 1, quantizedLevel)
    );
    const quantizedValue = minValue + clampedLevel * stepSize;

    quantizedSignal.push(quantizedValue);
    quantizationError.push(sample - quantizedValue);

    // Encode to binary
    const binaryCode = clampedLevel.toString(2).padStart(quantizationBits, "0");
    encodedBits += binaryCode;
  });

  // Step 4: Reconstruction (same as quantized for PCM)
  const reconstructedSignal = [...quantizedSignal];

  // Calculate metrics
  const signalPower =
    sampledSignal.reduce((sum, val) => sum + val * val, 0) /
    sampledSignal.length;
  const noisePower =
    quantizationError.reduce((sum, val) => sum + val * val, 0) /
    quantizationError.length;
  const snr = 10 * Math.log10(signalPower / (noisePower + 1e-10));

  return {
    type: "PCM",
    originalSignal,
    sampledSignal,
    quantizedSignal,
    encodedBits,
    reconstructedSignal,
    samplingRate,
    quantizationLevels,
    bitsPerSample: quantizationBits,
    signalToNoiseRatio: snr,
    quantizationError,
  };
}

/**
 * DPCM Encoding: Predictive coding with differential quantization
 */
export function dpcmEncode(
  signal: number[],
  samplingRate: number,
  quantizationBits: number,
  predictorOrder: number = 1
): PCMResult {
  const originalSignal = [...signal];
  const sampledSignal = [...signal]; // Assume already sampled
  const quantizationLevels = Math.pow(2, quantizationBits);

  // Step 1: Prediction (simple first-order predictor)
  const predictedSignal: number[] = [];
  const differenceSignal: number[] = [];

  for (let n = 0; n < sampledSignal.length; n++) {
    let prediction = 0;

    if (n === 0) {
      prediction = 0; // No previous sample
    } else if (predictorOrder === 1) {
      prediction = sampledSignal[n - 1]; // First-order predictor
    } else {
      // Higher-order predictor (simple averaging)
      const startIdx = Math.max(0, n - predictorOrder);
      const sumSamples = sampledSignal
        .slice(startIdx, n)
        .reduce((sum, val) => sum + val, 0);
      prediction = sumSamples / (n - startIdx);
    }

    predictedSignal.push(prediction);
    differenceSignal.push(sampledSignal[n] - prediction);
  }

  // Step 2: Quantize the difference signal
  const maxDiff = Math.max(...differenceSignal.map(Math.abs));
  const stepSize = (2 * maxDiff) / quantizationLevels;

  const quantizedDifferences: number[] = [];
  const quantizationError: number[] = [];
  let encodedBits = "";

  differenceSignal.forEach((diff) => {
    // Quantize difference (with offset for signed values)
    const quantizedLevel = Math.round((diff + maxDiff) / stepSize);
    const clampedLevel = Math.max(
      0,
      Math.min(quantizationLevels - 1, quantizedLevel)
    );
    const quantizedDiff = clampedLevel * stepSize - maxDiff;

    quantizedDifferences.push(quantizedDiff);
    quantizationError.push(diff - quantizedDiff);

    // Encode to binary
    const binaryCode = clampedLevel.toString(2).padStart(quantizationBits, "0");
    encodedBits += binaryCode;
  });

  // Step 3: Reconstruction
  const reconstructedSignal: number[] = [];

  for (let n = 0; n < quantizedDifferences.length; n++) {
    if (n === 0) {
      reconstructedSignal.push(quantizedDifferences[n]);
    } else {
      // Prediction from reconstructed samples
      let prediction = 0;
      if (predictorOrder === 1) {
        prediction = reconstructedSignal[n - 1];
      } else {
        const startIdx = Math.max(0, n - predictorOrder);
        const sumSamples = reconstructedSignal
          .slice(startIdx, n)
          .reduce((sum, val) => sum + val, 0);
        prediction = sumSamples / (n - startIdx);
      }

      reconstructedSignal.push(prediction + quantizedDifferences[n]);
    }
  }

  // Calculate metrics
  const signalPower =
    sampledSignal.reduce((sum, val) => sum + val * val, 0) /
    sampledSignal.length;
  const noisePower =
    quantizationError.reduce((sum, val) => sum + val * val, 0) /
    quantizationError.length;
  const snr = 10 * Math.log10(signalPower / (noisePower + 1e-10));

  // Calculate compression ratio (DPCM typically uses fewer bits for differences)
  const pcmBits = sampledSignal.length * 8; // Assume 8-bit PCM
  const dpcmBits = encodedBits.length;
  const compressionRatio = pcmBits / dpcmBits;

  return {
    type: "DPCM",
    originalSignal,
    sampledSignal,
    quantizedSignal: quantizedDifferences,
    encodedBits,
    reconstructedSignal,
    samplingRate,
    quantizationLevels,
    bitsPerSample: quantizationBits,
    signalToNoiseRatio: snr,
    quantizationError,
    compressionRatio,
  };
}

/**
 * PCM Decoding: Convert binary back to analog signal
 */
export function pcmDecode(
  encodedBits: string,
  quantizationBits: number,
  minValue: number,
  maxValue: number
): number[] {
  const quantizationLevels = Math.pow(2, quantizationBits);
  const stepSize = (maxValue - minValue) / quantizationLevels;
  const decodedSignal: number[] = [];

  // Process bits in chunks of quantizationBits
  for (let i = 0; i < encodedBits.length; i += quantizationBits) {
    const binaryChunk = encodedBits.slice(i, i + quantizationBits);
    const quantizationLevel = parseInt(binaryChunk, 2);
    const analogValue = minValue + quantizationLevel * stepSize;
    decodedSignal.push(analogValue);
  }

  return decodedSignal;
}

/**
 * Calculate various quality metrics
 */
export function calculateQualityMetrics(
  original: number[],
  reconstructed: number[]
): {
  mse: number;
  snr: number;
  psnr: number;
  thd: number;
} {
  const minLength = Math.min(original.length, reconstructed.length);

  // Mean Squared Error
  let mse = 0;
  for (let i = 0; i < minLength; i++) {
    const error = original[i] - reconstructed[i];
    mse += error * error;
  }
  mse /= minLength;

  // Signal-to-Noise Ratio
  const signalPower =
    original.slice(0, minLength).reduce((sum, val) => sum + val * val, 0) /
    minLength;
  const snr = 10 * Math.log10(signalPower / (mse + 1e-10));

  // Peak Signal-to-Noise Ratio
  const maxValue = Math.max(...original.map(Math.abs));
  const psnr = 20 * Math.log10(maxValue / Math.sqrt(mse + 1e-10));

  // Total Harmonic Distortion (simplified)
  const thd = (Math.sqrt(mse) / (Math.sqrt(signalPower) + 1e-10)) * 100;

  return { mse, snr, psnr, thd };
}

/**
 * Apply different types of quantization
 */
export function quantize(
  value: number,
  levels: number,
  minVal: number,
  maxVal: number,
  type: "uniform" | "mu-law" | "a-law" = "uniform"
): number {
  switch (type) {
    case "uniform": {
      const stepSize = (maxVal - minVal) / levels;
      const quantLevel = Math.round((value - minVal) / stepSize);
      const clampedLevel = Math.max(0, Math.min(levels - 1, quantLevel));
      return minVal + clampedLevel * stepSize;
    }

    case "mu-law": {
      // μ-law companding (North American standard)
      const mu = 255;
      const normalizedValue = value / maxVal;
      const compressed =
        (Math.sign(normalizedValue) *
          Math.log(1 + mu * Math.abs(normalizedValue))) /
        Math.log(1 + mu);
      // Then apply uniform quantization to compressed value
      const uniformQuant = quantize(compressed, levels, -1, 1, "uniform");
      // Expand back
      return (
        (maxVal *
          Math.sign(uniformQuant) *
          (Math.pow(1 + mu, Math.abs(uniformQuant)) - 1)) /
        mu
      );
    }

    case "a-law": {
      // A-law companding (European standard)
      const A = 87.6;
      const normalizedValue = value / maxVal;
      let compressed: number;
      if (Math.abs(normalizedValue) <= 1 / A) {
        compressed =
          (Math.sign(normalizedValue) * A * Math.abs(normalizedValue)) /
          (1 + Math.log(A));
      } else {
        compressed =
          (Math.sign(normalizedValue) *
            (1 + Math.log(A * Math.abs(normalizedValue)))) /
          (1 + Math.log(A));
      }
      // Then apply uniform quantization and expand back
      const uniformQuant = quantize(compressed, levels, -1, 1, "uniform");
      if (Math.abs(uniformQuant) <= 1 / (1 + Math.log(A))) {
        return (
          (maxVal *
            Math.sign(uniformQuant) *
            Math.abs(uniformQuant) *
            (1 + Math.log(A))) /
          A
        );
      } else {
        return (
          (maxVal *
            Math.sign(uniformQuant) *
            Math.exp(Math.abs(uniformQuant) * (1 + Math.log(A)) - 1)) /
          A
        );
      }
    }

    default:
      return quantize(value, levels, minVal, maxVal, "uniform");
  }
}
