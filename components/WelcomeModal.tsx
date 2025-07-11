"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  MessageSquare, 
  BarChart3, 
  Settings, 
  CheckCircle2,
  Sparkles,
  Target,
  Users
} from "lucide-react";

interface WelcomeModalProps {
  open: boolean;
  onClose: () => void;
}

export default function WelcomeModal({ open, onClose }: WelcomeModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Brain className="w-6 h-6 text-blue-600" />
            Welcome to Knowledge Base Validator
          </DialogTitle>
          <DialogDescription>
            Validate AI responses to unstructured input and improve agent accuracy through feedback
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* What it does */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Target className="w-4 h-4 text-green-600" />
              What does this app do?
            </h3>
            <p className="text-sm text-gray-600">
              This tool helps customer-facing and internal teams validate AI responses to unstructured content like RFPs, 
              emails, and support requests. It provides structured outputs and collects feedback to improve agent performance.
            </p>
          </div>

          {/* Key Features */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              Key AI Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                Semantic intent extraction
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                Intelligent routing suggestions
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                Structured data parsing (SKUs, items)
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                Knowledge base matching & gap analysis
              </div>
            </div>
          </div>

          {/* How to use */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-600" />
              How to use the tabs
            </h3>
            <div className="space-y-2">
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <MessageSquare className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-900">Validate</p>
                  <p className="text-sm text-blue-700">
                    Paste your content, analyze with AI, and provide feedback on the structured results
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                <BarChart3 className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-green-900">History</p>
                  <p className="text-sm text-green-700">
                    Review past feedback, track satisfaction rates, and identify improvement patterns
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                <Settings className="w-5 h-5 text-purple-600 mt-0.5" />
                <div>
                  <p className="font-medium text-purple-900">Settings</p>
                  <p className="text-sm text-purple-700">
                    Configure agent endpoints, toggle demo/live mode, and manage knowledge base documents
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Demo Mode */}
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="bg-amber-100 text-amber-700">
                Demo Mode Active
              </Badge>
            </div>
            <p className="text-sm text-amber-700">
              You're currently in demo mode with pre-configured responses. Switch to live mode in Settings 
              to connect your Lyzr agent endpoint for real-time processing.
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={onClose}>
            Get Started
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}