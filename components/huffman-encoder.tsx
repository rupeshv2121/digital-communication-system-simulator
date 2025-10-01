"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { huffmanEncode, huffmanDecode } from "@/lib/huffman"
import { Binary, BarChart3 } from "lucide-react"

export function HuffmanEncoder() {
  const [inputText, setInputText] = useState("hello world")

  // Compute Huffman encoding result - no need for useEffect
  const result = useMemo(() => {
    if (!inputText) {
      return null
    }
    return huffmanEncode(inputText)
  }, [inputText])

  // Verify decoding works correctly
  const decodedText = useMemo(() => {
    if (!result) return ""
    return huffmanDecode(result.encoded, result.tree)
  }, [result])

  const isDecodingCorrect = decodedText === inputText

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Binary className="h-5 w-5" />
            Input Text
          </CardTitle>
          <CardDescription>Enter any text to encode using Huffman coding algorithm</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type or paste your text here..."
            className="min-h-[120px] font-mono"
          />
          <div className="mt-2 text-sm text-muted-foreground">
            Characters: {inputText.length} | Unique: {result?.frequencies.length || 0}
          </div>
        </CardContent>
      </Card>

      {result && (
        <>
          {/* Compression Statistics */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Original Size</CardDescription>
                <CardTitle className="text-2xl">{result.originalBits} bits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">{inputText.length} chars × 8 bits</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Encoded Size</CardDescription>
                <CardTitle className="text-2xl">{result.encodedBits} bits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">Variable-length codes</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Compression Ratio</CardDescription>
                <CardTitle className="text-2xl">{result.compressionRatio.toFixed(2)}:1</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  {result.compressionRatio > 1 ? "Compressed" : "Expanded"}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Space Savings</CardDescription>
                <CardTitle className="text-2xl">{result.spaceSavings.toFixed(1)}%</CardTitle>
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
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="encoded">Encoded Output</TabsTrigger>
              <TabsTrigger value="codes">Huffman Codes</TabsTrigger>
              <TabsTrigger value="frequencies">Frequency Table</TabsTrigger>
            </TabsList>

            {/* Encoded Output Tab */}
            <TabsContent value="encoded" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Binary Encoded Output</CardTitle>
                  <CardDescription>The input text encoded using variable-length Huffman codes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg bg-muted p-4 font-mono text-sm break-all">{result.encoded}</div>
                  <div className="mt-4 flex items-center gap-2">
                    <Badge variant={isDecodingCorrect ? "default" : "destructive"}>
                      {isDecodingCorrect ? "✓ Lossless" : "✗ Error"}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      Decoding verification: {isDecodingCorrect ? "Passed" : "Failed"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Huffman Codes Tab */}
            <TabsContent value="codes" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Generated Huffman Codes</CardTitle>
                  <CardDescription>Variable-length binary codes assigned to each character</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Character</TableHead>
                        <TableHead>Huffman Code</TableHead>
                        <TableHead className="text-right">Frequency</TableHead>
                        <TableHead className="text-right">Code Length</TableHead>
                        <TableHead className="text-right">Total Bits</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {result.codes.map((item) => (
                        <TableRow key={item.char}>
                          <TableCell className="font-mono font-semibold">
                            {item.char === " " ? "␣" : item.char}
                          </TableCell>
                          <TableCell className="font-mono text-primary">{item.code}</TableCell>
                          <TableCell className="text-right">{item.frequency}</TableCell>
                          <TableCell className="text-right">{item.bits}</TableCell>
                          <TableCell className="text-right">{item.frequency * item.bits}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
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
                  <CardDescription>Distribution of characters in the input text</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Character</TableHead>
                        <TableHead className="text-right">Count</TableHead>
                        <TableHead className="text-right">Percentage</TableHead>
                        <TableHead>Distribution</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {result.frequencies.map((item) => (
                        <TableRow key={item.char}>
                          <TableCell className="font-mono font-semibold">
                            {item.char === " " ? "␣" : item.char}
                          </TableCell>
                          <TableCell className="text-right">{item.frequency}</TableCell>
                          <TableCell className="text-right">{item.percentage.toFixed(1)}%</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="h-2 flex-1 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-primary" style={{ width: `${item.percentage}%` }} />
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}
