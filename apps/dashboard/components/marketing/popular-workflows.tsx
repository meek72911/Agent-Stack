"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  ArrowRight, ShieldCheck, Globe, Lightbulb, 
  Users, Rocket, CheckCircle2, UserMinus, 
  Layers, Share2 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const workflows = [
  { 
    icon: ShieldCheck, 
    title: "Security Audit", 
    description: "Deep vulnerability scan for your codebase.", 
    replaces: "Snyk ($98/mo)", 
    time: "~5 min", 
    color: "text-red-400", 
    bg: "bg-red-400/10" 
  },
  { 
    icon: Globe, 
    title: "GEO + SEO Check", 
    description: "Check if AI agents are recommending you.", 
    replaces: "Semrush ($129/mo)", 
    time: "~3 min", 
    color: "text-blue-400", 
    bg: "bg-blue-400/10" 
  },
  { 
    icon: Lightbulb, 
    title: "Idea Validator", 
    description: "BUILD/SKIP/PIVOT report in 10 minutes.", 
    replaces: "DimeADozen ($100/mo)", 
    time: "~10 min", 
    color: "text-yellow-400", 
    bg: "bg-yellow-400/10" 
  },
  { 
    icon: Users, 
    title: "Customer Finder", 
    description: "Get 50 warm leads automatically.", 
    replaces: "Instantly ($97/mo)", 
    time: "~4 min", 
    color: "text-green-400", 
    bg: "bg-green-400/10" 
  },
  { 
    icon: Rocket, 
    title: "Launch Intelligence", 
    description: "Automate your Product Hunt win.", 
    replaces: "Launch agency ($2k)", 
    time: "~6 min", 
    color: "text-orange-400", 
    bg: "bg-orange-400/10" 
  },
  { 
    icon: CheckCircle2, 
    title: "UI Self-Heal Tests", 
    description: "Automated end-to-end testing.", 
    replaces: "Mabl ($500/mo)", 
    time: "~8 min", 
    color: "text-indigo-400", 
    bg: "bg-indigo-400/10" 
  },
  { 
    icon: UserMinus, 
    title: "Churn Intelligence", 
    description: "Analyze exactly why users are leaving.", 
    replaces: "Gainsight ($4k/mo)", 
    time: "~4 min", 
    color: "text-pink-400", 
    bg: "bg-pink-400/10" 
  },
  { 
    icon: Layers, 
    title: "Onboarding Gap Finder", 
    description: "Fix drop-offs automatically.", 
    replaces: "Appcues ($1k/mo)", 
    time: "~3 min", 
    color: "text-cyan-400", 
    bg: "bg-cyan-400/10" 
  },
  { 
    icon: Share2, 
    title: "Build In Public Agent", 
    description: "Real commits → real viral posts.", 
    replaces: "Taplio ($59/mo)", 
    time: "~2 min", 
    color: "text-purple-400", 
    bg: "bg-purple-400/10" 
  },
];

export function PopularWorkflows() {
  return (
    <section id="workflows" className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center">
          <span className="text-xs font-semibold tracking-[3px] text-[#F97316] uppercase">Workflows</span>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="mt-4 text-center">
          <h2 className="font-display text-3xl font-bold sm:text-4xl lg:text-5xl" style={{ color: '#F1F5F9' }}>9 gems to scale your startup</h2>
          <p className="mt-4 text-lg text-[#94A3B8]">Pick a workflow. Enter your input. Agents do the rest.</p>
        </motion.div>
        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {workflows.map((workflow, i) => {
            const Icon = workflow.icon;
            return (
              <motion.div key={workflow.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="group relative rounded-xl border border-[#1C1F2E] bg-[#0D0F17] p-6 transition-all hover:border-[rgba(249,115,22,0.3)] hover:bg-[#13161F] hover:-translate-y-1">
                <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", workflow.bg)}>
                  <Icon className={cn("h-5 w-5", workflow.color)} />
                </div>
                <div className="mt-4">
                  <h3 className="text-base font-semibold" style={{ color: '#F1F5F9' }}>{workflow.title}</h3>
                  <p className="mt-2 text-sm text-[#94A3B8] leading-relaxed">{workflow.description}</p>
                  
                  <div className="mt-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-green-400/80 bg-green-400/5 px-2 py-0.5 rounded-full border border-green-400/10">
                      Beats {workflow.replaces}
                    </span>
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#3F4558]">Run time: {workflow.time}</span>
                  <Link href="/signup">
                    <Button variant="ghost" size="sm" className="h-auto p-0 text-[#F97316] hover:bg-transparent hover:text-white transition-colors">
                      Run <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
        <div className="mt-12 text-center">
          <Link href="/dashboard/templates"><Button variant="outline" size="lg" className="gap-2 border-[#1C1F2E] text-[#94A3B8]">View All Workflows <ArrowRight className="h-4 w-4" /></Button></Link>
        </div>
      </div>
    </section>
  );
}
