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
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   addNoise,
//   calculateBER,
//   demodulate,
//   modulate,
//   type ModulationType,
// } from "@/lib/modulation";
// import { Activity, Radio, Zap } from "lucide-react";
// import { useMemo, useState } from "react";

// // Constellation diagram component
// function ConstellationDiagram({
//   modResult,
//   noisySymbols,
//   title,
// }: {
//   modResult: ReturnType<typeof modulate>;
//   noisySymbols?: ReturnType<typeof modulate>["symbols"];
//   title: string;
// }) {
//   const size = 300;
//   const center = size / 2;
//   const scale = 80; // Scale factor for constellation points

//   return (
//     <div className="space-y-2">
//       <h4 className="font-semibold text-sm">{title}</h4>
//       <svg
//         width={size}
//         height={size}
//         className="border rounded bg-background"
//         viewBox={`0 0 ${size} ${size}`}
//       >
//         {/* Grid */}
//         <defs>
//           <pattern
//             id="grid"
//             width="20"
//             height="20"
//             patternUnits="userSpaceOnUse"
//           >
//             <path
//               d="M 20 0 L 0 0 0 20"
//               fill="none"
//               stroke="hsl(var(--muted))"
//               strokeWidth="0.5"
//             />
//           </pattern>
//         </defs>
//         <rect width="100%" height="100%" fill="url(#grid)" />

//         {/* Axes */}
//         <line
//           x1={0}
//           y1={center}
//           x2={size}
//           y2={center}
//           stroke="hsl(var(--muted-foreground))"
//           strokeWidth="1"
//         />
//         <line
//           x1={center}
//           y1={0}
//           x2={center}
//           y2={size}
//           stroke="hsl(var(--muted-foreground))"
//           strokeWidth="1"
//         />

//         {/* Axis labels */}
//         <text
//           x={size - 10}
//           y={center - 5}
//           fontSize="10"
//           fill="hsl(var(--muted-foreground))"
//         >
//           I
//         </text>
//         <text
//           x={center + 5}
//           y={15}
//           fontSize="10"
//           fill="hsl(var(--muted-foreground))"
//         >
//           Q
//         </text>

//         {/* Constellation points (ideal) */}
//         {modResult.constellation.map((point, i) => (
//           <g key={i}>
//             <circle
//               cx={center + point.x * scale}
//               cy={center - point.y * scale}
//               r="4"
//               fill="hsl(var(--primary))"
//               stroke="white"
//               strokeWidth="2"
//             />
//             <text
//               x={center + point.x * scale + 8}
//               y={center - point.y * scale + 3}
//               fontSize="10"
//               fill="hsl(var(--foreground))"
//               fontFamily="monospace"
//             >
//               {point.bits}
//             </text>
//           </g>
//         ))}

//         {/* Noisy symbols */}
//         {noisySymbols?.map((symbol, i) => (
//           <circle
//             key={`noisy-${i}`}
//             cx={center + symbol.x * scale}
//             cy={center - symbol.y * scale}
//             r="2"
//             fill="hsl(var(--destructive))"
//             opacity="0.7"
//           />
//         ))}

//         {/* Legend */}
//         <g transform="translate(10, 10)">
//           <circle
//             cx={0}
//             cy={0}
//             r="4"
//             fill="hsl(var(--primary))"
//             stroke="white"
//             strokeWidth="2"
//           />
//           <text x={10} y={3} fontSize="9" fill="hsl(var(--foreground))">
//             Ideal
//           </text>
//           {noisySymbols && (
//             <>
//               <circle cx={0} cy={15} r="2" fill="hsl(var(--destructive))" />
//               <text x={10} y={18} fontSize="9" fill="hsl(var(--foreground))">
//                 Noisy
//               </text>
//             </>
//           )}
//         </g>
//       </svg>
//     </div>
//   );
// }

// export function DigitalModulation() {
//   const [inputBits, setInputBits] = useState("1101000111");
//   const [modulationType, setModulationType] = useState<ModulationType>("BPSK");
//   const [snrDb, setSnrDb] = useState(10);
//   const [addNoiseEnabled, setAddNoiseEnabled] = useState(false);

//   // Modulation
//   const modulated = useMemo(() => {
//     if (!inputBits) return null;
//     return modulate(inputBits, modulationType);
//   }, [inputBits, modulationType]);

//   // Add noise to symbols
//   const noisySymbols = useMemo(() => {
//     if (!modulated || !addNoiseEnabled) return null;
//     return addNoise(modulated.symbols, snrDb);
//   }, [modulated, addNoiseEnabled, snrDb]);

//   // Demodulation
//   const demodulated = useMemo(() => {
//     if (!modulated) return null;
//     const symbolsToDemod = noisySymbols || modulated.symbols;
//     return demodulate(symbolsToDemod, modulationType);
//   }, [modulated, noisySymbols, modulationType]);

//   // Calculate BER
//   const ber = useMemo(() => {
//     if (!demodulated) return 0;
//     return calculateBER(inputBits, demodulated);
//   }, [inputBits, demodulated]);

//   return (
//     <div className="space-y-6">
//       {/* Input Section */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <Radio className="h-5 w-5" />
//             Digital Modulation Input
//           </CardTitle>
//           <CardDescription>
//             Enter binary data to modulate using BPSK or QPSK
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4">
//             <Textarea
//               value={inputBits}
//               onChange={(e) =>
//                 setInputBits(e.target.value.replace(/[^01]/g, ""))
//               }
//               placeholder="Enter binary data (0s and 1s only)..."
//               className="min-h-[80px] font-mono text-sm"
//             />

//             <div className="flex flex-wrap gap-4 items-center">
//               <div className="flex items-center gap-2">
//                 <label className="text-sm font-medium">Modulation:</label>
//                 <Select
//                   value={modulationType}
//                   onValueChange={(value: string) =>
//                     setModulationType(value as ModulationType)
//                   }
//                 >
//                   <SelectTrigger className="w-24">
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="BPSK">BPSK</SelectItem>
//                     <SelectItem value="QPSK">QPSK</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="text-xs text-muted-foreground">
//                 Bits: {inputBits.length} | Valid:{" "}
//                 {inputBits.replace(/[^01]/g, "").length}
//               </div>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {modulated && (
//         <>
//           {/* Modulation Statistics */}
//           <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
//             <Card>
//               <CardHeader className="pb-2 sm:pb-3">
//                 <CardDescription className="text-xs sm:text-sm">
//                   Input Bits
//                 </CardDescription>
//                 <CardTitle className="text-lg sm:text-xl lg:text-2xl">
//                   {modulated.bitRate}
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-xs text-muted-foreground">Binary data</div>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader className="pb-2 sm:pb-3">
//                 <CardDescription className="text-xs sm:text-sm">
//                   Symbols
//                 </CardDescription>
//                 <CardTitle className="text-lg sm:text-xl lg:text-2xl">
//                   {modulated.symbols.length}
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-xs text-muted-foreground">
//                   {modulationType === "BPSK" ? "1 bit/symbol" : "2 bits/symbol"}
//                 </div>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader className="pb-2 sm:pb-3">
//                 <CardDescription className="text-xs sm:text-sm">
//                   Spectral Efficiency
//                 </CardDescription>
//                 <CardTitle className="text-lg sm:text-xl lg:text-2xl">
//                   {modulationType === "BPSK" ? "1" : "2"} bps/Hz
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-xs text-muted-foreground">
//                   Bits per second per Hz
//                 </div>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader className="pb-2 sm:pb-3">
//                 <CardDescription className="text-xs sm:text-sm">
//                   BER
//                 </CardDescription>
//                 <CardTitle className="text-lg sm:text-xl lg:text-2xl">
//                   {(ber * 100).toFixed(1)}%
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-xs text-muted-foreground">
//                   {ber === 0
//                     ? "No errors"
//                     : `${Math.round(ber * inputBits.length)} errors`}
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Channel Simulation */}
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <Activity className="h-5 w-5" />
//                 Channel Simulation
//               </CardTitle>
//               <CardDescription>
//                 Add AWGN noise to simulate realistic channel conditions
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 <div className="flex flex-wrap items-center gap-4">
//                   <Button
//                     onClick={() => setAddNoiseEnabled(!addNoiseEnabled)}
//                     variant={addNoiseEnabled ? "destructive" : "outline"}
//                     size="sm"
//                   >
//                     {addNoiseEnabled ? "Remove Noise" : "Add Noise"}
//                   </Button>

//                   {addNoiseEnabled && (
//                     <div className="flex items-center gap-2">
//                       <label className="text-sm font-medium">SNR (dB):</label>
//                       <input
//                         type="range"
//                         min="0"
//                         max="20"
//                         value={snrDb}
//                         onChange={(e) => setSnrDb(Number(e.target.value))}
//                         className="w-20"
//                       />
//                       <span className="text-sm font-mono min-w-[40px]">
//                         {snrDb} dB
//                       </span>
//                     </div>
//                   )}
//                 </div>

//                 {addNoiseEnabled && (
//                   <div className="flex flex-wrap gap-2">
//                     <Badge variant="outline">SNR: {snrDb} dB</Badge>
//                     <Badge variant={ber === 0 ? "default" : "destructive"}>
//                       BER: {(ber * 100).toFixed(2)}%
//                     </Badge>
//                   </div>
//                 )}
//               </div>
//             </CardContent>
//           </Card>

//           {/* Constellation Diagrams */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             <Card>
//               <CardHeader>
//                 <CardTitle>{modulationType} Constellation</CardTitle>
//                 <CardDescription>Signal constellation diagram</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <ConstellationDiagram
//                   modResult={modulated}
//                   noisySymbols={
//                     addNoiseEnabled ? noisySymbols || undefined : undefined
//                   }
//                   title="Constellation Points"
//                 />
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader>
//                 <CardTitle>Modulation Analysis</CardTitle>
//                 <CardDescription>Symbol mapping and properties</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   <div className="w-full overflow-x-auto">
//                     <Table>
//                       <TableHeader>
//                         <TableRow>
//                           <TableHead className="min-w-[60px]">Bits</TableHead>
//                           <TableHead className="min-w-[40px]">I</TableHead>
//                           <TableHead className="min-w-[40px]">Q</TableHead>
//                           <TableHead className="min-w-[70px]">Phase</TableHead>
//                         </TableRow>
//                       </TableHeader>
//                       <TableBody>
//                         {modulated.constellation.map((point, i) => (
//                           <TableRow key={i}>
//                             <TableCell className="font-mono font-semibold">
//                               {point.bits}
//                             </TableCell>
//                             <TableCell className="font-mono">
//                               {point.x.toFixed(2)}
//                             </TableCell>
//                             <TableCell className="font-mono">
//                               {point.y.toFixed(2)}
//                             </TableCell>
//                             <TableCell className="font-mono">
//                               {((point.phase * 180) / Math.PI).toFixed(0)}°
//                             </TableCell>
//                           </TableRow>
//                         ))}
//                       </TableBody>
//                     </Table>
//                   </div>

//                   <div className="text-xs space-y-1 text-muted-foreground">
//                     <p>
//                       <strong>Gray Coding:</strong> Adjacent symbols differ by 1
//                       bit
//                     </p>
//                     <p>
//                       <strong>Unit Circle:</strong> All symbols have equal
//                       energy
//                     </p>
//                     <p>
//                       <strong>{modulationType}:</strong>{" "}
//                       {modulationType === "BPSK" ? "Binary" : "Quadrature"}{" "}
//                       Phase Shift Keying
//                     </p>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Demodulation Results */}
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <Zap className="h-5 w-5" />
//                 Demodulation Results
//               </CardTitle>
//               <CardDescription>
//                 Received signal processing and bit recovery
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <h4 className="font-semibold mb-2">Transmitted Bits</h4>
//                     <div className="p-3 bg-muted rounded font-mono text-xs break-all max-h-24 overflow-y-auto">
//                       {inputBits}
//                     </div>
//                   </div>
//                   <div>
//                     <h4 className="font-semibold mb-2">Received Bits</h4>
//                     <div className="p-3 bg-muted rounded font-mono text-xs break-all max-h-24 overflow-y-auto">
//                       {demodulated}
//                     </div>
//                   </div>
//                 </div>

//                 <div className="flex flex-wrap gap-2">
//                   <Badge variant={ber === 0 ? "default" : "destructive"}>
//                     {ber === 0
//                       ? "✓ Perfect Reception"
//                       : `✗ ${Math.round(ber * inputBits.length)} Bit Errors`}
//                   </Badge>
//                   <Badge variant="outline">
//                     Success Rate: {((1 - ber) * 100).toFixed(1)}%
//                   </Badge>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </>
//       )}
//     </div>
//   );
// }
