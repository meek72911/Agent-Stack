import type { Metadata } from "next";
import { BillingOverview } from "@/components/dashboard/billing-overview";

export const metadata: Metadata = { title: "Billing - AgentStack" };

/** Stripe billing: current plan, upgrade, portal link, invoice history */
export default function BillingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Billing</h1>
        <p className="text-muted-foreground">
          Manage your subscription and view invoices
        </p>
      </div>
      <BillingOverview />
    </div>
  );
}
