"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-16 lg:pb-28">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-[#F97316]/5 blur-[120px]" />
        <div className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-[#8B5CF6]/5 blur-[100px]" />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col items-start text-left">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-6">
              <span className="inline-flex items-center gap-2 border border-[rgba(249,115,22,0.35)] bg-[rgba(249,115,22,0.08)] px-4 py-1.5 rounded-full text-sm text-[#F97316]">✦ Powered by Claude · Open Source</span>
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="font-display text-5xl font-extrabold leading-tight sm:text-6xl lg:text-7xl" style={{ letterSpacing: '-2px', color: '#F1F5F9' }}>
              Your Agency, <span className="text-gradient">On Autopilot.</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="mt-5 max-w-lg text-lg text-[#94A3B8]" style={{ lineHeight: '1.7' }}>
              Run AI workflows for client reports, competitor research, content pipelines and sales — without writing a single line of code. 82+ templates. Powered by Claude.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="mt-8 flex flex-wrap items-center gap-4">
              <Link href="/register"><Button size="lg" className="gap-2 text-base bg-[#F97316] text-[#07080C] font-bold" style={{ borderRadius: '10px', padding: '14px 28px', boxShadow: '0 0 40px rgba(249,115,22,0.35)' }}>Start for Free <ArrowRight className="h-5 w-5" /></Button></Link>
              <Link href="#workflows"><Button variant="outline" size="lg" className="gap-2 text-base border-[#1C1F2E] text-[#94A3B8]" style={{ borderRadius: '10px', padding: '14px 28px' }}>View Workflows</Button></Link>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }} className="mt-5 flex items-center gap-1 text-sm text-[#3F4558]">
              <span>✓</span><span>Free plan</span><span className="mx-2">·</span><span>✓</span><span>No credit card</span><span className="mx-2">·</span><span>✓</span><span>AGPL-3.0 open source</span>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.5 }} className="mt-6 flex items-center gap-2">
              <a href="https://github.com/Meek72vibe/agentstack" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-lg border border-[#1C1F2E] bg-[#0D0F17] px-3 py-1.5 text-sm text-[#94A3B8]">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"/></svg>
                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" /><span>128</span><span>stars</span>
              </a>
            </motion.div>
          </div>
          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.4 }} className="relative">
            <div className="absolute right-0 top-1/2 z-0 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-[#F97316]/8 blur-[80px]" />
            <div className="relative animate-float overflow-hidden rounded-2xl border border-[rgba(249,115,22,0.2)]" style={{ boxShadow: '0 0 0 1px rgba(249,115,22,0.1), 0 0 80px rgba(249,115,22,0.12), 0 32px 80px rgba(0,0,0,0.6)' }}>
              <div className="absolute top-0 left-[10%] right-[10%] h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(249,115,22,0.6), transparent)' }} />
              <div className="flex h-10 items-center gap-2 border-b border-[#1C1F2E] bg-[#0D0F17] px-4">
                <div className="h-3 w-3 rounded-full bg-[#FF5F56]" /><div className="h-3 w-3 rounded-full bg-[#FFBD2E]" /><div className="h-3 w-3 rounded-full bg-[#27C93F]" />
                <span className="ml-3 text-xs text-[#3F4558]">AgentStack Dashboard</span>
              </div>
              <div className="aspect-[16/10] w-full bg-gradient-to-br from-[#0D0F17] via-[#13161F] to-[#0D0F17] p-4">
                <div className="grid h-full grid-cols-4 gap-3">
                  <div className="col-span-1 rounded-lg bg-[#0D0F17] border border-[#1C1F2E] p-3">
                    <div className="h-3 w-20 rounded bg-[#1C1F2E] mb-4" />
                    <div className="space-y-2"><div className="h-2 w-full rounded bg-[#1C1F2E]" /><div className="h-2 w-3/4 rounded bg-[#1C1F2E]" /><div className="h-2 w-5/6 rounded bg-[#1C1F2E]" /></div>
                  </div>
                  <div className="col-span-3 space-y-3">
                    <div className="flex items-center justify-between"><div className="h-6 w-32 rounded bg-[#1C1F2E]" /><div className="flex gap-2"><div className="h-8 w-20 rounded bg-[#F97316]/20" /><div className="h-8 w-8 rounded bg-[#1C1F2E]" /></div></div>
                    <div className="grid grid-cols-3 gap-3 h-full">
                      <div className="rounded-lg bg-[#0D0F17] border border-[#1C1F2E] p-2"><div className="h-3 w-16 rounded bg-[#1C1F2E] mb-2" /><div className="space-y-2"><div className="h-16 rounded bg-[#13161F] border border-[#1C1F2E]" /><div className="h-12 rounded bg-[#13161F] border border-[#1C1F2E]" /></div></div>
                      <div className="rounded-lg bg-[#0D0F17] border border-[#1C1F2E] p-2"><div className="h-3 w-20 rounded bg-[#1C1F2E] mb-2" /><div className="space-y-2"><div className="h-14 rounded bg-[#13161F] border border-[#1C1F2E]" /><div className="h-16 rounded bg-[#13161F] border border-[#1C1F2E]" /><div className="h-10 rounded bg-[#13161F] border border-[#1C1F2E]" /></div></div>
                      <div className="rounded-lg bg-[#0D0F17] border border-[#1C1F2E] p-2"><div className="h-3 w-14 rounded bg-[#1C1F2E] mb-2" /><div className="space-y-2"><div className="h-12 rounded bg-[#13161F] border border-[#1C1F2E]" /><div className="h-14 rounded bg-[#13161F] border border-[#1C1F2E]" /></div></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
