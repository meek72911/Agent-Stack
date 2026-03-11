import type { Metadata } from "next";
import { ApiKeyManager } from "@/components/dashboard/api-key-manager";

export const metadata: Metadata = { title: "API Keys - AgentStack" };

export default function ApiKeysPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">API Keys</h1>
        <p className="text-muted-foreground">
          Bring your own keys to eliminate AI markup costs
        </p>
      </div>
      <ApiKeyManager />
    </div>
  );
}
