"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Sparkles, Wand2, Loader2, CheckCircle2, Bot, Cog, ArrowRight, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SuggestedAgent {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

interface GeneratedWorkflow {
  agents: SuggestedAgent[];
  estimatedTime: string;
  confidence: number;
}

export function NaturalLanguageBuilder() {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [workflow, setWorkflow] = useState<GeneratedWorkflow | null>(null);

  const examplePrompts = [
    "Research competitor AI tools and create a report",
    "Analyze website SEO and suggest improvements",
    "Generate social media content calendar",
    "Extract data from PDF and format into spreadsheet",
  ];

  const handleSubmit = async () => {
    if (!input.trim()) return;

    setIsLoading(true);
    setWorkflow(null);

    // Simulate AI workflow generation (in production, this calls backend)
    setTimeout(() => {
      const mockWorkflow: GeneratedWorkflow = {
        agents: [
          { id: "1", name: "Researcher", description: "Gathers information from web sources", icon: "Search", color: "text-blue-400" },
          { id: "2", name: "Analyst", description: "Processes and structures data", icon: "Brain", color: "text-purple-400" },
          { id: "3", name: "Writer", description: "Creates final output content", icon: "FileText", color: "text-green-400" },
        ],
        estimatedTime: "2-3 minutes",
        confidence: 92,
      };
      setWorkflow(mockWorkflow);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Wand2 className="h-6 w-6 text-[#F97316]" />
            Natural Language Builder
          </h2>
          <p className="text-sm text-muted-foreground">
            Type what you want in plain English. AgentStack builds the workflow.
          </p>
        </div>
        <Badge variant="outline" className="text-xs">
          <Sparkles className="h-3 w-3 mr-1" />
          AI-Powered
        </Badge>
      </div>

      {/* Input Section */}
      <Card className="border-[#F97316]/30 bg-[#0D0F17]">
        <CardHeader>
          <CardTitle className="text-base">Describe your task</CardTitle>
          <CardDescription>
            Be as detailed as you'd like. Our AI will interpret your intent and build the workflow.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Textarea
              placeholder="e.g., 'Research competitor AI tools and create a comprehensive report with pricing comparison'"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSubmit()}
              className="min-h-[100px] resize-none bg-[#0D0F17] border-[#1C1F2E]"
            />
            <Button
              onClick={handleSubmit}
              disabled={isLoading || !input.trim()}
              className="absolute bottom-3 right-3 gap-2 bg-[#F97316] text-[#07080C]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Building...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Build Workflow
                </>
              )}
            </Button>
          </div>

          {/* Example prompts */}
          <div className="flex flex-wrap gap-2">
            <span className="text-xs text-muted-foreground">Try:</span>
            {examplePrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => setInput(prompt)}
                className="text-xs text-[#94A3B8] hover:text-[#F97316] transition-colors"
              >
                "{prompt}"
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Generated Workflow Preview */}
      {workflow && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-[#F97316]/30">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Generated Workflow Preview</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    <CheckCircle2 className="h-3 w-3 mr-1 text-green-500" />
                    {workflow.confidence}% confidence
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    ⏱ {workflow.estimatedTime}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Agent Steps */}
              <div className="space-y-3">
                {workflow.agents.map((agent, index) => (
                  <div key={agent.id} className="flex items-center gap-3">
                    <div className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full bg-[#F97316]/10",
                      agent.color
                    )}>
                      {index === 0 && <Bot className="h-5 w-5" />}
                      {index === 1 && <Cog className="h-5 w-5" />}
                      {index === 2 && <ArrowRight className="h-5 w-5" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{agent.name}</span>
                        <span className="text-sm text-muted-foreground">—</span>
                        <span className="text-sm text-[#94A3B8]">{agent.description}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-[#94A3B8]">
                      Step {index + 1}
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="mt-6 flex items-center justify-end gap-3">
                <Button variant="outline" size="sm" onClick={() => setWorkflow(null)}>
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Regenerate
                </Button>
                <Button size="sm" className="gap-2 bg-[#F97316] text-[#07080C]">
                  Execute Workflow
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Info Banner */}
      <div className="rounded-lg border border-[#8B5CF6]/30 bg-[#8B5CF6]/5 p-4">
        <div className="flex items-center gap-3">
          <Sparkles className="h-5 w-5 text-[#8B5CF6]" />
          <div>
            <p className="text-sm font-medium">
              How it works
            </p>
            <p className="text-xs text-muted-foreground">
              Our AI interprets your intent → selects the right agents → builds the workflow configuration → you preview and approve.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
