"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Play,
  Loader2,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  Terminal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TraceStep {
  id: string;
  agent: string;
  action: string;
  status: "pending" | "running" | "completed" | "failed";
  input?: string;
  output?: string;
  error?: string;
  duration?: number;
  timestamp: string;
}

interface ExecutionTrace {
  id: string;
  workflowName: string;
  status: "running" | "completed" | "failed";
  startTime: string;
  endTime?: string;
  totalDuration?: number;
  steps: TraceStep[];
  currentStepIndex: number;
}

// Mock execution data
const mockTrace: ExecutionTrace = {
  id: "exec-123",
  workflowName: "Competitor Research",
  status: "completed",
  startTime: "2026-03-12T10:30:00Z",
  endTime: "2026-03-12T10:32:45Z",
  totalDuration: 165,
  currentStepIndex: 3,
  steps: [
    {
      id: "step-1",
      agent: "Researcher",
      action: "Search for competitor AI tools",
      status: "completed",
      input: "AI workflow automation tools 2026",
      output: "Found 12 major competitors",
      duration: 45,
      timestamp: "2026-03-12T10:30:15Z",
    },
    {
      id: "step-2",
      agent: "Analyst",
      action: "Analyze features and pricing",
      status: "completed",
      input: "12 competitors data",
      output: "Feature comparison matrix created",
      duration: 60,
      timestamp: "2026-03-12T10:31:00Z",
    },
    {
      id: "step-3",
      agent: "Writer",
      action: "Generate comprehensive report",
      status: "completed",
      input: "Analysis data",
      output: "Report generated (2,450 words)",
      duration: 60,
      timestamp: "2026-03-12T10:32:00Z",
    },
  ],
};

export function ExecutionTraceViewer() {
  const [trace, setTrace] = useState<ExecutionTrace>(mockTrace);
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set(["step-1", "step-2", "step-3"]));

  const toggleStep = (stepId: string) => {
    const newExpanded = new Set(expandedSteps);
    if (newExpanded.has(stepId)) {
      newExpanded.delete(stepId);
    } else {
      newExpanded.add(stepId);
    }
    setExpandedSteps(newExpanded);
  };

  const getStatusIcon = (status: TraceStep["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "running":
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStepStatusColor = (status: TraceStep["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-500";
      case "running":
        return "bg-blue-500/20 text-blue-500";
      case "failed":
        return "bg-red-500/20 text-red-500";
      default:
        return "bg-gray-500/20 text-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Terminal className="h-6 w-6 text-[#F97316]" />
            Execution Trace
          </h2>
          <p className="text-sm text-muted-foreground">
            Real-time monitoring of workflow execution
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-xs">
            <Clock className="h-3 w-3 mr-1" />
            {trace.totalDuration || 0}s
          </Badge>
          <Badge
            variant="default"
            className={cn(
              "text-xs capitalize",
              trace.status === "completed" && "bg-green-500",
              trace.status === "running" && "bg-blue-500",
              trace.status === "failed" && "bg-red-500"
            )}
          >
            {trace.status}
          </Badge>
        </div>
      </div>

      {/* Timeline */}
      <Card className="border-[#F97316]/30 bg-[#0D0F17]">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">{trace.workflowName}</CardTitle>
            <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
              <Clock className="h-3 w-3" />
              {new Date(trace.startTime).toLocaleTimeString()}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {trace.steps.map((step, index) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="relative"
                >
                  {/* Timeline line */}
                  {index < trace.steps.length - 1 && (
                    <div className="absolute left-5 top-10 h-full w-0.5 bg-[#1C1F2E]" />
                  )}

                  <div className="flex items-start gap-4">
                    {/* Step icon */}
                    <div className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full z-10",
                      step.status === "completed" && "bg-green-500/20",
                      step.status === "running" && "bg-blue-500/20",
                      step.status === "failed" && "bg-red-500/20"
                    )}>
                      {step.status === "running" ? (
                        <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
                      ) : (
                        getStatusIcon(step.status)
                      )}
                    </div>

                    {/* Step content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{step.agent}</span>
                        <Badge variant="secondary" className="text-xs">
                          Step {index + 1}
                        </Badge>
                        <Badge variant="outline" className="text-xs capitalize">
                          {step.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-[#94A3B8]">{step.action}</p>

                      {/* Expandable details */}
                      <button
                        onClick={() => toggleStep(step.id)}
                        className="mt-2 flex items-center gap-1 text-xs text-[#94A3B8] hover:text-[#F97316]"
                      >
                        {expandedSteps.has(step.id) ? (
                          <ChevronDown className="h-3 w-3" />
                        ) : (
                          <ChevronRight className="h-3 w-3" />
                        )}
                        Details
                      </button>

                      {expandedSteps.has(step.id) && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="mt-2 ml-1 space-y-2 border-l-2 border-[#1C1F2E] pl-3"
                        >
                          {step.input && (
                            <div className="text-xs">
                              <span className="text-[#94A3B8]">Input:</span>{' '}
                              <span className="text-[#10B981]">{step.input}</span>
                            </div>
                          )}
                          {step.output && (
                            <div className="text-xs">
                              <span className="text-[#94A3B8]">Output:</span>{' '}
                              <span className="text-[#F97316]">{step.output}</span>
                            </div>
                          )}
                          {step.error && (
                            <div className="text-xs text-red-400">
                              <AlertCircle className="h-3 w-3 inline mr-1" />
                              {step.error}
                            </div>
                          )}
                          {step.duration && (
                            <div className="text-xs text-[#94A3B8]">
                              Duration: {step.duration}s
                            </div>
                          )}
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Action buttons */}
      <div className="flex items-center justify-end gap-3">
        <Button variant="outline" size="sm">
          <ExternalLink className="h-4 w-4 mr-1" />
          Export Trace
        </Button>
        <Button variant="outline" size="sm">
          <Clock className="h-4 w-4 mr-1" />
          View History
        </Button>
        <Button size="sm" className="gap-2 bg-[#F97316] text-[#07080C]">
          <Play className="h-4 w-4" />
          Rerun Workflow
        </Button>
      </div>

      {/* Info banner */}
      <div className="rounded-lg border border-blue-500/30 bg-blue-500/5 p-4">
        <div className="flex items-center gap-3">
          <Terminal className="h-5 w-5 text-blue-500" />
          <div>
            <p className="text-sm font-medium">Real-time Execution Trace</p>
            <p className="text-xs text-muted-foreground">
              Monitor workflow execution step-by-step with live updates and detailed logs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
