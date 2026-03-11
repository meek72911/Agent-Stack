import type { Metadata } from "next";
import { ApiKeyManager } from "@/components/dashboard/api-key-manager";

export const metadata: Metadata = { title: "API Keys - AgentStack" };

/** BYOK key management: add/remove/validate provider API keys (encrypted with Fernet) */
export default function ApiKeysPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">API Keys</h1>
        <p className="text-muted-foreground">
          Bring Your Own Keys -- add API keys for OpenAI, Anthropic, Gemini, and more
        </p>
      </div>
      <ApiKeyManager />
    </div>
  );
}
