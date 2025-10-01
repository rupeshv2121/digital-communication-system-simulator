"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { huffmanDecode, huffmanEncode, HuffmanNode } from "@/lib/huffman";
import { BarChart3, Binary, TreePine } from "lucide-react";
import { useMemo, useState } from "react";

// Tree visualization component
function HuffmanTreeVisualization({ tree }: { tree: HuffmanNode | null }) {
  if (!tree) return null;

  const renderNode = (
    node: HuffmanNode | null,
    x: number,
    y: number,
    level: number = 0
  ): JSX.Element | null => {
    if (!node) return null;

    const isLeaf = !node.left && !node.right;
    const nodeRadius = 25;
    const levelHeight = 100;
    // Adjust spacing based on level to fit in fixed viewport
    const nodeSpacing = Math.max(40, 200 / Math.pow(1.6, level));

    return (
      <g key={`${x}-${y}-${node.char || "internal"}-${level}`}>
        {/* Enhanced Lines to children */}
        {node.left && (
          <g>
            {/* Shadow line for depth */}
            <line
              x1={x}
              y1={y + nodeRadius}
              x2={x - nodeSpacing}
              y2={y + levelHeight - nodeRadius}
              stroke="rgba(0,0,0,0.1)"
              strokeWidth="4"
            />
            {/* Main line */}
            <line
              x1={x}
              y1={y + nodeRadius}
              x2={x - nodeSpacing}
              y2={y + levelHeight - nodeRadius}
              stroke="hsl(var(--destructive))"
              strokeWidth="3"
              opacity="0.8"
              strokeDasharray="none"
            />
          </g>
        )}
        {node.right && (
          <g>
            {/* Shadow line for depth */}
            <line
              x1={x}
              y1={y + nodeRadius}
              x2={x + nodeSpacing}
              y2={y + levelHeight - nodeRadius}
              stroke="rgba(0,0,0,0.1)"
              strokeWidth="4"
            />
            {/* Main line */}
            <line
              x1={x}
              y1={y + nodeRadius}
              x2={x + nodeSpacing}
              y2={y + levelHeight - nodeRadius}
              stroke="hsl(var(--primary))"
              strokeWidth="3"
              opacity="0.8"
              strokeDasharray="none"
            />
          </g>
        )}

        {/* Node background circle */}
        <circle cx={x} cy={y} r={nodeRadius + 2} fill="white" stroke="none" />

        {/* Node circle */}
        <circle
          cx={x}
          cy={y}
          r={nodeRadius}
          fill={isLeaf ? "hsl(var(--primary))" : "hsl(var(--secondary))"}
          stroke={isLeaf ? "hsl(var(--primary))" : "hsl(var(--border))"}
          strokeWidth="2"
          style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))" }}
        />

        {/* Node content - Character */}
        {isLeaf && (
          <text
            x={x}
            y={y - 3}
            textAnchor="middle"
            fontSize="14"
            fill="hsl(var(--primary-foreground))"
            fontWeight="bold"
            fontFamily="monospace"
          >
            {node.char === " " ? "␣" : node.char}
          </text>
        )}

        {/* Node content - Frequency */}
        <text
          x={x}
          y={isLeaf ? y + 10 : y + 2}
          textAnchor="middle"
          fontSize="10"
          fill={
            isLeaf ? "hsl(var(--primary-foreground))" : "hsl(var(--foreground))"
          }
          fontWeight="600"
        >
          {node.frequency}
        </text>

        {/* Edge labels for binary codes with background */}
        {node.left && (
          <g>
            <circle
              cx={x - nodeSpacing / 2}
              cy={y + levelHeight / 2}
              r="12"
              fill="hsl(var(--destructive))"
              stroke="white"
              strokeWidth="2"
            />
            <text
              x={x - nodeSpacing / 2}
              y={y + levelHeight / 2 + 3}
              textAnchor="middle"
              fontSize="12"
              fill="white"
              fontWeight="bold"
            >
              0
            </text>
          </g>
        )}
        {node.right && (
          <g>
            <circle
              cx={x + nodeSpacing / 2}
              cy={y + levelHeight / 2}
              r="12"
              fill="hsl(var(--primary))"
              stroke="white"
              strokeWidth="2"
            />
            <text
              x={x + nodeSpacing / 2}
              y={y + levelHeight / 2 + 3}
              textAnchor="middle"
              fontSize="12"
              fill="white"
              fontWeight="bold"
            >
              1
            </text>
          </g>
        )}

        {/* Recursive rendering of children */}
        {renderNode(node.left, x - nodeSpacing, y + levelHeight, level + 1)}
        {renderNode(node.right, x + nodeSpacing, y + levelHeight, level + 1)}
      </g>
    );
  };

  // Calculate tree dimensions with better spacing
  const maxDepth = getTreeDepth(tree);
  const baseWidth = 600;
  const baseHeight = Math.max(300, maxDepth * 100 + 100);

  return (
    <div className="w-full bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 rounded-lg p-4">
      <div className="w-full max-w-full">
        <svg
          width="100%"
          height={baseHeight}
          className="mx-auto max-w-full"
          viewBox={`0 0 ${baseWidth} ${baseHeight}`}
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <filter id="shadow" x="0%" y="-20%" width="50%" height="100%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.1" />
            </filter>
          </defs>
          {renderNode(tree, baseWidth / 2, 50)}
        </svg>
      </div>

      {/* Legend */}
      <div className="mt-4 grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-4 justify-center text-xs sm:text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-primary flex-shrink-0"></div>
          <span className="truncate">Character</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-secondary border flex-shrink-0"></div>
          <span className="truncate">Internal</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-destructive text-white text-xs flex items-center justify-center font-bold flex-shrink-0">
            0
          </div>
          <span className="truncate">Left (0)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold flex-shrink-0">
            1
          </div>
          <span className="truncate">Right (1)</span>
        </div>
      </div>
    </div>
  );
}

// Helper function to calculate tree depth
function getTreeDepth(node: HuffmanNode | null): number {
  if (!node) return 0;
  return Math.max(getTreeDepth(node.left), getTreeDepth(node.right)) + 1;
}

export function HuffmanEncoder() {
  const [inputText, setInputText] = useState("hello world");

  // Compute Huffman encoding result - no need for useEffect
  const result = useMemo(() => {
    if (!inputText) {
      return null;
    }
    return huffmanEncode(inputText);
  }, [inputText]);

  // Verify decoding works correctly
  const decodedText = useMemo(() => {
    if (!result) return "";
    return huffmanDecode(result.encoded, result.tree);
  }, [result]);

  const isDecodingCorrect = decodedText === inputText;

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Binary className="h-5 w-5" />
            Input Text
          </CardTitle>
          <CardDescription>
            Enter any text to encode using Huffman coding algorithm
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type or paste your text here..."
            className="min-h-[100px] sm:min-h-[120px] font-mono text-sm sm:text-base"
          />
          <div className="mt-2 text-xs sm:text-sm text-muted-foreground flex flex-wrap gap-2">
            <span>Characters: {inputText.length}</span>
            <span>•</span>
            <span>Unique: {result?.frequencies.length || 0}</span>
          </div>
        </CardContent>
      </Card>

      {result && (
        <>
          {/* Compression Statistics */}
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {/* Rest remains the same */}
            <Card>
              <CardHeader className="pb-2 sm:pb-3">
                <CardDescription className="text-xs sm:text-sm">
                  Original Size
                </CardDescription>
                <CardTitle className="text-lg sm:text-xl lg:text-2xl">
                  {result.originalBits} bits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  {inputText.length} chars × 8 bits
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2 sm:pb-3">
                <CardDescription className="text-xs sm:text-sm">
                  Encoded Size
                </CardDescription>
                <CardTitle className="text-lg sm:text-xl lg:text-2xl">
                  {result.encodedBits} bits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  Variable-length codes
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2 sm:pb-3">
                <CardDescription className="text-xs sm:text-sm">
                  Compression Ratio
                </CardDescription>
                <CardTitle className="text-lg sm:text-xl lg:text-2xl">
                  {result.compressionRatio.toFixed(2)}:1
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  {result.compressionRatio > 1 ? "Compressed" : "Expanded"}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2 sm:pb-3">
                <CardDescription className="text-xs sm:text-sm">
                  Space Savings
                </CardDescription>
                <CardTitle className="text-lg sm:text-xl lg:text-2xl">
                  {result.spaceSavings.toFixed(1)}%
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  {result.originalBits - result.encodedBits} bits saved
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="encoded" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto">
              <TabsTrigger
                value="encoded"
                className="text-xs sm:text-sm px-2 sm:px-3"
              >
                <span className="hidden sm:inline">Encoded Output</span>
                <span className="sm:hidden">Encoded</span>
              </TabsTrigger>
              <TabsTrigger
                value="tree"
                className="text-xs sm:text-sm px-2 sm:px-3"
              >
                <span className="hidden sm:inline">Huffman Tree</span>
                <span className="sm:hidden">Tree</span>
              </TabsTrigger>
              <TabsTrigger
                value="codes"
                className="text-xs sm:text-sm px-2 sm:px-3"
              >
                <span className="hidden sm:inline">Huffman Codes</span>
                <span className="sm:hidden">Codes</span>
              </TabsTrigger>
              <TabsTrigger
                value="frequencies"
                className="text-xs sm:text-sm px-2 sm:px-3"
              >
                <span className="hidden sm:inline">Frequency Table</span>
                <span className="sm:hidden">Frequency</span>
              </TabsTrigger>
            </TabsList>

            {/* Encoded Output Tab */}
            <TabsContent value="encoded" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Binary Encoded Output</CardTitle>
                  <CardDescription>
                    The input text encoded using variable-length Huffman codes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg bg-muted p-3 sm:p-4 font-mono text-xs sm:text-sm break-all max-h-32 sm:max-h-40 overflow-y-auto">
                    {result.encoded}
                  </div>
                  <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row sm:items-center gap-2">
                    <Badge
                      variant={isDecodingCorrect ? "default" : "destructive"}
                    >
                      {isDecodingCorrect ? "✓ Lossless" : "✗ Error"}
                    </Badge>
                    <span className="text-xs sm:text-sm text-muted-foreground">
                      Decoding verification:{" "}
                      {isDecodingCorrect ? "Passed" : "Failed"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Huffman Tree Tab */}
            <TabsContent value="tree" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TreePine className="h-5 w-5" />
                    Huffman Tree Visualization
                  </CardTitle>
                  <CardDescription>
                    Interactive binary tree showing how Huffman codes are
                    generated. Follow the path from root to any character to see
                    its binary code.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <HuffmanTreeVisualization tree={result.tree} />
                  <div className="mt-4 sm:mt-6 grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-foreground">
                        How to Read the Tree:
                      </h4>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>• Start at the top (root) node</li>
                        <li>• Follow edges down to find characters</li>
                        <li>• Left edge = add "0" to code</li>
                        <li>• Right edge = add "1" to code</li>
                        <li>• Character nodes show frequency</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-foreground">
                        Tree Statistics:
                      </h4>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>
                          • <strong>Depth:</strong> {getTreeDepth(result.tree)}{" "}
                          levels
                        </li>
                        <li>
                          • <strong>Characters:</strong> {result.codes.length}{" "}
                          unique
                        </li>
                        <li>
                          • <strong>Algorithm:</strong> Greedy bottom-up
                          construction
                        </li>
                        <li>
                          • <strong>Property:</strong> Optimal prefix-free codes
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Huffman Codes Tab */}
            <TabsContent value="codes" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Generated Huffman Codes</CardTitle>
                  <CardDescription>
                    Variable-length binary codes assigned to each character
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="w-full overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="min-w-[80px]">
                            Character
                          </TableHead>
                          <TableHead className="min-w-[100px]">
                            Huffman Code
                          </TableHead>
                          <TableHead className="text-right min-w-[80px]">
                            Frequency
                          </TableHead>
                          <TableHead className="text-right min-w-[90px]">
                            Code Length
                          </TableHead>
                          <TableHead className="text-right min-w-[80px]">
                            Total Bits
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {result.codes.map((item) => (
                          <TableRow key={item.char}>
                            <TableCell className="font-mono font-semibold">
                              {item.char === " " ? "␣" : item.char}
                            </TableCell>
                            <TableCell className="font-mono text-primary">
                              {item.code}
                            </TableCell>
                            <TableCell className="text-right">
                              {item.frequency}
                            </TableCell>
                            <TableCell className="text-right">
                              {item.bits}
                            </TableCell>
                            <TableCell className="text-right">
                              {item.frequency * item.bits}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Frequency Table Tab */}
            <TabsContent value="frequencies" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Character Frequency Analysis
                  </CardTitle>
                  <CardDescription>
                    Distribution of characters in the input text
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="w-full overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="min-w-[80px]">
                            Character
                          </TableHead>
                          <TableHead className="text-right min-w-[70px]">
                            Count
                          </TableHead>
                          <TableHead className="text-right min-w-[90px]">
                            Percentage
                          </TableHead>
                          <TableHead className="min-w-[150px]">
                            Distribution
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {result.frequencies.map((item) => (
                          <TableRow key={item.char}>
                            <TableCell className="font-mono font-semibold">
                              {item.char === " " ? "␣" : item.char}
                            </TableCell>
                            <TableCell className="text-right">
                              {item.frequency}
                            </TableCell>
                            <TableCell className="text-right">
                              {item.percentage.toFixed(1)}%
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="h-2 flex-1 bg-muted rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-primary"
                                    style={{ width: `${item.percentage}%` }}
                                  />
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
