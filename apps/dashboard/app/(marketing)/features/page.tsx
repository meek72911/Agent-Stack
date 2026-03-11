import type { Metadata } from "next";
import { FeatureShowcase } from "@/components/marketing/feature-showcase";

export const metadata: Metadata = {
  title: "Features - AgentStack",
  description: "83 production-ready agents, workflow orchestration, BYOK, and more.",
};

/** Features deep-dive page */
export default function FeaturesPage() {
  return (
    <div className="container mx-auto py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight">
          Everything you need to orchestrate AI agents
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          83 production-ready agents. Full pipeline templates. Your keys, your control.
        </p>
      </div>
      <FeatureShowcase />
    </div>
  );
}
