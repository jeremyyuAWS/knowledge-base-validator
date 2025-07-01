"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, FileText, Mail, MessageCircle, Sparkles, Factory, HardHat, Zap, Scale, AlertTriangle } from "lucide-react";
import simulatedData from "@/data/simulated-responses.json";

interface InputPaneProps {
  input: string;
  setInput: (input: string) => void;
  onAnalyze: (input: string) => void;
  isProcessing: boolean;
}

export default function InputPane({ input, setInput, onAnalyze, isProcessing }: InputPaneProps) {
  const [detectedType, setDetectedType] = useState<string | null>(null);

  const detectInputType = (text: string) => {
    if (text.length < 10) return null;
    
    const textLower = text.toLowerCase();
    
    if (textLower.includes("stainless steel") || textLower.includes("fabrication") || textLower.includes("manufacturing")) {
      return "Manufacturing RFP";
    } else if (textLower.includes("construction") || textLower.includes("building") || textLower.includes("concrete")) {
      return "Construction Bid";
    } else if (textLower.includes("solar") || textLower.includes("energy") || textLower.includes("renewable")) {
      return "Energy Project";
    } else if (textLower.includes("compliance") || textLower.includes("legal") || textLower.includes("regulation")) {
      return "Legal Compliance";
    } else if (textLower.includes("emergency") || textLower.includes("urgent") || textLower.includes("immediate")) {
      return "Emergency Service";
    } else if (textLower.includes("rfp") || textLower.includes("proposal") || textLower.includes("enterprise")) {
      return "Enterprise RFP";
    } else if (textLower.includes("invoice") || textLower.includes("billing") || textLower.includes("charged")) {
      return "Support Request";
    } else if (textLower.includes("api") || textLower.includes("integration") || textLower.includes("technical")) {
      return "Technical Support";
    }
    return "General Inquiry";
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    const type = detectInputType(value);
    setDetectedType(type);
  };

  const loadExample = (scenarioId: string) => {
    const scenario = simulatedData.scenarios.find(s => s.id === scenarioId);
    if (scenario) {
      handleInputChange(scenario.input);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Manufacturing RFP": return <Factory className="w-4 h-4" />;
      case "Construction Bid": return <HardHat className="w-4 h-4" />;
      case "Energy Project": return <Zap className="w-4 h-4" />;
      case "Legal Compliance": return <Scale className="w-4 h-4" />;
      case "Emergency Service": return <AlertTriangle className="w-4 h-4" />;
      case "Enterprise RFP": return <FileText className="w-4 h-4" />;
      case "Support Request": return <Mail className="w-4 h-4" />;
      case "Technical Support": return <MessageCircle className="w-4 h-4" />;
      default: return <MessageCircle className="w-4 h-4" />;
    }
  };

  const examples = [
    {
      id: "manufacturing-custom-fabrication",
      title: "Manufacturing RFP",
      subtitle: "Custom stainless steel fabrication (Penn Stainless style)",
      icon: <Factory className="w-4 h-4" />
    },
    {
      id: "construction-project-bid",
      title: "Construction Bid",
      subtitle: "Commercial construction project (Tiny's Construction style)",
      icon: <HardHat className="w-4 h-4" />
    },
    {
      id: "energy-renewable-project",
      title: "Energy Project",
      subtitle: "Renewable energy grid integration (Novitium Energy style)",
      icon: <Zap className="w-4 h-4" />
    },
    {
      id: "legal-compliance-inquiry",
      title: "Legal Compliance",
      subtitle: "EU AI Act regulatory requirements",
      icon: <Scale className="w-4 h-4" />
    },
    {
      id: "emergency-service-request",
      title: "Emergency Service",
      subtitle: "Infrastructure emergency repair request",
      icon: <AlertTriangle className="w-4 h-4" />
    },
    {
      id: "rfp-enterprise",
      title: "Enterprise RFP",
      subtitle: "Software licensing for 500 employees",
      icon: <FileText className="w-4 h-4" />
    }
  ];

  return (
    <Card className="h-fit">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              Input Analysis
            </CardTitle>
            <CardDescription>
              Paste your RFP, project bid, proposal, or support request below
            </CardDescription>
          </div>
          {detectedType && (
            <Badge variant="secondary" className="gap-1">
              {getTypeIcon(detectedType)}
              {detectedType}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea 
          placeholder="Paste your content here..."
          value={input}
          onChange={(e) => handleInputChange(e.target.value)}
          className="min-h-[300px] resize-none"
          disabled={isProcessing}
        />

        <div className="flex flex-col gap-3">
          <Button 
            onClick={() => onAnalyze(input)}
            disabled={!input.trim() || isProcessing}
            className="w-full"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Analyze Content
              </>
            )}
          </Button>

          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Try these industry examples:</p>
            <div className="grid grid-cols-1 gap-2">
              {examples.map((example) => (
                <Button 
                  key={example.id}
                  variant="outline" 
                  size="sm"
                  onClick={() => loadExample(example.id)}
                  className="text-left justify-start h-auto p-3"
                  disabled={isProcessing}
                >
                  <div>
                    <div className="flex items-center gap-2 font-medium">
                      {example.icon}
                      {example.title}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {example.subtitle}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}