"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import Link from "next/link";

const plans = [
  { name: "Free", description: "Perfect for getting started with AI workflows.", priceMonthly: 0, priceYearly: 0, cta: "Get Started Free", highlighted: false, features: [{ name: "2 workflows", included: true }, { name: "1,000 runs/month", included: true }, { name: "8 workflow templates", included: true }, { name: "Basic execution trace", included: true }, { name: "Community support", included: true }, { name: "BYOK API key support", included: false }, { name: "Real-time execution trace", included: false }, { name: "Priority support", included: false }] },
  { name: "Pro", description: "For growing agencies and teams.", priceMonthly: 49, priceYearly: 490, cta: "Start Pro", saveAmount: 98, highlighted: true, features: [{ name: "Unlimited workflows", included: true }, { name: "10,000 runs/month", included: true }, { name: "82+ agent templates", included: true }, { name: "Real-time execution trace", included: true }, { name: "BYOK API key support", included: true }, { name: "Priority support", included: true }, { name: "White-label option", included: false }, { name: "Dedicated support", included: false }] },
  { name: "Team", description: "For agencies with multiple clients.", priceMonthly: 149, priceYearly: 1490, cta: "Start Team", saveAmount: 298, highlighted: false, features: [{ name: "Everything in Pro", included: true }, { name: "White-label option", included: true }, { name: "Agency client management", included: true }, { name: "Custom branding", included: true }, { name: "Dedicated support", included: true }, { name: "Unlimited runs/month", included: true }] },
];

// Regional pricing multiplier (based on Paritydeals.com model)
// Will be detected from user's country via geolocation or signup
const regionalMultipliers: Record<string, number> = {
  default: 1,
  India: 0.4,
  Brazil: 0.45,
  "South Korea": 0.7,
  "United Kingdom": 1.1,
  Australia: 1.2,
};

// Get regional price based on detected country
const getRegionalPrice = (basePrice: number, country?: string): number => {
  const multiplier = country ? regionalMultipliers[country] || 1 : 1;
  return Math.round(basePrice * multiplier);
};

export function Pricing() {
  const [annual, setAnnual] = useState(true);
  return (
    <section id="pricing" className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="text-xs font-semibold tracking-[3px] text-[#F97316] uppercase">Pricing</span>
          <h2 className="mt-4 font-display text-3xl font-bold sm:text-4xl" style={{ color: '#F1F5F9' }}>Simple, transparent pricing</h2>
          <p className="mt-4 text-lg text-[#94A3B8]">Start free. Scale as you grow. No hidden fees.</p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <span className={cn("text-sm font-medium", !annual ? "text-[#F1F5F9]" : "text-[#94A3B8]")}>Monthly</span>
            <Switch checked={annual} onCheckedChange={setAnnual} className="data-[state=checked]:bg-[#F97316]" />
            <span className={cn("text-sm font-medium", annual ? "text-[#F1F5F9]" : "text-[#94A3B8]")}>Yearly</span>
            {annual && <Badge className="ml-2 bg-[#F97316] text-[#07080C] text-xs font-semibold">Save 2 months free</Badge>}
          </div>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {plans.map((plan, i) => (
            <motion.div key={plan.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }} className={cn("relative flex flex-col rounded-3xl border p-8 transition-all duration-300", plan.highlighted ? "border-[rgba(249,115,22,0.5)] bg-gradient-to-br from-[rgba(249,115,22,0.08)] to-[#0D0F17] shadow-premium hover:shadow-[0_0_80px_rgba(249,115,22,0.2)]" : "border-[#1C1F2E] bg-[#0D0F17] hover:border-[rgba(249,115,22,0.3)] hover:shadow-[0_0_40px_rgba(249,115,22,0.05)]")}>
              {plan.highlighted && <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-premium text-[#07080C] font-bold px-5 py-1 text-xs shadow-glow-sm" style={{ borderRadius: '999px' }}>MOST POPULAR</Badge>}
              <h3 className="text-xl font-bold tracking-tight" style={{ color: '#F1F5F9' }}>{plan.name}</h3>
              <p className="mt-2 text-sm text-[#94A3B8]">{plan.description}</p>
              <div className="mt-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold" style={{ color: '#F1F5F9' }}>${annual ? plan.priceYearly : plan.priceMonthly}</span>
                  <span className="text-[#94A3B8]">/mo</span>
                </div>
                {annual && plan.saveAmount && <div className="mt-1 text-sm text-[#10B981] font-medium">Save ${plan.saveAmount}/year</div>}
              </div>
              <Button className={cn("mt-8 transition-all duration-200 hover:scale-[1.02]", plan.highlighted ? "bg-gradient-premium text-[#07080C] font-bold shadow-glow-sm hover:shadow-glow" : "border border-[#1C1F2E] text-[#94A3B8] hover:border-[rgba(249,115,22,0.5)] hover:text-[#F1F5F9]")} style={{ borderRadius: '12px', padding: '14px 24px' }} size="lg" asChild><Link href="/register">{plan.cta}</Link></Button>
              <ul className="mt-8 flex-1 space-y-3">
                {plan.features.map((feature) => (<li key={feature.name} className="flex items-center gap-3 text-sm">{feature.included ? <Check className="h-4 w-4 shrink-0 text-[#10B981]" /> : <X className="h-4 w-4 shrink-0 text-[#3F4558]" />}<span className={feature.included ? "text-[#94A3B8]" : "text-[#3F4558]"}>{feature.name}</span></li>))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
