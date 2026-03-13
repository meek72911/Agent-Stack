import type { Metadata } from "next";
import { SavedWorkflows } from "@/components/dashboard/saved-workflows";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = { title: "Workflows - AgentStack" };

/** List all workflows with status, type (sequential/parallel/pipeline), and run button */
export default function WorkflowsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Workflows</h1>
          <p className="text-muted-foreground">
            Orchestrate multi-agent pipelines
          </p>
        </div>
        <Button asChild className="gap-2">
            <Link href="/dashboard/workflows/builder">
                <Plus className="h-4 w-4" />
                New Workflow
            </Link>
        </Button>
      </div>
      <SavedWorkflows />
    </div>
  );
}
