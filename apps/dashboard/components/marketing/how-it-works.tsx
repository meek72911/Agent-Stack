"use client";
import { motion } from "framer-motion";
import { ListChecks, Pencil, Rocket, FileCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  { number: "01", icon: ListChecks, title: "Choose a Workflow", description: "Pick from 82+ pre-built templates", color: "text-[#F97316]", bg: "bg-[#F97316]/10", border: "border-[rgba(249,115,22,0.3)]" },
  { number: "02", icon: Pencil, title: "Enter Your Input", description: "Paste a topic, URL, company, or upload a file", color: "text-[#8B5CF6]", bg: "bg-[#8B5CF6]/10", border: "border-[rgba(139,92,246,0.3)]" },
  { number: "03", icon: Rocket, title: "Agents Run Automatically", description: "Claude-powered agents execute each step live", color: "text-[#FBBF24]", bg: "bg-[#FBBF24]/10", border: "border-[rgba(251,191,36,0.3)]" },
  { number: "04", icon: FileCheck, title: "Get Structured Results", description: "Download reports, copy outputs, share results", color: "text-[#10B981]", bg: "bg-[#10B981]/10", border: "border-[rgba(16,185,129,0.3)]" },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-[rgba(13,15,23,0.3)] py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="text-xs font-semibold tracking-[3px] text-[#F97316] uppercase">How It Works</span>
          <h2 className="mt-4 font-display text-3xl font-bold sm:text-4xl" style={{ color: '#F1F5F9' }}>From input to output in 4 steps</h2>
        </div>
        <div className="relative mt-16 grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="absolute top-[28px] left-[12%] right-[12%] hidden h-px md:block" style={{ background: 'linear-gradient(90deg, rgba(249,115,22,0.3) 0%, rgba(139,92,246,0.3) 50%, rgba(251,191,36,0.3) 100%)' }} />
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div key={step.number} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.15 }} className="relative flex flex-col items-center text-center">
                <div className={cn("relative z-10 flex h-14 w-14 items-center justify-center rounded-full border-2 bg-[#0D0F11]", step.border)}>
                  <Icon className={cn("h-6 w-6", step.color)} />
                </div>
                <span className={cn("mt-4 text-xs font-bold uppercase tracking-widest", step.color)}>Step {step.number}</span>
                <h3 className="mt-2 text-lg font-semibold" style={{ color: '#F1F5F9' }}>{step.title}</h3>
                <p className="mt-2 max-w-xs text-sm text-[#94A3B8]">{step.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
