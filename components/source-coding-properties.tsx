"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  Code2,
  FileText,
  Info,
  Search,
  Settings,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";

// Types for source code analysis
interface CodeProperty {
  name: string;
  description: string;
  satisfied: boolean;
  details: string[];
}

interface CodewordSet {
  symbol: string;
  codeword: string;
}

// Source code property validators
class SourceCodeValidator {
  static validatePrefixProperty(codewords: string[]): {
    satisfied: boolean;
    details: string[];
  } {
    const details: string[] = [];
    let satisfied = true;

    for (let i = 0; i < codewords.length; i++) {
      for (let j = i + 1; j < codewords.length; j++) {
        const code1 = codewords[i];
        const code2 = codewords[j];

        if (code1.startsWith(code2)) {
          satisfied = false;
          details.push(`"${code2}" is a prefix of "${code1}"`);
        } else if (code2.startsWith(code1)) {
          satisfied = false;
          details.push(`"${code1}" is a prefix of "${code2}"`);
        }
      }
    }

    if (satisfied) {
      details.push("✓ No codeword is a prefix of another");
      details.push("✓ Enables unambiguous decoding");
    } else {
      details.push("✗ Prefix property violated - ambiguous decoding possible");
    }

    return { satisfied, details };
  }

  static validateUniquenessProperty(codewords: string[]): {
    satisfied: boolean;
    details: string[];
  } {
    const details: string[] = [];
    const seen = new Set<string>();
    const duplicates = new Set<string>();
    let satisfied = true;

    for (const code of codewords) {
      if (seen.has(code)) {
        duplicates.add(code);
        satisfied = false;
      }
      seen.add(code);
    }

    if (satisfied) {
      details.push("✓ All codewords are unique");
      details.push("✓ Each symbol has exactly one codeword");
    } else {
      details.push("✗ Duplicate codewords found:");
      Array.from(duplicates).forEach((dup) => {
        details.push(`  - "${dup}" appears multiple times`);
      });
    }

    return { satisfied, details };
  }

  static validateInstantaneousProperty(codewords: string[]): {
    satisfied: boolean;
    details: string[];
  } {
    // Instantaneous codes are prefix-free codes that can be decoded immediately
    // This is essentially the same as prefix property for practical purposes
    const prefixResult = this.validatePrefixProperty(codewords);
    const details: string[] = [];

    if (prefixResult.satisfied) {
      details.push("✓ Code is instantaneous (prefix-free)");
      details.push("✓ Decoding can proceed symbol by symbol");
      details.push("✓ No buffering required for decoding");
    } else {
      details.push("✗ Code is not instantaneous");
      details.push("✗ May require buffering for correct decoding");
      details.push("✗ Ambiguity in symbol boundaries");
    }

    return { satisfied: prefixResult.satisfied, details };
  }

  static analyzeCodewords(codewordSet: CodewordSet[]): CodeProperty[] {
    const codewords = codewordSet
      .map((cs) => cs.codeword)
      .filter((c) => c.length > 0);

    const prefixResult = this.validatePrefixProperty(codewords);
    const uniquenessResult = this.validateUniquenessProperty(codewords);
    const instantaneousResult = this.validateInstantaneousProperty(codewords);

    return [
      {
        name: "Prefix Property",
        description: "No codeword is a prefix of another codeword",
        satisfied: prefixResult.satisfied,
        details: prefixResult.details,
      },
      {
        name: "Uniqueness Property",
        description: "Each symbol has exactly one unique codeword",
        satisfied: uniquenessResult.satisfied,
        details: uniquenessResult.details,
      },
      {
        name: "Instantaneous Property",
        description: "Code can be decoded immediately without buffering",
        satisfied: instantaneousResult.satisfied,
        details: instantaneousResult.details,
      },
    ];
  }

  static calculateCodeEfficiency(
    codewordSet: CodewordSet[],
    probabilities?: number[]
  ): {
    averageLength: number;
    entropy: number;
    efficiency: number;
    redundancy: number;
  } {
    const n = codewordSet.length;
    const uniformProb = 1 / n;
    const probs = probabilities || Array(n).fill(uniformProb);

    // Calculate average code length
    const avgLength = codewordSet.reduce((sum, cs, i) => {
      return sum + cs.codeword.length * probs[i];
    }, 0);

    // Calculate entropy
    const entropy = -probs.reduce((sum, p) => {
      return sum + (p > 0 ? p * Math.log2(p) : 0);
    }, 0);

    // Calculate efficiency and redundancy
    const efficiency = entropy / avgLength;
    const redundancy = avgLength - entropy;

    return { averageLength: avgLength, entropy, efficiency, redundancy };
  }
}

export function SourceCodingProperties() {
  const [codewordInput, setCodewordInput] = useState(
    "A: 00\nB: 01\nC: 10\nD: 11"
  );

  const [customInput, setCustomInput] = useState("");

  // Parse codeword input
  const codewordSet = useMemo(() => {
    const input = customInput || codewordInput;
    const lines = input.split("\n").filter((line) => line.trim());
    return lines
      .map((line) => {
        const parts = line.split(":").map((p) => p.trim());
        return {
          symbol: parts[0] || "",
          codeword: parts[1] || "",
        };
      })
      .filter((cs) => cs.symbol && cs.codeword);
  }, [codewordInput, customInput]);

  // Analyze properties
  const properties = useMemo(() => {
    return SourceCodeValidator.analyzeCodewords(codewordSet);
  }, [codewordSet]);

  // Calculate efficiency metrics
  const metrics = useMemo(() => {
    return SourceCodeValidator.calculateCodeEfficiency(codewordSet);
  }, [codewordSet]);

  // Predefined example sets
  const exampleSets = {
    valid: "A: 0\nB: 10\nC: 110\nD: 111",
    invalid: "A: 0\nB: 01\nC: 011\nD: 0111",
    huffman: "E: 0\nT: 100\nA: 101\nO: 110\nI: 1110\nN: 1111",
  };

  return (
    <div className="space-y-6">
      {/* Theory Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Source Coding Properties
          </CardTitle>
          <CardDescription>
            Fundamental properties that source codes must satisfy for reliable
            communication
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <Code2 className="h-4 w-4 text-blue-500" />
                1. Prefix Property
              </h4>
              <p className="text-xs text-muted-foreground">
                No codeword is a prefix of another. Ensures{" "}
                <strong>unambiguous decoding</strong>
                without requiring special separators between codewords.
              </p>
              <Badge variant="outline" className="text-xs">
                Example: {"{0, 10, 11}"} ✓ vs {"{0, 01, 011}"} ✗
              </Badge>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <Search className="h-4 w-4 text-green-500" />
                2. Uniqueness Property
              </h4>
              <p className="text-xs text-muted-foreground">
                Each symbol maps to exactly one unique codeword. Ensures{" "}
                <strong>one-to-one mapping</strong>
                between symbols and codes for reliable encoding/decoding.
              </p>
              <Badge variant="outline" className="text-xs">
                Each symbol → unique code
              </Badge>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <Settings className="h-4 w-4 text-purple-500" />
                3. Instantaneous Property
              </h4>
              <p className="text-xs text-muted-foreground">
                Code can be decoded immediately as soon as a complete codeword
                is received. No need to <strong>buffer future symbols</strong>{" "}
                for disambiguation.
              </p>
              <Badge variant="outline" className="text-xs">
                Real-time decoding capability
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Validator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Code Property Validator
          </CardTitle>
          <CardDescription>
            Test any set of codewords to check if they satisfy source coding
            properties
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="input" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="input">Input Codewords</TabsTrigger>
              <TabsTrigger value="analysis">Property Analysis</TabsTrigger>
              <TabsTrigger value="metrics">Code Metrics</TabsTrigger>
            </TabsList>

            <TabsContent value="input" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Enter Codewords (Symbol: Code)
                  </label>
                  <Textarea
                    value={customInput || codewordInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    placeholder="A: 0&#10;B: 10&#10;C: 110&#10;D: 111"
                    className="font-mono text-sm"
                    rows={6}
                  />
                  <div className="text-xs text-muted-foreground">
                    Format: Symbol: Codeword (one per line)
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium">Example Sets</label>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setCustomInput(exampleSets.valid);
                      }}
                      className="w-full justify-start text-xs"
                    >
                      <CheckCircle2 className="h-3 w-3 mr-2 text-green-500" />
                      Valid Prefix Code
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setCustomInput(exampleSets.invalid);
                      }}
                      className="w-full justify-start text-xs"
                    >
                      <XCircle className="h-3 w-3 mr-2 text-red-500" />
                      Invalid (Prefix Violation)
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setCustomInput(exampleSets.huffman);
                      }}
                      className="w-full justify-start text-xs"
                    >
                      <Code2 className="h-3 w-3 mr-2 text-blue-500" />
                      Huffman Code Example
                    </Button>
                  </div>

                  <div className="mt-4 p-3 bg-muted rounded-lg">
                    <h4 className="text-sm font-semibold mb-2">
                      Current Codebook:
                    </h4>
                    <div className="space-y-1">
                      {codewordSet.map((cs, i) => (
                        <div key={i} className="text-xs font-mono">
                          {cs.symbol} → {cs.codeword}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="analysis" className="space-y-4">
              <div className="space-y-4">
                {properties.map((property, index) => (
                  <Card
                    key={index}
                    className={
                      property.satisfied ? "border-green-200" : "border-red-200"
                    }
                  >
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        {property.satisfied ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                        {property.name}
                        <Badge
                          variant={
                            property.satisfied ? "default" : "destructive"
                          }
                        >
                          {property.satisfied ? "SATISFIED" : "VIOLATED"}
                        </Badge>
                      </CardTitle>
                      <CardDescription>{property.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1">
                        {property.details.map((detail, i) => (
                          <li
                            key={i}
                            className="text-sm flex items-start gap-2"
                          >
                            <span className="text-muted-foreground">•</span>
                            <span
                              className={
                                detail.startsWith("✓")
                                  ? "text-green-600"
                                  : detail.startsWith("✗")
                                  ? "text-red-600"
                                  : ""
                              }
                            >
                              {detail}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}

                {/* Overall Assessment */}
                <Alert
                  className={
                    properties.every((p) => p.satisfied)
                      ? "border-green-200 bg-green-50"
                      : "border-amber-200 bg-amber-50"
                  }
                >
                  {properties.every((p) => p.satisfied) ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                  )}
                  <AlertDescription>
                    <strong>Overall Assessment:</strong>{" "}
                    {properties.every((p) => p.satisfied)
                      ? "This is a valid source code that satisfies all fundamental properties. It can be used for reliable communication."
                      : "This code violates one or more fundamental properties and may cause decoding errors or ambiguities."}
                  </AlertDescription>
                </Alert>
              </div>
            </TabsContent>

            <TabsContent value="metrics" className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription className="text-xs">
                      Average Length
                    </CardDescription>
                    <CardTitle className="text-xl">
                      {metrics.averageLength.toFixed(2)} bits
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xs text-muted-foreground">
                      Expected bits per symbol
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription className="text-xs">
                      Entropy
                    </CardDescription>
                    <CardTitle className="text-xl">
                      {metrics.entropy.toFixed(2)} bits
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xs text-muted-foreground">
                      Theoretical minimum
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription className="text-xs">
                      Efficiency
                    </CardDescription>
                    <CardTitle className="text-xl">
                      {(metrics.efficiency * 100).toFixed(1)}%
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xs text-muted-foreground">
                      Entropy / Avg Length
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription className="text-xs">
                      Redundancy
                    </CardDescription>
                    <CardTitle className="text-xl">
                      {metrics.redundancy.toFixed(2)} bits
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xs text-muted-foreground">
                      Excess over entropy
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Code Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h4 className="font-semibold mb-2">Code Statistics:</h4>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>• Alphabet size: {codewordSet.length} symbols</li>
                        <li>
                          • Min code length:{" "}
                          {Math.min(
                            ...codewordSet.map((cs) => cs.codeword.length)
                          )}{" "}
                          bits
                        </li>
                        <li>
                          • Max code length:{" "}
                          {Math.max(
                            ...codewordSet.map((cs) => cs.codeword.length)
                          )}{" "}
                          bits
                        </li>
                        <li>
                          • Variable length:{" "}
                          {Math.min(
                            ...codewordSet.map((cs) => cs.codeword.length)
                          ) !==
                          Math.max(
                            ...codewordSet.map((cs) => cs.codeword.length)
                          )
                            ? "Yes"
                            : "No"}
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Performance:</h4>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>
                          • Compression ratio:{" "}
                          {(8 / metrics.averageLength).toFixed(2)}:1
                        </li>
                        <li>
                          • Space savings:{" "}
                          {(((8 - metrics.averageLength) / 8) * 100).toFixed(1)}
                          %
                        </li>
                        <li>
                          • Near optimal:{" "}
                          {metrics.efficiency > 0.9 ? "Yes" : "No"}
                        </li>
                        <li>
                          • Fixed vs Variable:{" "}
                          {Math.min(
                            ...codewordSet.map((cs) => cs.codeword.length)
                          ) ===
                          Math.max(
                            ...codewordSet.map((cs) => cs.codeword.length)
                          )
                            ? "Fixed"
                            : "Variable"}
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Information Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Understanding Source Code Properties
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-3">
              <h4 className="font-semibold">Why These Properties Matter:</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <strong>Prefix Property:</strong> Enables real-time decoding
                  without buffering. Essential for streaming applications.
                </li>
                <li>
                  <strong>Uniqueness:</strong> Prevents decoding ambiguity. Each
                  symbol must have exactly one representation.
                </li>
                <li>
                  <strong>Instantaneous:</strong> Allows immediate decoding as
                  soon as a codeword boundary is detected.
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold">Common Violations:</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <strong>Prefix Violation:</strong> Code "0" and "01" - decoder
                  can't distinguish boundaries.
                </li>
                <li>
                  <strong>Duplicate Codes:</strong> Two symbols with same
                  codeword - encoding becomes ambiguous.
                </li>
                <li>
                  <strong>Non-instantaneous:</strong> Requires lookahead or
                  buffering for correct decoding.
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
