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
    title: "Intelligent Agents",
    description:
      "Design agents with custom tools, memory, and reasoning. Powered by GPT-4, Claude, and open-source models.",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    icon: GitBranch,
    title: "Visual Workflows",
    description:
      "Drag-and-drop workflow builder with conditional branching, loops, and parallel execution.",
    color: "text-violet-500",
    bg: "bg-violet-500/10",
  },
  {
    icon: Zap,
    title: "One-Click Deploy",
    description:
      "Deploy agents to production with zero infrastructure. Auto-scaling, monitoring, and rollbacks built in.",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    icon: Puzzle,
    title: "200+ Integrations",
    description:
      "Connect to Slack, GitHub, Notion, databases, APIs, and more. Build custom tools in minutes.",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    icon: BarChart3,
    title: "Real-Time Analytics",
    description:
      "Monitor agent performance, token usage, costs, and success rates with live dashboards.",
    color: "text-rose-500",
    bg: "bg-rose-500/10",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description:
      "SOC 2 Type II, SSO, RBAC, audit logs, and data encryption. Built for regulated industries.",
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
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
