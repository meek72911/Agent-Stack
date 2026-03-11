"use client";

import { motion } from "framer-motion";
import {
  Bot,
  GitBranch,
  Shield,
  Zap,
  BarChart3,
  Puzzle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: Bot,
    title: "82+ Agent Templates",
    description:
      "Ready-to-run workflows for client reports, competitor intelligence, sales pipelines, content repurposing and more.",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    icon: Zap,
    title: "Real-Time Execution Traces",
    description:
      "Watch your agents work step-by-step with live SSE streaming so you always know what's happening.",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    icon: Shield,
    title: "BYOK — Bring Your Own API Key",
    description:
      "Use your own Anthropic or OpenAI API key. AES-256 encrypted. You stay in control.",
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
  },
  {
    icon: GitBranch,
    title: "File Upload Pipeline",
    description:
      "Upload PDFs and DOCX files as context. Agents extract and process them automatically.",
    color: "text-violet-500",
    bg: "bg-violet-500/10",
  },
  {
    icon: Puzzle,
    title: "Multi-Tenant Workspaces",
    description:
      "Manage multiple clients or teams from one dashboard with separate workspaces and usage tracking.",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    icon: BarChart3,
    title: "Usage Dashboard",
    description:
      "Track runs, tokens, costs and performance across all your workflows in real time.",
    color: "text-rose-500",
    bg: "bg-rose-500/10",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export function Features() {
  return (
    <section id="features" className="bg-muted/30 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything You Need to Ship AI Agents
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            From prototype to production in minutes, not months.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                variants={cardVariants}
                className="group relative rounded-2xl border border-border bg-card p-8 transition-shadow hover:shadow-lg dark:hover:shadow-primary/5"
              >
                <div
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-xl",
                    feature.bg
                  )}
                >
                  <Icon className={cn("h-6 w-6", feature.color)} />
                </div>
                <h3 className="mt-5 text-lg font-semibold">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
