"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  Brain, 
  Route, 
  Package, 
  BookOpen, 
  AlertTriangle, 
  Copy, 
  Download,
  Loader2,
  CheckCircle2,
  Clock,
  TrendingUp,
  Hash,
  Target,
  Quote
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AgentResponse {
  intent: string;
  intent_confidence?: number;
  routing: string;
  routing_confidence?: number;
  confidence: number;
  items: Array<{
    sku: string;
    description: string;
    quantity: number;
    category: string;
    confidence?: number;
    extraction_source?: string;
  }>;
  kb_matches: Array<{
    title: string;
    confidence: number;
    relevance: string;
    section: string;
    row_start?: number;
    row_end?: number;
    match_reason?: string;
  }>;
  knowledge_gaps: Array<{
    description: string;
    confidence?: number;
    gap_reason?: string;
  }> | string[];
  extracted_metadata: Record<string, any>;
}

interface AgentOutputPaneProps {
  response: AgentResponse | null;
  isProcessing: boolean;
}

export default function AgentOutputPane({ response, isProcessing }: AgentOutputPaneProps) {
  if (isProcessing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-600" />
            Agent Analysis
          </CardTitle>
          <CardDescription>Processing your input...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <div className="text-center space-y-2">
              <p className="font-medium">Analyzing content...</p>
              <p className="text-sm text-gray-500">
                Extracting intent, routing, and matching knowledge base
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!response) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-600" />
            Agent Analysis
          </CardTitle>
          <CardDescription>Results will appear here after analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 space-y-4 text-gray-500">
            <Brain className="w-12 h-12 text-gray-300" />
            <div className="text-center">
              <p className="font-medium">Ready to analyze</p>
              <p className="text-sm">Paste content and click analyze to get started</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return "text-green-600 bg-green-50";
    if (confidence >= 0.7) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const getRelevanceColor = (relevance: string) => {
    switch (relevance.toLowerCase()) {
      case "high": return "bg-green-100 text-green-700";
      case "medium": return "bg-yellow-100 text-yellow-700";
      case "low": return "bg-gray-100 text-gray-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  // Handle both old format (string array) and new format (object array) for knowledge_gaps
  const normalizedKnowledgeGaps = response.knowledge_gaps.map(gap => 
    typeof gap === 'string' 
      ? { description: gap, confidence: undefined, gap_reason: undefined }
      : gap
  );

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-blue-600" />
                Agent Analysis
              </CardTitle>
              <CardDescription>Structured results from AI processing</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Intent & Routing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-blue-600" />
                <span className="font-medium">Intent</span>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="font-medium text-blue-900">{response.intent}</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className={cn("px-2 py-1 rounded text-xs font-medium", 
                    getConfidenceColor(response.intent_confidence || response.confidence))}>
                    <Target className="w-3 h-3 inline mr-1" />
                    {Math.round((response.intent_confidence || response.confidence) * 100)}% confidence
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Route className="w-4 h-4 text-purple-600" />
                <span className="font-medium">Suggested Routing</span>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <p className="font-medium text-purple-900">{response.routing}</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className={cn("px-2 py-1 rounded text-xs font-medium",
                    getConfidenceColor(response.routing_confidence || response.confidence))}>
                    <Target className="w-3 h-3 inline mr-1" />
                    {Math.round((response.routing_confidence || response.confidence) * 100)}% confidence
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Extracted Items */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-green-600" />
              <span className="font-medium">Extracted Items</span>
              <Badge variant="secondary">{response.items.length}</Badge>
            </div>
            <div className="grid gap-2">
              {response.items.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-green-900">{item.description}</p>
                    <p className="text-sm text-green-700">SKU: {item.sku}</p>
                    {item.quantity > 1 && (
                      <p className="text-sm text-green-600 mt-1">Qty: {item.quantity}</p>
                    )}
                    {item.extraction_source && (
                      <div className="mt-2 flex items-start gap-1">
                        <Quote className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-green-600 italic">
                          "{item.extraction_source}"
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="text-right space-y-2">
                    <Badge variant="outline" className="text-green-700">
                      {item.category}
                    </Badge>
                    {item.confidence && (
                      <div className={cn("px-2 py-1 rounded text-xs font-medium",
                        getConfidenceColor(item.confidence))}>
                        <Target className="w-3 h-3 inline mr-1" />
                        {Math.round(item.confidence * 100)}%
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Knowledge Base Matches */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span className="font-medium">Knowledge Base Matches</span>
              <Badge variant="secondary">{response.kb_matches.length}</Badge>
            </div>
            <div className="space-y-2">
              {response.kb_matches.map((match, index) => (
                <div key={index} className="p-3 bg-indigo-50 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-indigo-900">{match.title}</p>
                      <p className="text-sm text-indigo-700 mt-1">{match.section}</p>
                      {match.row_start && (
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center gap-1 text-xs text-indigo-600 bg-indigo-100 px-2 py-1 rounded">
                            <Hash className="w-3 h-3" />
                            Row {match.row_start}
                            {match.row_end && match.row_end !== match.row_start && (
                              <span>-{match.row_end}</span>
                            )}
                          </div>
                        </div>
                      )}
                      {match.match_reason && (
                        <div className="mt-2 flex items-start gap-1">
                          <Quote className="w-3 h-3 text-indigo-500 mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-indigo-600 italic">
                            Match reason: {match.match_reason}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={getRelevanceColor(match.relevance)} variant="outline">
                        {match.relevance}
                      </Badge>
                      <div className={cn("px-2 py-1 rounded text-xs font-medium",
                        getConfidenceColor(match.confidence))}>
                        <Target className="w-3 h-3 inline mr-1" />
                        {Math.round(match.confidence * 100)}%
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Knowledge Gaps */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span className="font-medium">Knowledge Gaps</span>
              <Badge variant="secondary">{normalizedKnowledgeGaps.length}</Badge>
            </div>
            <div className="space-y-2">
              {normalizedKnowledgeGaps.map((gap, index) => (
                <div key={index} className="flex items-start justify-between p-3 bg-amber-50 rounded-lg">
                  <div className="flex items-start gap-3 flex-1">
                    <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-amber-900">{gap.description}</p>
                      {gap.gap_reason && (
                        <div className="mt-2 flex items-start gap-1">
                          <Quote className="w-3 h-3 text-amber-500 mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-amber-600 italic">
                            Reason: {gap.gap_reason}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  {gap.confidence && (
                    <div className={cn("px-2 py-1 rounded text-xs font-medium ml-3",
                      getConfidenceColor(gap.confidence))}>
                      <Target className="w-3 h-3 inline mr-1" />
                      {Math.round(gap.confidence * 100)}%
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}