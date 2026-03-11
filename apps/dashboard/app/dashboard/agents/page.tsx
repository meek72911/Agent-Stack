import type { Metadata } from "next";
import { AgentGrid } from "@/components/agents/agent-grid";

export const metadata: Metadata = { title: "Agents - AgentStack" };

/** Browse all 83 agents. Activate up to plan limit. Search + filter by category. */
export default function AgentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Agents</h1>
          <p className="text-muted-foreground">
            Browse, activate, and configure your AI agents
          </p>
        </div>
      </div>
      {/* AgentGrid renders its own filters + grid */}
      <AgentGrid />
    </div>
  );
}
