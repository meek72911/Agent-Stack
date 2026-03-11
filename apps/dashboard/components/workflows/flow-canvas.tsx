"use client";

import { motion } from "framer-motion";
import { Workflow } from "lucide-react";
import { useWorkflowStore } from "@/stores/workflow-store";

export function FlowCanvas() {
  const { nodes, edges, selectedNodeId, setSelectedNode } = useWorkflowStore();

  if (nodes.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-950 rounded-lg border border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(100,100,100,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(100,100,100,0.03)_1px,transparent_1px)] bg-[size:24px_24px]" />
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center z-10"
        >
          <Workflow className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 text-sm font-medium">Drag nodes from the palette to start building</p>
          <p className="text-slate-500 text-xs mt-1">Connect nodes to create your agent workflow</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-slate-950 rounded-lg border border-slate-800 relative overflow-auto">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(100,100,100,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(100,100,100,0.03)_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="relative min-h-full p-8">
        {nodes.map((node) => (
          <motion.div
            key={node.id}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => setSelectedNode(node.id)}
            className={`absolute w-48 p-3 rounded-lg border cursor-pointer transition-colors ${
              selectedNodeId === node.id
                ? "border-primary bg-primary/10"
                : "border-slate-700 bg-slate-900 hover:border-slate-600"
            }`}
            style={{ left: node.position?.x ?? 0, top: node.position?.y ?? 0 }}
          >
            <p className="text-sm font-medium text-slate-200">{node.data?.label ?? node.type}</p>
            <p className="text-xs text-slate-500 mt-1">{node.type}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
