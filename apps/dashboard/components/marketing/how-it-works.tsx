"use client";

import { motion } from "framer-motion";
import { Pencil, Rocket, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  {
    number: "01",
    icon: Pencil,
    title: "Design Your Agent",
    description:
      "Choose a model, define tools, set memory and instructions. Use our template gallery or start from scratch.",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
  {
    number: "02",
    icon: Rocket,
    title: "Deploy in Seconds",
    description:
      "Hit deploy and your agent goes live with auto-scaling, monitoring, and a unique API endpoint.",
    color: "text-violet-500",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
  },
  {
    number: "03",
    icon: BarChart3,
    title: "Monitor & Iterate",
    description:
      "Track performance, review conversations, tune prompts, and let your agents improve over time.",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ship AI Agents in 3 Steps
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Go from idea to production in under 5 minutes.
          </p>
        </div>

        <div className="relative mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Connector line */}
          <div className="absolute top-16 left-[16.67%] right-[16.67%] hidden h-px bg-gradient-to-r from-blue-500/30 via-violet-500/30 to-emerald-500/30 md:block" />

          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="relative flex flex-col items-center text-center"
              >
                <div
                  className={cn(
                    "relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl border-2",
                    step.bg,
                    step.border
                  )}
                >
                  <Icon className={cn("h-7 w-7", step.color)} />
                </div>

                <span
                  className={cn(
                    "mt-4 text-xs font-bold uppercase tracking-widest",
                    step.color
                  )}
                >
                  Step {step.number}
                </span>

                <h3 className="mt-2 text-xl font-semibold">{step.title}</h3>
                <p className="mt-2 max-w-xs text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
