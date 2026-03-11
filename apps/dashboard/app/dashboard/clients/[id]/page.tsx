import type { Metadata } from "next";
import { ClientWorkspaceDetail } from "@/components/dashboard/client-workspace-detail";

export const metadata: Metadata = { title: "Client Detail - AgentStack" };

interface ClientDetailPageProps {
  params: { id: string };
}

/** Individual client workspace: agents, workflows, executions, API keys scoped to this client */
export default function ClientDetailPage({ params }: ClientDetailPageProps) {
  return <ClientWorkspaceDetail workspaceId={params.id} />;
}
