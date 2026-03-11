import type { Metadata } from "next";
import { WorkflowBuilder } from "@/components/workflows/workflow-builder";

export const metadata: Metadata = { title: "Workflow Builder - AgentStack" };

/** Form-based workflow step builder (visual editor is Phase 2) */
export default function WorkflowBuilderPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Workflow Builder</h1>
        <p className="text-muted-foreground">
          Define workflow steps, assign agents, configure execution order
        </p>
      </div>
      <WorkflowBuilder />
    </div>
  );
}
