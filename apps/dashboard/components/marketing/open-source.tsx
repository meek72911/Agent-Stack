"use client";
import { motion } from "framer-motion";
import { Github, Star, Book } from "lucide-react";
import { Button } from "@/components/ui/button";

export function OpenSource() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative overflow-hidden rounded-2xl border border-[rgba(249,115,22,0.15)] bg-[rgba(249,115,22,0.03)] p-12 text-center">
          <div className="relative z-10">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F97316]/10"><Github className="h-8 w-8 text-[#F97316]" /></div>
            <h2 className="font-display text-3xl font-bold sm:text-4xl" style={{ color: '#F1F5F9' }}>AgentStack is Open Source</h2>
            <p className="mx-auto mt-4 max-w-lg text-lg text-[#94A3B8]">Licensed under AGPL-3.0. Self-host it, contribute to it, or use our cloud version.</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a href="https://github.com/Meek72vibe/agentstack" target="_blank" rel="noopener noreferrer"><Button size="lg" className="gap-2 bg-[#F97316] text-[#07080C] font-bold" style={{ borderRadius: '10px' }}><Star className="h-5 w-5 fill-current" /><span>128</span><span>Stars</span></Button></a>
              <a href="https://github.com/Meek72vibe/agentstack" target="_blank" rel="noopener noreferrer"><Button size="lg" variant="outline" className="gap-2 border-[#1C1F2E] text-[#94A3B8]" style={{ borderRadius: '10px' }}><Book className="h-5 w-5" />Read the Docs</Button></a>
            </div>
            <p className="mt-6 text-sm text-[#3F4558]">Licensed under AGPL-3.0 · Built with FastAPI + Next.js</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
