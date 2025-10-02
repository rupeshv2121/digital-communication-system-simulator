"use client";

import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { hammingDecode, hammingEncode, introduceError } from "@/lib/hamming";
import { AlertTriangle, CheckCircle, Shield } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "../components/ui/button";

export function ChannelCoding() {
  const [inputText, setInputText] = useState("Hello");
  const [simulateError, setSimulateError] = useState(false);
  const [errorPosition, setErrorPosition] = useState<number | undefined>(
    undefined
  );

  // Encode with Hamming codes
  const encoded = useMemo(() => {
    if (!inputText) return null;
    return hammingEncode(inputText);
  }, [inputText]);

  // Simulate channel with optional error
  const transmitted = useMemo(() => {
    if (!encoded) return null;

    let data = encoded.encoded;
    if (simulateError) {
      data = introduceError(data, errorPosition);
    }

    return data;
  }, [encoded, simulateError, errorPosition]);

  // Decode at receiver
  const decoded = useMemo(() => {
    if (!transmitted) return null;
    return hammingDecode(transmitted);
  }, [transmitted]);

  const toggleError = () => {
    setSimulateError(!simulateError);
    if (!simulateError) {
      // Generate random error position
      setErrorPosition(
        Math.floor(Math.random() * (encoded?.encoded.length || 1))
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Input Data for Channel Coding
          </CardTitle>
          <CardDescription>
            Enter text to encode with Hamming codes for error correction
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message here..."
            className="min-h-[100px] sm:min-h-[120px] font-mono text-sm sm:text-base"
          />
          <div className="mt-2 text-xs sm:text-sm text-muted-foreground flex flex-wrap gap-2">
            <span>Characters: {inputText.length}</span>
            <span>•</span>
            <span>Binary bits: {inputText.length * 8}</span>
          </div>
        </CardContent>
      </Card>

      {encoded && (
        <>
          {/* Channel Coding Statistics */}
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2 sm:pb-3">
                <CardDescription className="text-xs sm:text-sm">
                  Original Bits
                </CardDescription>
                <CardTitle className="text-lg sm:text-xl lg:text-2xl">
                  {encoded.originalBits}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">Data bits</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2 sm:pb-3">
                <CardDescription className="text-xs sm:text-sm">
                  Encoded Bits
                </CardDescription>
                <CardTitle className="text-lg sm:text-xl lg:text-2xl">
                  {encoded.encodedBits}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  +{encoded.parityBits} parity bits
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2 sm:pb-3">
                <CardDescription className="text-xs sm:text-sm">
                  Redundancy
                </CardDescription>
                <CardTitle className="text-lg sm:text-xl lg:text-2xl">
                  {encoded.redundancy.toFixed(1)}%
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  Overhead for protection
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2 sm:pb-3">
                <CardDescription className="text-xs sm:text-sm">
                  Error Correction
                </CardDescription>
                <CardTitle className="text-lg sm:text-xl lg:text-2xl">
                  1-bit
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  Single error correction
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Channel Simulation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Channel Simulation
              </CardTitle>
              <CardDescription>
                Simulate transmission through a noisy channel with potential bit
                errors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Button
                    onClick={toggleError}
                    variant={simulateError ? "destructive" : "outline"}
                    size="sm"
                  >
                    {simulateError ? "Remove Error" : "Inject Error"}
                  </Button>
                  {simulateError && (
                    <Badge variant="destructive">
                      Error at position {errorPosition! + 1}
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Transmitted Data</h4>
                    <div className="p-3 bg-muted rounded font-mono text-xs break-all max-h-32 overflow-y-auto">
                      {encoded.encoded}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Received Data</h4>
                    <div className="p-3 bg-muted rounded font-mono text-xs break-all max-h-32 overflow-y-auto">
                      {transmitted}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Decoding Results */}
          {decoded && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Hamming Decoder Results
                </CardTitle>
                <CardDescription>
                  Error detection and correction at the receiver
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge
                      variant={decoded.hasError ? "destructive" : "default"}
                    >
                      {decoded.hasError
                        ? `Error Detected at position ${decoded.errorPosition}`
                        : "No Errors Detected"}
                    </Badge>
                    {decoded.hasError && (
                      <Badge variant="default">
                        Error Corrected Successfully
                      </Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Corrected Binary</h4>
                      <div className="p-3 bg-muted rounded font-mono text-xs break-all max-h-32 overflow-y-auto">
                        {decoded.corrected}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Decoded Data</h4>
                      <div className="p-3 bg-muted rounded font-mono text-xs break-all max-h-32 overflow-y-auto">
                        {decoded.decoded}
                      </div>
                    </div>
                  </div>

                  <div className="text-sm space-y-1">
                    <p>
                      <strong>Transmission Status:</strong>{" "}
                      {decoded.hasError
                        ? "Error corrected successfully"
                        : "Clean transmission"}
                    </p>
                    <p>
                      <strong>Data Integrity:</strong>{" "}
                      {decoded.decoded === encoded.encoded
                        ? "✓ Preserved"
                        : "✗ Corrupted"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Information Panel */}
          <Card>
            <CardHeader>
              <CardTitle>Hamming Code Information</CardTitle>
              <CardDescription>
                Understanding how Hamming codes provide error correction
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <h4 className="font-semibold">How it Works:</h4>
                  <ul className="space-y-1 text-muted-foreground text-xs">
                    <li>• Adds parity bits at power-of-2 positions</li>
                    <li>• Each parity bit checks specific data positions</li>
                    <li>• Syndrome calculation locates error position</li>
                    <li>• Can correct any single-bit error</li>
                    <li>• Can detect (but not correct) double-bit errors</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Hamming(7,4) Code:</h4>
                  <ul className="space-y-1 text-muted-foreground text-xs">
                    <li>• 4 data bits + 3 parity bits = 7 total</li>
                    <li>• Parity positions: 1, 2, 4</li>
                    <li>• Data positions: 3, 5, 6, 7</li>
                    <li>• Code rate: 4/7 ≈ 57.1%</li>
                    <li>• Minimum distance: 3</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
