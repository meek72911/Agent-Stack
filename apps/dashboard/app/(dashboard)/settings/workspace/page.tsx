import type { Metadata } from "next";
import { WorkspaceMemory } from "@/components/dashboard/workspace-memory";

export const metadata: Metadata = { title: "Workspace Memory - AgentStack" };

/** Workspace-level persistent memory: company name, tone, audience, brand guidelines */
export default function WorkspaceSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Workspace Memory</h1>
        <p className="text-muted-foreground">
          Define global context that agents will use across all workflows in this workspace
        </p>
      </div>
      <WorkspaceMemory />
    </div>
  );
}
