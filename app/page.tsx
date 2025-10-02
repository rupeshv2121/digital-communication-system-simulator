import { ChannelCoding } from "@/components/channel-coding";
import { HuffmanEncoder } from "@/components/huffman-encoder";
import { PulseCodeModulation } from "@/components/pcm-modulation";
import { SourceCodingInfo } from "@/components/source-coding-info";
import { SourceCodingProperties } from "@/components/source-coding-properties";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Binary, Code2, Radio, Shield } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-6 sm:mb-8 space-y-2">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight flex items-center gap-2 sm:gap-3 flex-wrap">
            <Radio className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 flex-shrink-0" />
            <span>Digital Communication System Simulator</span>
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-4xl leading-relaxed">
            An interactive demonstration of complete digital communication
            systems including source coding, channel coding, modulation, channel
            effects, demodulation, and decoding. Explore how information flows
            from source to destination through the communication chain.
          </p>
        </div>

        {/* Communication System Overview */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">
            Communication System Components
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Explore each component of the digital communication system. Click on
            a tab to dive deep into that specific area.
          </p>

          <Tabs defaultValue="pcm" className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto p-1">
              <TabsTrigger
                value="pcm"
                className="flex flex-col items-center gap-1 p-2 lg:p-3"
              >
                <Activity className="h-3 w-3 lg:h-4 lg:w-4" />
                <div className="text-center">
                  <div className="text-xs font-medium">A/D Convert</div>
                  <div className="text-xs text-muted-foreground hidden lg:block">
                    PCM & DPCM
                  </div>
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="source"
                className="flex flex-col items-center gap-1 p-2 lg:p-3"
              >
                <Binary className="h-3 w-3 lg:h-4 lg:w-4" />
                <div className="text-center">
                  <div className="text-xs font-medium">Source Code</div>
                  <div className="text-xs text-muted-foreground hidden lg:block">
                    Compression
                  </div>
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="properties"
                className="flex flex-col items-center gap-1 p-2 lg:p-3"
              >
                <Code2 className="h-3 w-3 lg:h-4 lg:w-4" />
                <div className="text-center">
                  <div className="text-xs font-medium">Properties</div>
                  <div className="text-xs text-muted-foreground hidden lg:block">
                    Validation
                  </div>
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="channel"
                className="flex flex-col items-center gap-1 p-2 lg:p-3"
              >
                <Shield className="h-3 w-3 lg:h-4 lg:w-4" />
                <div className="text-center">
                  <div className="text-xs font-medium">Channel Code</div>
                  <div className="text-xs text-muted-foreground hidden lg:block">
                    Error Correct
                  </div>
                </div>
              </TabsTrigger>
            </TabsList>

            {/* PCM/DPCM Tab */}
            <TabsContent value="pcm" className="mt-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Activity className="h-6 w-6 text-primary" />
                  <div>
                    <h3 className="text-xl font-semibold">
                      Analog-to-Digital Conversion
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Convert analog signals to digital using PCM and DPCM
                      techniques
                    </p>
                  </div>
                </div>
                <PulseCodeModulation />
              </div>
            </TabsContent>

            {/* Source Coding Tab */}
            <TabsContent value="source" className="mt-6 space-y-6">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <Binary className="h-6 w-6 text-primary" />
                  <div>
                    <h3 className="text-xl font-semibold">
                      Source Coding & Data Compression
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Learn about lossless compression and Huffman coding
                      algorithms
                    </p>
                  </div>
                </div>

                {/* Source Coding Theory */}
                <div>
                  <h4 className="text-lg font-semibold mb-4">
                    Theory & Fundamentals
                  </h4>
                  <SourceCodingInfo />
                </div>

                {/* Interactive Huffman Encoder */}
                <div>
                  <h4 className="text-lg font-semibold mb-4">
                    Interactive Huffman Encoder
                  </h4>
                  <HuffmanEncoder />
                </div>
              </div>
            </TabsContent>

            {/* Source Code Properties Tab */}
            <TabsContent value="properties" className="mt-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Code2 className="h-6 w-6 text-primary" />
                  <div>
                    <h3 className="text-xl font-semibold">
                      Source Code Properties & Validation
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Validate codewords against fundamental properties: Prefix,
                      Uniqueness, and Instantaneous
                    </p>
                  </div>
                </div>
                <SourceCodingProperties />
              </div>
            </TabsContent>

            {/* Channel Coding Tab */}
            <TabsContent value="channel" className="mt-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Shield className="h-6 w-6 text-primary" />
                  <div>
                    <h3 className="text-xl font-semibold">
                      Channel Coding & Error Correction
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Protect data against channel errors using Hamming codes
                    </p>
                  </div>
                </div>
                <ChannelCoding />
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer */}
        <footer className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t text-center text-xs sm:text-sm text-muted-foreground">
          <p>
            Digital Communication System Simulator - Educational tool for
            understanding end-to-end communication systems.
          </p>
        </footer>
      </div>
    </main>
  );
}
