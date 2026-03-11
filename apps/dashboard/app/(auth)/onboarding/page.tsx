import type { Metadata } from "next";
import { OnboardingWizard } from "@/components/shared/onboarding-wizard";

export const metadata: Metadata = { title: "Get Started - AgentStack" };

/**
 * Onboarding flow (P0 -- Improvement #1):
 * Step 1: "What do you want to build?" (intent selection)
 * Step 2: Template pack recommendation based on intent
 * Step 3: API key configuration (BYOK)
 * Step 4: Deploy template pack -> working agent team
 */
export default function OnboardingPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-2xl">
        <OnboardingWizard />
      </div>
    </div>
  );
}
