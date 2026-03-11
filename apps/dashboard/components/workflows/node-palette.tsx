"use client";

import { motion } from "framer-motion";
import { Zap, Brain, Wrench, GitBranch, ArrowRightCircle } from "lucide-react";
import { useWorkflowStore } from "@/stores/workflow-store";

const NODE_TYPES = [
  { type: "trigger", label: "Trigger", icon: Zap, color: "text-yellow-400", description: "Start the workflow" },
  { type: "llm", label: "LLM", icon: Brain, color: "text-purple-400", description: "AI model call" },
  { type: "tool", label: "Tool", icon: Wrench, color: "text-blue-400", description: "External tool" },
  { type: "condition", label: "Condition", icon: GitBranch, color: "text-green-400", description: "Branch logic" },
  { type: "output", label: "Output", icon: ArrowRightCircle, color: "text-cyan-400", description: "Return result" },
] as const;

export function NodePalette() {
  const { addNode, nodes } = useWorkflowStore();

  const handleAddNode = (type: string, label: string) => {
    addNode({
      id: `node-${Date.now()}`,
      type: type as any,
      position: { x: 100 + nodes.length * 60, y: 100 + nodes.length * 40 },
      data: { label, config: {} },
    });
  };

  return (
    <div className="w-56 border-r border-slate-800 p-4 space-y-2">
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Nodes</h3>
      {NODE_TYPES.map((node) => (
        <motion.button
          key={node.type}
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => handleAddNode(node.type, node.label)}
          className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-800/50 transition-colors text-left"
        >
          <node.icon className={`w-4 h-4 ${node.color}`} />
          <div>
            <p className="text-sm font-medium text-slate-200">{node.label}</p>
            <p className="text-xs text-slate-500">{node.description}</p>
          </div>
        </motion.button>
      ))}
    </div>
  );
}
