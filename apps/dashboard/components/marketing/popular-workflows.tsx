"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, FileText, Search, TrendingUp, MessageSquare, Calendar, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const workflows = [
  { icon: FileText, title: "Client Report Generator", description: "Full client reports generated automatically", time: "~2 min", color: "text-[#F97316]", bg: "bg-[#F97316]/10" },
  { icon: Search, title: "Competitor Intelligence Monitor", description: "Track competitors, pricing and positioning", time: "~5 min", color: "text-[#8B5CF6]", bg: "bg-[#8B5CF6]/10" },
  { icon: TrendingUp, title: "Content Repurposing Engine", description: "Turn one piece of content into 10 formats", time: "~3 min", color: "text-[#10B981]", bg: "bg-[#10B981]/10" },
  { icon: MessageSquare, title: "AI Sales Assistant Pipeline", description: "Find leads and write outreach automatically", time: "~4 min", color: "text-[#FBBF24]", bg: "bg-[#FBBF24]/10" },
  { icon: Calendar, title: "Meeting to Action System", description: "Convert meeting notes to tasks instantly", time: "~1 min", color: "text-[#06B6D4]", bg: "bg-[#06B6D4]/10" },
  { icon: Lightbulb, title: "Startup Brief Generator", description: "Turn an idea into a full startup brief", time: "~6 min", color: "text-[#F472B6]", bg: "bg-[#F472B6]/10" },
];

export function PopularWorkflows() {
  return (
    <section id="workflows" className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center">
          <span className="text-xs font-semibold tracking-[3px] text-[#F97316] uppercase">Workflows</span>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="mt-4 text-center">
          <h2 className="font-display text-3xl font-bold sm:text-4xl lg:text-5xl" style={{ color: '#F1F5F9' }}>Everything your agency needs, automated</h2>
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
                  <p className="mt-2 text-sm text-[#94A3B8]">{workflow.description}</p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-[#3F4558]">{workflow.time}</span>
                  <Button variant="ghost" size="sm" className="h-auto p-0 text-[#F97316] hover:bg-transparent">Run <ArrowRight className="ml-1 h-3 w-3" /></Button>
                </div>
              </motion.div>
            );
          })}
        </div>
        <div className="mt-12 text-center">
          <Link href="/templates"><Button variant="outline" size="lg" className="gap-2 border-[#1C1F2E] text-[#94A3B8]">View All Workflows <ArrowRight className="h-4 w-4" /></Button></Link>
        </div>
      </div>
    </section>
  );
}
