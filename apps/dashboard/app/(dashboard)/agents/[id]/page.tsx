import type { Metadata } from "next";
import { AgentDetailPanel } from "@/components/agents/agent-detail-panel";
import { AgentExecutionHistory } from "@/components/agents/agent-execution-history";

export const metadata: Metadata = { title: "Agent Detail - AgentStack" };

interface AgentDetailPageProps {
  params: { id: string };
}

/** Individual agent config: system prompt, model, tools, memory, execution history */
export default function AgentDetailPage({ params }: AgentDetailPageProps) {
  return (
    <div className="space-y-6">
      <AgentDetailPanel agentId={params.id} />
      <AgentExecutionHistory agentId={params.id} />
    </div>
  );
}
