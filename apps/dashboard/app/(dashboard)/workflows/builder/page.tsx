import type { Metadata } from "next";
import { NaturalLanguageBuilder } from "@/components/workflows/natural-language-builder";
import { WorkflowBuilder } from "@/components/workflows/workflow-builder";

export const metadata: Metadata = { title: "Workflow Builder - AgentStack" };

/** Natural language builder + traditional workflow builder */
export default function WorkflowBuilderPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Workflow Builder</h1>
        <p className="text-muted-foreground">
          Build AI workflows with natural language or traditional editor
        </p>
      </div>
      <NaturalLanguageBuilder />
      <WorkflowBuilder />
    </div>
  );
}
