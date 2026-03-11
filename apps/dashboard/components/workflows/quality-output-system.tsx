"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  TrendingUp,
  Gauge,
  Brain,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface QualityMetric {
  id: string;
  name: string;
  score: number;
  status: "good" | "warning" | "poor";
  description: string;
}

export function QualityOutputSystem() {
  const [metrics] = useState<QualityMetric[]>([
    {
      id: "accuracy",
      name: "Accuracy",
      score: 92,
      status: "good",
      description: "Factual correctness of generated content",
    },
    {
      id: "completeness",
      name: "Completeness",
      score: 88,
      status: "good",
      description: "All required information included",
    },
    {
      id: "coherence",
      name: "Coherence",
      score: 95,
      status: "good",
      description: "Logical flow and structure",
    },
    {
      id: "relevance",
      name: "Relevance",
      score: 85,
      status: "warning",
      description: "Content matches user intent",
    },
    {
      id: "formatting",
      name: "Formatting",
      score: 90,
      status: "good",
      description: "Proper formatting and structure",
    },
  ]);

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-500";
    if (score >= 75) return "text-yellow-500";
    return "text-red-500";
  };

  const getOverallScore = () => {
    const total = metrics.reduce((sum, m) => sum + m.score, 0);
    return Math.round(total / metrics.length);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="h-6 w-6 text-[#F97316]" />
            Quality Output System
          </h2>
          <p className="text-sm text-muted-foreground">
            Production-grade deliverables every time
          </p>
        </div>
        <Badge variant="outline" className="text-xs">
          <Brain className="h-3 w-3 mr-1" />
          NeMo Powered
        </Badge>
      </div>

      {/* Overall Score */}
      <Card className="border-[#F97316]/30 bg-[#0D0F17]">
        <CardContent className="py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className={cn(
                "flex h-12 w-12 items-center justify-center rounded-full text-2xl font-bold",
                getOverallScore() >= 90 ? "bg-green-500/20 text-green-500" :
                getOverallScore() >= 75 ? "bg-yellow-500/20 text-yellow-500" :
                "bg-red-500/20 text-red-500"
              )}>
                {getOverallScore()}
              </div>
              <div>
                <p className="text-sm text-[#94A3B8]">Overall Quality Score</p>
                <p className="text-xs text-[#3F4558]">Based on multi-faceted validation</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#94A3B8]">
              <Gauge className="h-4 w-4" />
              Confidence: 92%
            </div>
          </div>
          <Progress value={getOverallScore()} className="h-2 bg-[#1C1F2E]" />
        </CardContent>
      </Card>

      {/* Quality Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Card className={cn(
              "border",
              metric.status === "good" && "border-green-500/30",
              metric.status === "warning" && "border-yellow-500/30",
              metric.status === "poor" && "border-red-500/30"
            )}>
              <CardContent className="py-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {metric.status === "good" && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                    {metric.status === "warning" && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
                    {metric.status === "poor" && <XCircle className="h-4 w-4 text-red-500" />}
                    <span className="text-sm font-medium">{metric.name}</span>
                  </div>
                  <span className={cn("text-sm font-bold", getScoreColor(metric.score))}>
                    {metric.score}%
                  </span>
                </div>
                <p className="text-xs text-[#94A3B8]">{metric.description}</p>
                <Progress
                  value={metric.score}
                  className={cn(
                    "h-1.5 mt-2",
                    metric.status === "good" && "bg-green-500/30",
                    metric.status === "warning" && "bg-yellow-500/30",
                    metric.status === "poor" && "bg-red-500/30"
                  )}
                />
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Pipeline Info */}
      <Card className="border-[#8B5CF6]/30 bg-[#8B5CF6]/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-[#8B5CF6]" />
            Quality Pipeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 text-xs text-[#94A3B8]">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#F97316]" />
              Validation
            </div>
            <span>→</span>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#8B5CF6]" />
              Scoring
            </div>
            <span>→</span>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#10B981]" />
              NeMo Optimization
            </div>
            <span>→</span>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#3B82F6]" />
              Final Output
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info Banner */}
      <div className="rounded-lg border border-green-500/30 bg-green-500/5 p-4">
        <div className="flex items-center gap-3">
          <Shield className="h-5 w-5 text-green-500" />
          <div>
            <p className="text-sm font-medium">Production-Grade Output</p>
            <p className="text-xs text-muted-foreground">
              Every workflow output goes through validation, scoring, and NeMo optimization to ensure quality.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
