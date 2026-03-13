import { MarketingNavbar } from "@/components/marketing/navbar";
import { Hero } from "@/components/marketing/hero";
import { StatsMarquee } from "@/components/marketing/stats-marquee";
import { PopularWorkflows } from "@/components/marketing/popular-workflows";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { Features } from "@/components/marketing/features";
import { Pricing } from "@/components/marketing/pricing";
import { OpenSource } from "@/components/marketing/open-source";
import { FAQ } from "@/components/marketing/faq";
import { Waitlist } from "@/components/marketing/waitlist";

export default function HomePage() {
  return (
    <>
      <MarketingNavbar />
      <Hero />
      <StatsMarquee />
      <PopularWorkflows />
      <HowItWorks />
      <Features />
      <Pricing />
      <OpenSource />
      <FAQ />
      <Waitlist />
    </>
  );
}
