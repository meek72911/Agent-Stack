"use client";
import { motion } from "framer-motion";
import { Terminal, Lock, FileUp, BarChart3, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  { type: "large", icon: Terminal, title: "Real-Time Execution Trace", description: "Watch agents work live with step-by-step streaming.", color: "text-[#10B981]", bg: "bg-[#10B981]/10", terminal: true },
  { type: "small", icon: Lock, title: "BYOK API Keys", description: "AES-256 encrypted. Your key, your control.", color: "text-[#F97316]", bg: "bg-[#F97316]/10" },
  { type: "small", icon: FileUp, title: "File Pipeline", description: "PDF + DOCX extraction built in", color: "text-[#8B5CF6]", bg: "bg-[#8B5CF6]/10" },
  { type: "small", icon: Bot, title: "82+ Templates", description: "Ready to run. Zero setup.", color: "text-[#FBBF24]", bg: "bg-[#FBBF24]/10", mosaic: true },
  { type: "large", icon: BarChart3, title: "Usage Dashboard", description: "Track runs, tokens, and costs in real time", color: "text-[#06B6D4]", bg: "bg-[#06B6D4]/10", chart: true },
];

export function Features() {
  return (
    <section id="features" className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="text-xs font-semibold tracking-[3px] text-[#F97316] uppercase">Features</span>
          <h2 className="mt-4 font-display text-3xl font-bold sm:text-4xl" style={{ color: '#F1F5F9' }}>Built for production</h2>
        </div>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-fr">
          {features.map((feature, i) => (
            <motion.div 
              key={feature.title} 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className={cn(
                "group relative rounded-2xl border border-[#1C1F2E] bg-[#0D0F17] p-6 transition-all duration-300 hover:border-[rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.1)]",
                feature.type === "large" ? "md:col-span-2" : "md:col-span-1"
              )}
            >
              {/* Hover glow effect */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-[rgba(249,115,22,0.05)] to-transparent pointer-events-none" />
              
              {feature.terminal && <div className="mt-4 rounded-lg bg-[#07080C] p-4 font-mono text-sm border border-[#1C1F2E]"><div className="flex items-center gap-2 mb-3"><span className="text-[#3F4558]">$</span><span className="text-[#94A3B8]">run workflow client-report</span></div><div className="space-y-1.5"><div className="text-[#10B981]"><span className="text-[#F97316]">›</span> Initializing Client Report Generator...</div><div className="text-[#94A3B8] pl-4">[■■■■■░░] Fetching company data</div><div className="text-[#94A3B8] pl-4">[■■■░░] Analyzing competitors</div><div className="text-[#10B981]"><span className="text-[#F97316]">›</span> ✓ Complete — report.pdf ready</div></div></div>}
              {feature.mosaic && <div className="mt-4 flex gap-1 flex-wrap max-w-[140px]">{[...Array(16)].map((_, i) => <div key={i} className="h-4 w-4 rounded-md transition-transform hover:scale-110" style={{ backgroundColor: ['#F97316', '#8B5CF6', '#10B981', '#FBBF24', '#06B6D4', '#F472B6', '#F97316', '#8B5CF6', '#10B981', '#FBBF24', '#06B6D4', '#F472B6', '#F97316', '#8B5CF6', '#10B981', '#FBBF24'][i] }} />)}</div>}
              {feature.chart && <div className="mt-4"><div className="flex items-end gap-1 h-24">{[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 95, 88].map((h, i) => <div key={i} className="flex-1 rounded-md bg-[#06B6D4]/40 hover:bg-[#06B6D4] transition-colors" style={{ height: `${h}%` }} />)}</div></div>}
              {!feature.terminal && !feature.mosaic && !feature.chart && (
                <>
                  <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl", feature.bg, "group-hover:scale-110 transition-transform")}>
                    <feature.icon className={cn("h-6 w-6", feature.color)} />
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold" style={{ color: '#F1F5F9' }}>{feature.title}</h3>
                    <p className="mt-2 text-sm text-[#94A3B8]">{feature.description}</p>
                  </div>
                </>
              )}
              {(feature.terminal || feature.mosaic || feature.chart) && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold" style={{ color: '#F1F5F9' }}>{feature.title}</h3>
                  <p className="mt-2 text-sm text-[#94A3B8]">{feature.description}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
