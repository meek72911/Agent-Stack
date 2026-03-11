import type { Metadata } from "next";
import { UsageDashboard } from "@/components/dashboard/usage-dashboard";

export const metadata: Metadata = { title: "Analytics - AgentStack" };

/** Usage dashboard: executions, tokens, cost, time saved (Improvement #4) */
export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">
          Execution metrics, cost tracking, and time saved estimates
        </p>
      </div>
      <UsageDashboard />
    </div>
  );
}
