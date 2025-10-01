import { HuffmanEncoder } from "@/components/huffman-encoder";
import { SourceCodingInfo } from "@/components/source-coding-info";
import { Binary } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8 space-y-2">
          <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
            <Binary className="h-8 w-8" />
            Huffman Coding Visualizer
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            An interactive demonstration of the Huffman coding algorithm for
            lossless data compression. Explore how source coding reduces
            redundancy through variable-length prefix codes.
          </p>
        </div>

        {/* Source Coding Information */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            Source Coding Properties
          </h2>
          <SourceCodingInfo />
        </div>

        {/* Huffman Encoder */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Interactive Encoder</h2>
          <HuffmanEncoder />
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>
            Implements the Huffman coding algorithm for educational purposes.
          </p>
        </footer>
      </div>
    </main>
  );
}
