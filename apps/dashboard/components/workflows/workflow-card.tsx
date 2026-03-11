"use client";

import { motion } from "framer-motion";
import { Workflow, Clock, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import type { Workflow as WorkflowType } from "@/types/workflow";

interface WorkflowCardProps {
  workflow: WorkflowType;
  onClick?: () => void;
}

const statusConfig = {
  active: { icon: CheckCircle2, color: "text-green-400", bg: "bg-green-400/10" },
  draft: { icon: Clock, color: "text-yellow-400", bg: "bg-yellow-400/10" },
  error: { icon: XCircle, color: "text-red-400", bg: "bg-red-400/10" },
  running: { icon: Loader2, color: "text-blue-400", bg: "bg-blue-400/10" },
} as const;

export function WorkflowCard({ workflow, onClick }: WorkflowCardProps) {
  const status = statusConfig[workflow.status as keyof typeof statusConfig] ?? statusConfig.draft;
  const StatusIcon = status.icon;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      onClick={onClick}
      className="p-4 rounded-lg border border-slate-800 bg-slate-900/50 hover:border-slate-700 cursor-pointer transition-colors"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Workflow className="w-4 h-4 text-primary" />
          <h3 className="font-medium text-slate-200 text-sm">{workflow.name}</h3>
        </div>
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${status.color} ${status.bg}`}>
          <StatusIcon className="w-3 h-3" />
          {workflow.status}
        </span>
      </div>
      {workflow.description && (
        <p className="text-xs text-slate-400 mb-3 line-clamp-2">{workflow.description}</p>
      )}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>{workflow.nodeCount ?? 0} nodes</span>
        <span>{workflow.lastRunAt ? new Date(workflow.lastRunAt).toLocaleDateString() : "Never run"}</span>
      </div>
    </motion.div>
  );
}
