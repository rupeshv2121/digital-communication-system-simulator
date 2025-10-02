/**
 * Hamming Code Implementation
 * Linear error-correcting code that can detect and correct single-bit errors
 */

export interface HammingResult {
  encoded: string;
  originalBits: number;
  encodedBits: number;
  parityBits: number;
  redundancy: number;
  canCorrect: string;
  parityPositions: number[];
  dataPositions: number[];
}

/**
 * Calculate the number of parity bits needed for given data bits
 * Formula: 2^r >= m + r + 1, where m is data bits and r is parity bits
 */
export function calculateParityBits(dataBits: number): number {
  let r = 1;
  while (Math.pow(2, r) < dataBits + r + 1) {
    r++;
  }
  return r;
}

/**
 * Encode data using Hamming(7,4) code
 * For educational purposes, we'll implement the most common Hamming(7,4) code
 */
export function hammingEncode(data: string): HammingResult {
  // Convert input to binary if it's text
  const binaryData = data
    .split("")
    .map((char) => char.charCodeAt(0).toString(2).padStart(8, "0"))
    .join("");

  let encodedResult = "";
  const chunks = [];

  // Process data in 4-bit chunks for Hamming(7,4)
  for (let i = 0; i < binaryData.length; i += 4) {
    const chunk = binaryData.slice(i, i + 4).padEnd(4, "0");
    const encoded = encodeHamming74(chunk);
    chunks.push(encoded);
    encodedResult += encoded;
  }

  const dataBits = Math.ceil(binaryData.length / 4) * 4;
  const parityBits = Math.ceil(binaryData.length / 4) * 3;
  const totalBits = dataBits + parityBits;

  return {
    encoded: encodedResult,
    originalBits: binaryData.length,
    encodedBits: totalBits,
    parityBits: parityBits,
    redundancy: ((totalBits - binaryData.length) / binaryData.length) * 100,
    canCorrect: "Single-bit errors",
    parityPositions: [1, 2, 4], // Positions 1, 2, 4 in 7-bit code
    dataPositions: [3, 5, 6, 7], // Positions 3, 5, 6, 7 in 7-bit code
  };
}

/**
 * Encode 4 data bits using Hamming(7,4) code
 * Returns 7-bit codeword: p1 p2 d1 p3 d2 d3 d4
 */
function encodeHamming74(dataBits: string): string {
  const d = dataBits.split("").map(Number);

  // Calculate parity bits
  const p1 = d[0] ^ d[1] ^ d[3]; // XOR of positions 3, 5, 7
  const p2 = d[0] ^ d[2] ^ d[3]; // XOR of positions 3, 6, 7
  const p3 = d[1] ^ d[2] ^ d[3]; // XOR of positions 5, 6, 7

  // Return 7-bit codeword: p1 p2 d1 p3 d2 d3 d4
  return `${p1}${p2}${d[0]}${p3}${d[1]}${d[2]}${d[3]}`;
}

/**
 * Decode Hamming code and detect/correct errors
 */
export function hammingDecode(encodedData: string): {
  decoded: string;
  hasError: boolean;
  errorPosition: number;
  corrected: string;
} {
  let decodedResult = "";
  let hasError = false;
  let errorPosition = 0;
  let correctedData = encodedData;

  // Process in 7-bit chunks
  for (let i = 0; i < encodedData.length; i += 7) {
    const chunk = encodedData.slice(i, i + 7).padEnd(7, "0");
    const result = decodeHamming74(chunk);

    if (result.errorPosition > 0) {
      hasError = true;
      errorPosition = i + result.errorPosition;
      // Correct the error in the chunk
      const correctedChunk = chunk.split("");
      correctedChunk[result.errorPosition - 1] =
        correctedChunk[result.errorPosition - 1] === "0" ? "1" : "0";
      correctedData =
        correctedData.substring(0, i) +
        correctedChunk.join("") +
        correctedData.substring(i + 7);
    }

    decodedResult += result.data;
  }

  return {
    decoded: decodedResult,
    hasError,
    errorPosition,
    corrected: correctedData,
  };
}

/**
 * Decode a single 7-bit Hamming codeword
 */
function decodeHamming74(codeword: string): {
  data: string;
  errorPosition: number;
} {
  const bits = codeword.split("").map(Number);

  // Extract received bits: p1 p2 d1 p3 d2 d3 d4
  const [p1, p2, d1, p3, d2, d3, d4] = bits;

  // Calculate syndrome
  const s1 = p1 ^ d1 ^ d2 ^ d4; // Check positions 1, 3, 5, 7
  const s2 = p2 ^ d1 ^ d3 ^ d4; // Check positions 2, 3, 6, 7
  const s3 = p3 ^ d2 ^ d3 ^ d4; // Check positions 4, 5, 6, 7

  // Convert syndrome to error position
  const errorPosition = s1 * 1 + s2 * 2 + s3 * 4;

  // Extract data bits (positions 3, 5, 6, 7)
  const data = `${d1}${d2}${d3}${d4}`;

  return {
    data,
    errorPosition,
  };
}

/**
 * Introduce a random single-bit error for demonstration
 */
export function introduceError(data: string, position?: number): string {
  const bits = data.split("");
  const errorPos = position ?? Math.floor(Math.random() * bits.length);

  if (errorPos < bits.length) {
    bits[errorPos] = bits[errorPos] === "0" ? "1" : "0";
  }

  return bits.join("");
}
