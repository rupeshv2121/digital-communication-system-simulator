import { HuffmanEncoder } from "@/components/huffman-encoder";
import { SourceCodingInfo } from "@/components/source-coding-info";
import { Binary } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-6 sm:mb-8 space-y-2">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight flex items-center gap-2 sm:gap-3 flex-wrap">
            <Binary className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 flex-shrink-0" />
            <span>Huffman Coding Visualizer</span>
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-3xl leading-relaxed">
            An interactive demonstration of the Huffman coding algorithm for
            lossless data compression. Explore how source coding reduces
            redundancy through variable-length prefix codes.
          </p>
        </div>

        {/* Source Coding Information */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">
            Source Coding Properties
          </h2>
          <SourceCodingInfo />
        </div>

        {/* Huffman Encoder */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">
            Interactive Encoder
          </h2>
          <HuffmanEncoder />
        </div>

        {/* Footer */}
        <footer className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t text-center text-xs sm:text-sm text-muted-foreground">
          <p>
            Implements the Huffman coding algorithm for educational purposes.
          </p>
        </footer>
      </div>
    </main>
  );
}
