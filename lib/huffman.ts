/**
 * Huffman Coding Implementation
 * A lossless data compression algorithm that assigns variable-length codes
 * to characters based on their frequency of occurrence.
 */

/**
 * Represents a node in the Huffman tree
 */
export interface HuffmanNode {
  char: string | null // null for internal nodes
  frequency: number
  left: HuffmanNode | null
  right: HuffmanNode | null
}

/**
 * Represents the frequency of a character in the input text
 */
export interface CharFrequency {
  char: string
  frequency: number
  percentage: number
}

/**
 * Represents a Huffman code mapping
 */
export interface HuffmanCode {
  char: string
  code: string
  frequency: number
  bits: number
}

/**
 * Complete result of Huffman encoding
 */
export interface HuffmanResult {
  encoded: string
  codes: HuffmanCode[]
  frequencies: CharFrequency[]
  originalBits: number
  encodedBits: number
  compressionRatio: number
  spaceSavings: number
  tree: HuffmanNode | null
}

/**
 * Builds a frequency table from the input text
 */
function buildFrequencyTable(text: string): Map<string, number> {
  const frequencyMap = new Map<string, number>()

  for (const char of text) {
    frequencyMap.set(char, (frequencyMap.get(char) || 0) + 1)
  }

  return frequencyMap
}

/**
 * Creates a leaf node for the Huffman tree
 */
function createNode(
  char: string | null,
  frequency: number,
  left: HuffmanNode | null = null,
  right: HuffmanNode | null = null,
): HuffmanNode {
  return { char, frequency, left, right }
}

/**
 * Builds the Huffman tree using a priority queue approach
 */
function buildHuffmanTree(frequencyMap: Map<string, number>): HuffmanNode | null {
  if (frequencyMap.size === 0) return null

  // Create leaf nodes for each character
  const nodes: HuffmanNode[] = Array.from(frequencyMap.entries()).map(([char, frequency]) =>
    createNode(char, frequency),
  )

  // Handle single character case
  if (nodes.length === 1) {
    return createNode(null, nodes[0].frequency, nodes[0], null)
  }

  // Build tree by repeatedly combining two nodes with lowest frequency
  while (nodes.length > 1) {
    // Sort by frequency (ascending)
    nodes.sort((a, b) => a.frequency - b.frequency)

    // Take two nodes with lowest frequency
    const left = nodes.shift()!
    const right = nodes.shift()!

    // Create parent node with combined frequency
    const parent = createNode(null, left.frequency + right.frequency, left, right)

    // Add parent back to the list
    nodes.push(parent)
  }

  return nodes[0]
}

/**
 * Generates Huffman codes by traversing the tree
 */
function generateCodes(
  node: HuffmanNode | null,
  code = "",
  codeMap: Map<string, string> = new Map(),
): Map<string, string> {
  if (!node) return codeMap

  // Leaf node - store the code
  if (node.char !== null) {
    // Handle single character case - assign '0'
    codeMap.set(node.char, code || "0")
    return codeMap
  }

  // Traverse left (add '0') and right (add '1')
  generateCodes(node.left, code + "0", codeMap)
  generateCodes(node.right, code + "1", codeMap)

  return codeMap
}

/**
 * Main function to perform Huffman encoding
 */
export function huffmanEncode(text: string): HuffmanResult {
  // Handle empty input
  if (text.length === 0) {
    return {
      encoded: "",
      codes: [],
      frequencies: [],
      originalBits: 0,
      encodedBits: 0,
      compressionRatio: 0,
      spaceSavings: 0,
      tree: null,
    }
  }

  // Step 1: Build frequency table
  const frequencyMap = buildFrequencyTable(text)
  const totalChars = text.length

  // Step 2: Build Huffman tree
  const tree = buildHuffmanTree(frequencyMap)

  // Step 3: Generate codes
  const codeMap = generateCodes(tree)

  // Step 4: Encode the text
  let encoded = ""
  for (const char of text) {
    encoded += codeMap.get(char) || ""
  }

  // Step 5: Calculate statistics
  const originalBits = text.length * 8 // ASCII uses 8 bits per character
  const encodedBits = encoded.length
  const compressionRatio = originalBits / encodedBits
  const spaceSavings = ((originalBits - encodedBits) / originalBits) * 100

  // Step 6: Prepare frequency data
  const frequencies: CharFrequency[] = Array.from(frequencyMap.entries())
    .map(([char, frequency]) => ({
      char,
      frequency,
      percentage: (frequency / totalChars) * 100,
    }))
    .sort((a, b) => b.frequency - a.frequency)

  // Step 7: Prepare code data
  const codes: HuffmanCode[] = Array.from(codeMap.entries())
    .map(([char, code]) => ({
      char,
      code,
      frequency: frequencyMap.get(char) || 0,
      bits: code.length,
    }))
    .sort((a, b) => b.frequency - a.frequency)

  return {
    encoded,
    codes,
    frequencies,
    originalBits,
    encodedBits,
    compressionRatio,
    spaceSavings,
    tree,
  }
}

/**
 * Decodes a Huffman encoded string using the tree
 */
export function huffmanDecode(encoded: string, tree: HuffmanNode | null): string {
  if (!tree || encoded.length === 0) return ""

  let decoded = ""
  let currentNode = tree

  for (const bit of encoded) {
    // Traverse tree based on bit
    if (bit === "0") {
      currentNode = currentNode.left || currentNode
    } else {
      currentNode = currentNode.right || currentNode
    }

    // If we reach a leaf node, add character to result
    if (currentNode.char !== null) {
      decoded += currentNode.char
      currentNode = tree // Reset to root
    }
  }

  return decoded
}
