import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info, Zap, CheckCircle2, TrendingDown } from "lucide-react"

export function SourceCodingInfo() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* Lossless Compression */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            Lossless Compression
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Huffman coding is a <strong>lossless</strong> compression algorithm, meaning the original data can be
            perfectly reconstructed from the compressed data.
          </p>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="text-xs">
              No information is lost during encoding. Decoding always recovers the exact original text.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Redundancy Reduction */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingDown className="h-5 w-5 text-blue-600" />
            Redundancy Reduction
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Huffman coding reduces redundancy by assigning <strong>shorter codes</strong> to more frequent characters
            and longer codes to less frequent ones.
          </p>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="text-xs">
              Instead of fixed 8-bit ASCII, variable-length codes optimize based on character frequency.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Optimal Prefix Codes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Zap className="h-5 w-5 text-amber-600" />
            Optimal Prefix Codes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Huffman codes are <strong>prefix-free</strong>, meaning no code is a prefix of another. This enables
            unambiguous decoding without delimiters.
          </p>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="text-xs">
              Huffman coding produces optimal prefix codes, achieving minimum expected code length.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* How It Works */}
      <Card className="md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle>How Huffman Coding Works</CardTitle>
          <CardDescription>The algorithm follows these steps</CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3 text-sm">
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                1
              </span>
              <div>
                <strong>Frequency Analysis:</strong> Count the occurrence of each character in the input text to build a
                frequency table.
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                2
              </span>
              <div>
                <strong>Build Priority Queue:</strong> Create leaf nodes for each character and organize them by
                frequency (lowest first).
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                3
              </span>
              <div>
                <strong>Construct Huffman Tree:</strong> Repeatedly combine the two nodes with lowest frequency until a
                single tree remains.
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                4
              </span>
              <div>
                <strong>Generate Codes:</strong> Traverse the tree to assign binary codes (0 for left, 1 for right) to
                each character.
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                5
              </span>
              <div>
                <strong>Encode Text:</strong> Replace each character in the input with its corresponding Huffman code to
                produce the compressed output.
              </div>
            </li>
          </ol>
        </CardContent>
      </Card>
    </div>
  )
}
