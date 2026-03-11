import type { Metadata } from "next";
import { ExecutionTraceViewer } from "@/components/workflows/execution-trace-viewer";

export const metadata: Metadata = { title: "Executions - AgentStack" };

/** View and manage workflow executions */
export default function ExecutionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Executions</h1>
        <p className="text-muted-foreground">
          Monitor and manage your workflow executions
        </p>
      </div>
      <ExecutionTraceViewer />
    </div>
  );
}
