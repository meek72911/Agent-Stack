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
  {
    name: "Free",
    description: "Perfect for getting started with AI workflows.",
    priceMonthly: 0,
    priceYearly: 0,
    cta: "Get Started Free",
    highlighted: false,
    features: [
      { name: "2 workflows", included: true },
      { name: "1,000 runs/month", included: true },
      { name: "8 workflow templates", included: true },
      { name: "Basic execution trace", included: true },
      { name: "Community support", included: true },
      { name: "BYOK API key support", included: false },
      { name: "Real-time execution trace", included: false },
      { name: "Priority support", included: false },
    ],
  },
  {
    name: "Pro",
    description: "For growing agencies and teams.",
    priceMonthly: 49,
    priceYearly: 490,
    cta: "Start Pro",
    highlighted: true,
    features: [
      { name: "Unlimited workflows", included: true },
      { name: "10,000 runs/month", included: true },
      { name: "82 agent templates", included: true },
      { name: "Real-time execution trace", included: true },
      { name: "BYOK API key support", included: true },
      { name: "Priority support", included: true },
      { name: "White-label option", included: false },
      { name: "Dedicated support", included: false },
    ],
  },
  {
    name: "Team",
    description: "For agencies with multiple clients.",
    priceMonthly: 149,
    priceYearly: 1490,
    cta: "Start Team",
    highlighted: false,
    features: [
      { name: "Everything in Pro", included: true },
      { name: "White-label option", included: true },
      { name: "Agency client management", included: true },
      { name: "Custom branding", included: true },
      { name: "Dedicated support", included: true },
      { name: "Unlimited workflows", included: true },
      { name: "Unlimited runs/month", included: true },
      { name: "Priority support", included: true },
    ],
  },
];

export function Pricing() {
  const [annual, setAnnual] = useState(true);

  return (
    <section id="pricing" className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Start free. Scale as you grow. No hidden fees.
          </p>

          <div className="mt-8 flex items-center justify-center gap-3">
            <span
              className={cn(
                "text-sm font-medium",
                !annual && "text-foreground",
                annual && "text-muted-foreground"
              )}
            >
              Monthly
            </span>
            <Switch checked={annual} onCheckedChange={setAnnual} />
            <span
              className={cn(
                "text-sm font-medium",
                annual && "text-foreground",
                !annual && "text-muted-foreground"
              )}
            >
              Annual
            </span>
            {annual && (
              <Badge variant="secondary" className="ml-2 text-xs">
                Save 2 months free
              </Badge>
            )}
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={cn(
                "relative flex flex-col rounded-2xl border p-8",
                plan.highlighted
                  ? "border-primary bg-card shadow-xl shadow-primary/10"
                  : "border-border bg-card"
              )}
            >
              {plan.highlighted && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                  MOST POPULAR
                </Badge>
              )}

              <h3 className="text-xl font-bold">{plan.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {plan.description}
              </p>

              <div className="mt-6">
                {plan.priceMonthly !== null ? (
                  <>
                    <span className="text-4xl font-extrabold">
                      ${annual ? plan.priceYearly : plan.priceMonthly}
                    </span>
                    <span className="text-muted-foreground">/mo</span>
                  </>
                ) : (
                  <span className="text-4xl font-extrabold">Custom</span>
                )}
              </div>

              <Button
                className="mt-8"
                variant={plan.highlighted ? "default" : "outline"}
                size="lg"
                asChild
              >
                <Link href="/register">{plan.cta}</Link>
              </Button>

              <ul className="mt-8 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature.name}
                    className="flex items-center gap-3 text-sm"
                  >
                    {feature.included ? (
                      <Check className="h-4 w-4 shrink-0 text-primary" />
                    ) : (
                      <X className="h-4 w-4 shrink-0 text-muted-foreground/40" />
                    )}
                    <span
                      className={cn(
                        !feature.included && "text-muted-foreground/60"
                      )}
                    >
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
