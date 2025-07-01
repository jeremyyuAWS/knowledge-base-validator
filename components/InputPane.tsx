"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, FileText, Mail, MessageCircle, Sparkles } from "lucide-react";
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
    
    if (text.toLowerCase().includes("rfp") || text.toLowerCase().includes("proposal")) {
      return "RFP";
    } else if (text.includes("@") && (text.toLowerCase().includes("invoice") || text.toLowerCase().includes("billing"))) {
      return "Support Email";
    } else if (text.toLowerCase().includes("api") || text.toLowerCase().includes("integration")) {
      return "Technical Support";
    } else if (text.toLowerCase().includes("quote") || text.toLowerCase().includes("pricing")) {
      return "Sales Inquiry";
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
      case "RFP": return <FileText className="w-4 h-4" />;
      case "Support Email": return <Mail className="w-4 h-4" />;
      case "Technical Support": return <MessageCircle className="w-4 h-4" />;
      default: return <MessageCircle className="w-4 h-4" />;
    }
  };

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
              Paste your RFP, email, or support request below
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
            <p className="text-sm font-medium text-gray-700">Try these examples:</p>
            <div className="grid grid-cols-1 gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => loadExample("rfp-enterprise")}
                className="text-left justify-start h-auto p-3"
                disabled={isProcessing}
              >
                <div>
                  <div className="flex items-center gap-2 font-medium">
                    <FileText className="w-4 h-4" />
                    Enterprise RFP
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Software licensing request for 500 employees
                  </div>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => loadExample("support-billing")}
                className="text-left justify-start h-auto p-3"
                disabled={isProcessing}
              >
                <div>
                  <div className="flex items-center gap-2 font-medium">
                    <Mail className="w-4 h-4" />
                    Billing Support
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Customer invoice discrepancy inquiry
                  </div>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => loadExample("technical-support")}
                className="text-left justify-start h-auto p-3"
                disabled={isProcessing}
              >
                <div>
                  <div className="flex items-center gap-2 font-medium">
                    <MessageCircle className="w-4 h-4" />
                    API Integration Issue
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Technical support for API failures
                  </div>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}