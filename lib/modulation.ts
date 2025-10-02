// /**
//  * Digital Modulation Implementation
//  * BPSK (Binary Phase Shift Keying) and QPSK (Quadrature Phase Shift Keying)
//  */

// // export type ModulationType = 'BPSK' | 'QPSK'

// // export interface ConstellationPoint {
// //   x: number
// //   y: number
// //   bits: string
// //   amplitude: number
// //   phase: number
// // }

// // export interface ModulationResult {
// //   type: ModulationType
// //   symbols: ConstellationPoint[]
// //   constellation: ConstellationPoint[]
// //   symbolRate: number
// //   bitRate: number
// //   energyPerBit: number
// //   averagePower: number
// // }

// // /**
// //  * BPSK Modulation
// //  * Maps: 0 → -1+0j, 1 → +1+0j
// //  */
// // export function bpskModulate(data: string): ModulationResult {
// //   const bits = data.split('')
// //   const symbols: ConstellationPoint[] = []

// //   // BPSK constellation points
// //   const constellation: ConstellationPoint[] = [
// //     { x: -1, y: 0, bits: '0', amplitude: 1, phase: Math.PI },
// //     { x: 1, y: 0, bits: '1', amplitude: 1, phase: 0 }
// //   ]

// //   // Map each bit to a symbol
// //   bits.forEach((bit, index) => {
// //     const symbol = bit === '0'
// //       ? { x: -1, y: 0, bits: '0', amplitude: 1, phase: Math.PI }
// //       : { x: 1, y: 0, bits: '1', amplitude: 1, phase: 0 }
// //     symbols.push(symbol)
// //   })

// //   const symbolRate = 1 // 1 symbol per bit for BPSK
// //   const bitRate = bits.length
// //   const energyPerBit = 1 // Normalized
// //   const averagePower = 1 // Normalized

// //   return {
// //     type: 'BPSK',
// //     symbols,
// //     constellation,
// //     symbolRate,
// //     bitRate,
// //     energyPerBit,
// //     averagePower
// //   }
// // }

// // /**
// //  * QPSK Modulation
// //  * Maps: 00 → -1-1j, 01 → -1+1j, 10 → +1-1j, 11 → +1+1j
// //  */
// // export function qpskModulate(data: string): ModulationResult {
// //   // Pad data to even length
// //   const paddedData = data.length % 2 === 1 ? data + '0' : data
// //   const symbols: ConstellationPoint[] = []

// //   // QPSK constellation points (Gray coding)
// //   const constellation: ConstellationPoint[] = [
// //     { x: -1/Math.sqrt(2), y: -1/Math.sqrt(2), bits: '00', amplitude: 1, phase: 5*Math.PI/4 },
// //     { x: -1/Math.sqrt(2), y: 1/Math.sqrt(2), bits: '01', amplitude: 1, phase: 3*Math.PI/4 },
// //     { x: 1/Math.sqrt(2), y: -1/Math.sqrt(2), bits: '10', amplitude: 1, phase: 7*Math.PI/4 },
// //     { x: 1/Math.sqrt(2), y: 1/Math.sqrt(2), bits: '11', amplitude: 1, phase: Math.PI/4 }
// //   ]

// //   // Map every 2 bits to a symbol
// //   for (let i = 0; i < paddedData.length; i += 2) {
// //     const dibits = paddedData.slice(i, i + 2)
// //     let symbol: ConstellationPoint

// //     switch (dibits) {
// //       case '00':
// //         symbol = { x: -1/Math.sqrt(2), y: -1/Math.sqrt(2), bits: '00', amplitude: 1, phase: 5*Math.PI/4 }
// //         break
// //       case '01':
// //         symbol = { x: -1/Math.sqrt(2), y: 1/Math.sqrt(2), bits: '01', amplitude: 1, phase: 3*Math.PI/4 }
// //         break
// //       case '10':
// //         symbol = { x: 1/Math.sqrt(2), y: -1/Math.sqrt(2), bits: '10', amplitude: 1, phase: 7*Math.PI/4 }
// //         break
// //       case '11':
// //         symbol = { x: 1/Math.sqrt(2), y: 1/Math.sqrt(2), bits: '11', amplitude: 1, phase: Math.PI/4 }
// //         break
// //       default:
// //         symbol = constellation[0]
// //     }
// //     symbols.push(symbol)
// //   }

// //   const symbolRate = paddedData.length / 2 // 2 bits per symbol
// //   const bitRate = paddedData.length
// //   const energyPerBit = 1 // Normalized
// //   const averagePower = 1 // Normalized

// //   return {
// //     type: 'QPSK',
// //     symbols,
// //     constellation,
// //     symbolRate,
// //     bitRate,
// //     energyPerBit,
// //     averagePower
// //   }
// // }

// /**
//  * Modulate data with specified scheme
//  */
// // export function modulate(data: string, type: ModulationType): ModulationResult {
// //   switch (type) {
// //     case "BPSK":
// //       return bpskModulate(data);
// //     case "QPSK":
// //       return qpskModulate(data);
// //     default:
// //       throw new Error(`Unsupported modulation type: ${type}`);
// //   }
// // }

// /**
//  * Demodulate symbols back to bits (hard decision)
//  */
// export function demodulate(
//   symbols: ConstellationPoint[],
//   type: ModulationType
// ): string {
//   let result = "";

//   symbols.forEach((symbol) => {
//     if (type === "BPSK") {
//       // Hard decision: check if closer to +1 or -1
//       result += symbol.x >= 0 ? "1" : "0";
//     } else if (type === "QPSK") {
//       // Hard decision: determine quadrant
//       const i = symbol.x >= 0 ? "1" : "0";
//       const q = symbol.y >= 0 ? "1" : "0";

//       // Gray code mapping
//       if (i === "0" && q === "0") result += "00";
//       else if (i === "0" && q === "1") result += "01";
//       else if (i === "1" && q === "0") result += "10";
//       else result += "11";
//     }
//   });

//   return result;
// }

// /**
//  * Add AWGN noise to symbols
//  */
// export function addNoise(
//   symbols: ConstellationPoint[],
//   snrDb: number
// ): ConstellationPoint[] {
//   const snrLinear = Math.pow(10, snrDb / 10);
//   const noiseVariance = 1 / (2 * snrLinear); // For unit signal power

//   return symbols.map((symbol) => ({
//     ...symbol,
//     x: symbol.x + gaussianRandom() * Math.sqrt(noiseVariance),
//     y: symbol.y + gaussianRandom() * Math.sqrt(noiseVariance),
//   }));
// }

// /**
//  * Generate Gaussian random number (Box-Muller transform)
//  */
// function gaussianRandom(): number {
//   let u = 0,
//     v = 0;
//   while (u === 0) u = Math.random(); // Converting [0,1) to (0,1)
//   while (v === 0) v = Math.random();
//   return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
// }

// /**
//  * Calculate bit error rate between original and received bits
//  */
// export function calculateBER(original: string, received: string): number {
//   const minLength = Math.min(original.length, received.length);
//   let errors = 0;

//   for (let i = 0; i < minLength; i++) {
//     if (original[i] !== received[i]) {
//       errors++;
//     }
//   }

//   return errors / minLength;
// }
