import { HeroSection } from "@/components/marketing/hero-section";
import { FeaturesGrid } from "@/components/marketing/features-grid";
import { PricingPreview } from "@/components/marketing/pricing-preview";
import { TestimonialsSection } from "@/components/marketing/testimonials-section";
import { CtaSection } from "@/components/marketing/cta-section";

/** Landing page -- "/" route */
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturesGrid />
      <PricingPreview />
      <TestimonialsSection />
      <CtaSection />
    </>
  );
}
