import type { Metadata } from "next";
import { MCPMarketplace } from "@/components/dashboard/mcp-marketplace";

export const metadata: Metadata = {
  title: "Integrations - AgentStack",
  description: "Connect your apps and tools with one-click MCP setup",
};

export default function IntegrationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Integrations</h1>
        <p className="text-muted-foreground">
          Connect your apps and tools with one-click MCP setup
        </p>
      </div>
      <MCPMarketplace />
    </div>
  );
}
