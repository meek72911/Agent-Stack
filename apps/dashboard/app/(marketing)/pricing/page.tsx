import type { Metadata } from "next";
import { PricingTable } from "@/components/marketing/pricing-table";
import { PricingFaq } from "@/components/marketing/pricing-faq";

export const metadata: Metadata = {
  title: "Pricing - AgentStack",
  description: "Simple, transparent pricing. Free to start, scale as you grow.",
};

/** Full pricing page with plan comparison and FAQ */
export default function PricingPage() {
  return (
    <div className="container mx-auto py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight">
          Simple, transparent pricing
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Free to start. Scale as you grow. BYOK means you only pay for the platform.
        </p>
      </div>
      <PricingTable />
      <PricingFaq />
    </div>
  );
}
