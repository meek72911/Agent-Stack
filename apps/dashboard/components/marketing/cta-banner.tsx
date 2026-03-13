"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTABanner() {
  return (
    <section className="relative overflow-hidden py-24">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-violet-500/5 to-background" />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[150px]" />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <Sparkles className="h-7 w-7 text-primary" />
          </div>

          <h2 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-[#F1F5F9]">
            Build your team. <span className="text-gradient-premium">Start for Free.</span>
          </h2>
          <p className="mt-4 text-lg text-[#94A3B8]">
            Built by a solo founder in Pune who was tired of paying $5k/mo for SaaS. 
            Now it's yours. One click. Zero code. Direct signup.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="gap-2 text-base bg-[#F97316] text-[#07080C] font-black shadow-glow-sm hover:bg-[#FB923C] px-8 h-14 uppercase tracking-tighter">
                Start Free — No Credit Card
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>

          <div className="mt-12 flex flex-col items-center gap-2">
            <p className="text-sm text-[#3F4558] italic border-t border-white/5 pt-6 max-w-md">
              "AgentStack replaced $50K/yr of tools for my own startup. 
              I made it open source so you can do the same."
            </p>
            <div className="flex items-center gap-2 mt-2">
              <div className="h-6 w-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                <span className="text-[10px] font-bold text-[#F97316]">SK</span>
              </div>
              <span className="text-[10px] uppercase tracking-widest text-[#5F6782] font-bold">Sarthak K., Founder</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
