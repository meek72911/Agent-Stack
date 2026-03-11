import type { Metadata } from "next";

export const metadata: Metadata = { title: "Agent Detail - AgentStack" };

interface AgentDetailPageProps {
  params: { id: string };
}

/** Individual agent config: system prompt, model, tools, memory, execution history */
export default function AgentDetailPage({ params }: AgentDetailPageProps) {
  return (
    <div className="space-y-6">
      <div className="text-center py-12">
        <p className="text-muted-foreground">Agent details coming soon</p>
      </div>
    </div>
  );
}
