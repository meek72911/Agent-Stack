"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background pt-16 pb-24 lg:pt-24 lg:pb-32">
      {/* Background gradient orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-violet-500/10 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge
              variant="outline"
              className="gap-1.5 border-primary/30 bg-primary/5 px-3 py-1 text-sm"
            >
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Now in Public Beta
            </Badge>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-6 max-w-4xl text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl"
          >
            Build Autonomous AI Agents{" "}
            <span className="bg-gradient-to-r from-primary via-violet-500 to-purple-600 bg-clip-text text-transparent">
              That Actually Ship
            </span>
          </motion.h1>

          {/* Sub */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed"
          >
            Design, deploy, and manage production-grade AI agents and
            multi-step workflows -- all from a single platform. No
            infrastructure headaches, just results.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <Link href="/signup">
              <Button size="lg" className="gap-2 text-base">
                Start Building Free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="#demo">
              <Button variant="outline" size="lg" className="gap-2 text-base">
                <Play className="h-4 w-4" />
                Watch Demo
              </Button>
            </Link>
          </motion.div>

          {/* Hero visual */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-16 w-full max-w-5xl"
          >
            <div className="relative rounded-xl border border-border bg-card/50 shadow-2xl shadow-primary/5 backdrop-blur">
              <div className="flex items-center gap-2 border-b border-border px-4 py-3">
                <div className="h-3 w-3 rounded-full bg-red-400" />
                <div className="h-3 w-3 rounded-full bg-yellow-400" />
                <div className="h-3 w-3 rounded-full bg-green-400" />
                <span className="ml-3 text-sm text-muted-foreground">
                  AgentStack Dashboard
                </span>
              </div>
              <div className="aspect-[16/9] rounded-b-xl bg-gradient-to-br from-background via-muted/50 to-background p-8">
                <div className="grid h-full grid-cols-3 gap-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="rounded-lg border border-border/50 bg-card/30 p-4"
                    >
                      <div className="h-3 w-2/3 rounded bg-muted" />
                      <div className="mt-4 h-24 rounded-md bg-muted/50" />
                      <div className="mt-3 h-2 w-1/2 rounded bg-muted" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Trust bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-16 flex flex-col items-center gap-4"
          >
            <p className="text-sm text-muted-foreground">
              Trusted by 2,000+ teams building the future of AI
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 opacity-40">
              {["Vercel", "Supabase", "Railway", "Resend", "Neon"].map(
                (name) => (
                  <span
                    key={name}
                    className="text-lg font-semibold tracking-tight"
                  >
                    {name}
                  </span>
                )
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
