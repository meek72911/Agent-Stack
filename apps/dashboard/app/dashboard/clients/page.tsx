import type { Metadata } from "next";
import { ClientWorkspaceGrid } from "@/components/dashboard/client-workspace-grid";

export const metadata: Metadata = { title: "Client Workspaces - AgentStack" };

/** Agency view: manage isolated client workspaces (core differentiator) */
export default function ClientsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Client Workspaces</h1>
          <p className="text-muted-foreground">
            Isolated environments for each client with their own agents, keys, and data
          </p>
        </div>
      </div>
      <ClientWorkspaceGrid />
    </div>
  );
}
