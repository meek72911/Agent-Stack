import { MarketingNavbar } from "@/components/marketing/navbar";
import { Hero } from "@/components/marketing/hero";
import { StatsMarquee } from "@/components/marketing/stats-marquee";
import { PopularWorkflows } from "@/components/marketing/popular-workflows";
import { WhatWeReplace } from "@/components/marketing/what-we-replace";
import { SecurityTrust } from "@/components/marketing/security-trust";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { Features } from "@/components/marketing/features";
import { Pricing } from "@/components/marketing/pricing";
import { OpenSource } from "@/components/marketing/open-source";
import { FAQ } from "@/components/marketing/faq";
import { CTABanner } from "@/components/marketing/cta-banner";
import { Footer } from "@/components/shared/footer";

export default function HomePage() {
  return (
    <>
      <MarketingNavbar />
      <Hero />
      <StatsMarquee />
      <PopularWorkflows />
      <WhatWeReplace />
      <HowItWorks />
      <SecurityTrust />
      <Features />
      <Pricing />
      <OpenSource />
      <FAQ />
      <CTABanner />
      <Footer />
    </>
  );
}
