// "use client";

// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Slider } from "@/components/ui/slider";
// import { addNoise, type ModulationType } from "@/lib/modulation";
// import { Activity, TrendingDown, Waves } from "lucide-react";
// import { useMemo, useState } from "react";

// interface ChannelSimulationProps {
//   symbols?: Array<{
//     x: number;
//     y: number;
//     bits: string;
//     amplitude: number;
//     phase: number;
//   }>;
//   modulationType?: ModulationType;
//   originalBits?: string;
// }

// export function ChannelSimulation({
//   symbols = [
//     { x: 1, y: 0, bits: "00", amplitude: 1, phase: 0 },
//     { x: -1, y: 0, bits: "01", amplitude: 1, phase: Math.PI },
//     { x: 0, y: 1, bits: "10", amplitude: 1, phase: Math.PI / 2 },
//     { x: 0, y: -1, bits: "11", amplitude: 1, phase: -Math.PI / 2 },
//   ],
//   modulationType = "QPSK",
//   originalBits = "1100100111010001",
// }: ChannelSimulationProps) {
//   const [snrDb, setSnrDb] = useState([10]);
//   const [enableFading, setEnableFading] = useState(false);
//   const [fadingType, setFadingType] = useState<"rayleigh" | "rician">(
//     "rayleigh"
//   );

//   // Add AWGN noise
//   const noisySymbols = useMemo(() => {
//     return addNoise(symbols, snrDb[0]);
//   }, [symbols, snrDb]);

//   // Add fading if enabled
//   const fadedSymbols = useMemo(() => {
//     if (!enableFading) return noisySymbols;

//     return noisySymbols.map((symbol) => {
//       const fadingCoeff = generateFadingCoefficient(fadingType);
//       return {
//         ...symbol,
//         x:
//           symbol.x * fadingCoeff.magnitude * Math.cos(fadingCoeff.phase) -
//           symbol.y * fadingCoeff.magnitude * Math.sin(fadingCoeff.phase),
//         y:
//           symbol.x * fadingCoeff.magnitude * Math.sin(fadingCoeff.phase) +
//           symbol.y * fadingCoeff.magnitude * Math.cos(fadingCoeff.phase),
//       };
//     });
//   }, [noisySymbols, enableFading, fadingType]);

//   // Calculate metrics
//   const snrLinear = Math.pow(10, snrDb[0] / 10);
//   const noiseVariance = 1 / (2 * snrLinear);
//   const signalPower = 1; // Normalized
//   const noisePower = 2 * noiseVariance;

//   return (
//     <div className="space-y-6">
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <Waves className="h-5 w-5" />
//             Communication Channel
//           </CardTitle>
//           <CardDescription>
//             Simulate realistic channel conditions with noise and fading
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-6">
//             {/* SNR Control */}
//             <div className="space-y-3">
//               <div className="flex items-center justify-between">
//                 <label className="text-sm font-medium">
//                   Signal-to-Noise Ratio (SNR)
//                 </label>
//                 <Badge variant="outline">{snrDb[0]} dB</Badge>
//               </div>
//               <Slider
//                 value={snrDb}
//                 onValueChange={setSnrDb}
//                 max={25}
//                 min={-5}
//                 step={1}
//                 className="w-full"
//               />
//               <div className="flex justify-between text-xs text-muted-foreground">
//                 <span>-5 dB (Very Noisy)</span>
//                 <span>25 dB (Clean)</span>
//               </div>
//             </div>

//             {/* Fading Control */}
//             <div className="space-y-3">
//               <div className="flex items-center gap-4">
//                 <Button
//                   variant={enableFading ? "default" : "outline"}
//                   size="sm"
//                   onClick={() => setEnableFading(!enableFading)}
//                 >
//                   {enableFading ? "Disable Fading" : "Enable Fading"}
//                 </Button>
//                 {enableFading && (
//                   <div className="flex gap-2">
//                     <Button
//                       variant={
//                         fadingType === "rayleigh" ? "default" : "outline"
//                       }
//                       size="sm"
//                       onClick={() => setFadingType("rayleigh")}
//                     >
//                       Rayleigh
//                     </Button>
//                     <Button
//                       variant={fadingType === "rician" ? "default" : "outline"}
//                       size="sm"
//                       onClick={() => setFadingType("rician")}
//                     >
//                       Rician
//                     </Button>
//                   </div>
//                 )}
//               </div>
//               {enableFading && (
//                 <div className="text-xs text-muted-foreground">
//                   <p>
//                     <strong>Rayleigh:</strong> No line-of-sight (mobile
//                     communications)
//                   </p>
//                   <p>
//                     <strong>Rician:</strong> Strong line-of-sight component
//                     (satellite)
//                   </p>
//                 </div>
//               )}
//             </div>

//             {/* Channel Statistics */}
//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//               <div className="text-center p-3 border rounded">
//                 <div className="text-lg font-semibold">
//                   {snrLinear.toFixed(1)}
//                 </div>
//                 <div className="text-xs text-muted-foreground">
//                   SNR (Linear)
//                 </div>
//               </div>
//               <div className="text-center p-3 border rounded">
//                 <div className="text-lg font-semibold">
//                   {(noisePower * 100).toFixed(1)}%
//                 </div>
//                 <div className="text-xs text-muted-foreground">Noise Power</div>
//               </div>
//               <div className="text-center p-3 border rounded">
//                 <div className="text-lg font-semibold">
//                   {enableFading ? "Yes" : "No"}
//                 </div>
//                 <div className="text-xs text-muted-foreground">Fading</div>
//               </div>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Channel Effects Visualization */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <Activity className="h-5 w-5" />
//             Channel Effects
//           </CardTitle>
//           <CardDescription>
//             Visual representation of signal degradation
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <ChannelVisualization
//             originalSymbols={symbols}
//             noisySymbols={noisySymbols}
//             fadedSymbols={enableFading ? fadedSymbols : undefined}
//             snrDb={snrDb[0]}
//           />
//         </CardContent>
//       </Card>

//       {/* Performance Metrics */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <TrendingDown className="h-5 w-5" />
//             Performance Analysis
//           </CardTitle>
//           <CardDescription>
//             Impact of channel conditions on system performance
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <PerformanceMetrics
//             snrDb={snrDb[0]}
//             modulationType={modulationType}
//             enableFading={enableFading}
//             fadingType={fadingType}
//           />
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

// // Channel visualization component
// function ChannelVisualization({
//   originalSymbols,
//   noisySymbols,
//   fadedSymbols,
//   snrDb,
// }: {
//   originalSymbols: Array<{ x: number; y: number }>;
//   noisySymbols: Array<{ x: number; y: number }>;
//   fadedSymbols?: Array<{ x: number; y: number }>;
//   snrDb: number;
// }) {
//   const size = 300;
//   const center = size / 2;
//   const scale = 80;

//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//       {/* Before Channel */}
//       <div>
//         <h4 className="font-semibold mb-2 text-sm">Before Channel (Clean)</h4>
//         <svg
//           width={size}
//           height={size}
//           className="border rounded bg-background"
//         >
//           <rect width="100%" height="100%" fill="hsl(var(--background))" />
//           <line
//             x1={0}
//             y1={center}
//             x2={size}
//             y2={center}
//             stroke="hsl(var(--muted-foreground))"
//             strokeWidth="1"
//           />
//           <line
//             x1={center}
//             y1={0}
//             x2={center}
//             y2={size}
//             stroke="hsl(var(--muted-foreground))"
//             strokeWidth="1"
//           />

//           {originalSymbols.map((symbol, i) => (
//             <circle
//               key={i}
//               cx={center + symbol.x * scale}
//               cy={center - symbol.y * scale}
//               r="3"
//               fill="hsl(var(--primary))"
//             />
//           ))}
//         </svg>
//       </div>

//       {/* After Channel */}
//       <div>
//         <h4 className="font-semibold mb-2 text-sm">
//           After Channel (SNR: {snrDb} dB)
//         </h4>
//         <svg
//           width={size}
//           height={size}
//           className="border rounded bg-background"
//         >
//           <rect width="100%" height="100%" fill="hsl(var(--background))" />
//           <line
//             x1={0}
//             y1={center}
//             x2={size}
//             y2={center}
//             stroke="hsl(var(--muted-foreground))"
//             strokeWidth="1"
//           />
//           <line
//             x1={center}
//             y1={0}
//             x2={center}
//             y2={size}
//             stroke="hsl(var(--muted-foreground))"
//             strokeWidth="1"
//           />

//           {/* Original positions (faded) */}
//           {originalSymbols.map((symbol, i) => (
//             <circle
//               key={`orig-${i}`}
//               cx={center + symbol.x * scale}
//               cy={center - symbol.y * scale}
//               r="2"
//               fill="hsl(var(--muted-foreground))"
//               opacity="0.3"
//             />
//           ))}

//           {/* Noisy/faded positions */}
//           {(fadedSymbols || noisySymbols).map((symbol, i) => (
//             <circle
//               key={`noisy-${i}`}
//               cx={center + symbol.x * scale}
//               cy={center - symbol.y * scale}
//               r="2"
//               fill="hsl(var(--destructive))"
//               opacity="0.8"
//             />
//           ))}
//         </svg>
//       </div>
//     </div>
//   );
// }

// // Performance metrics component
// function PerformanceMetrics({
//   snrDb,
//   modulationType,
//   enableFading,
//   fadingType,
// }: {
//   snrDb: number;
//   modulationType: ModulationType;
//   enableFading: boolean;
//   fadingType: "rayleigh" | "rician";
// }) {
//   // Theoretical BER calculations (simplified)
//   const theoreticalBER = useMemo(() => {
//     const snrLinear = Math.pow(10, snrDb / 10);

//     if (modulationType === "BPSK") {
//       if (!enableFading) {
//         // AWGN channel
//         return 0.5 * Math.exp(-snrLinear); // Approximation
//       } else if (fadingType === "rayleigh") {
//         // Rayleigh fading
//         return 0.5 * (1 - Math.sqrt(snrLinear / (1 + snrLinear)));
//       }
//     } else if (modulationType === "QPSK") {
//       if (!enableFading) {
//         // AWGN channel
//         return Math.exp(-snrLinear); // Approximation
//       } else if (fadingType === "rayleigh") {
//         // Rayleigh fading
//         return 1 - Math.sqrt(snrLinear / (1 + snrLinear));
//       }
//     }

//     return 0.1; // Fallback
//   }, [snrDb, modulationType, enableFading, fadingType]);

//   const codingGain = enableFading ? 3 : 0; // dB (simplified)
//   const diversityGain = enableFading ? 2 : 1;

//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//       <div className="text-center p-3 border rounded">
//         <div className="text-lg font-semibold">
//           {(theoreticalBER * 100).toExponential(1)}%
//         </div>
//         <div className="text-xs text-muted-foreground">Theoretical BER</div>
//       </div>
//       <div className="text-center p-3 border rounded">
//         <div className="text-lg font-semibold">{codingGain} dB</div>
//         <div className="text-xs text-muted-foreground">Coding Gain</div>
//       </div>
//       <div className="text-center p-3 border rounded">
//         <div className="text-lg font-semibold">{diversityGain}x</div>
//         <div className="text-xs text-muted-foreground">Diversity Order</div>
//       </div>
//       <div className="text-center p-3 border rounded">
//         <div className="text-lg font-semibold">
//           {enableFading ? "Fading" : "AWGN"}
//         </div>
//         <div className="text-xs text-muted-foreground">Channel Type</div>
//       </div>
//     </div>
//   );
// }

// // Generate fading coefficient
// function generateFadingCoefficient(type: "rayleigh" | "rician"): {
//   magnitude: number;
//   phase: number;
// } {
//   if (type === "rayleigh") {
//     // Rayleigh fading (no LOS)
//     const real = Math.random() * 2 - 1;
//     const imag = Math.random() * 2 - 1;
//     const magnitude = Math.sqrt(real * real + imag * imag);
//     const phase = Math.atan2(imag, real);
//     return { magnitude, phase };
//   } else {
//     // Rician fading (with LOS)
//     const k = 2; // Rician K-factor
//     const losComponent = Math.sqrt(k / (k + 1));
//     const scatteredReal =
//       Math.sqrt(1 / (2 * (k + 1))) * (Math.random() * 2 - 1);
//     const scatteredImag =
//       Math.sqrt(1 / (2 * (k + 1))) * (Math.random() * 2 - 1);

//     const real = losComponent + scatteredReal;
//     const imag = scatteredImag;
//     const magnitude = Math.sqrt(real * real + imag * imag);
//     const phase = Math.atan2(imag, real);
//     return { magnitude, phase };
//   }
// }
