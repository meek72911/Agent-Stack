"use client";
import { motion } from "framer-motion";
import { Check, X, Shield, Search, Zap, Users, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const comparisons = [
  { tool: "Snyk", price: "$98/mo", agentstack: "FREE", icon: Shield, category: "Security" },
  { tool: "Semrush", price: "$129/mo", agentstack: "FREE", icon: Search, category: "SEO/GEO" },
  { tool: "Mabl", price: "$500/mo", agentstack: "FREE", icon: Zap, category: "UI Testing" },
  { tool: "Gainsight", price: "$4,000/mo", agentstack: "FREE", icon: Users, category: "Churn Intel" },
  { tool: "Appcues", price: "$1,000/mo", agentstack: "FREE", icon: UserPlus, category: "Onboarding" },
];

import { UserPlus } from "lucide-react";

export function WhatWeReplace() {
  return (
    <section id="what-we-replace" className="py-24 bg-[#07080C] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-green-500/5 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 border-green-500/30 text-green-400 bg-green-500/5 px-4 py-1">
            Cost Comparison
          </Badge>
          <h2 className="font-display text-4xl font-bold sm:text-5xl text-[#F1F5F9]">
            Stop overpaying for SaaS.
          </h2>
          <p className="mt-4 text-lg text-[#94A3B8]">
            AgentStack replaces $50,000/year of tools with one simple, open-source stack.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-1 max-w-4xl mx-auto">
          <div className="rounded-2xl border border-[#1C1F2E] bg-[#0D0F17] overflow-hidden">
            <div className="grid grid-cols-3 p-6 border-b border-[#1C1F2E] bg-white/5 text-[10px] uppercase tracking-widest font-bold text-[#5F6782]">
              <div>Existing Tool</div>
              <div className="text-center">Monthly Cost</div>
              <div className="text-right">AgentStack Pro</div>
            </div>
            
            <div className="divide-y divide-[#1C1F2E]">
              {comparisons.map((item, i) => (
                <motion.div 
                  key={item.tool}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="grid grid-cols-3 p-6 items-center hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center">
                      <item.icon className="h-4 w-4 text-[#94A3B8]" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[#F1F5F9]">{item.tool}</div>
                      <div className="text-[10px] text-[#5F6782]">{item.category}</div>
                    </div>
                  </div>
                  <div className="text-center text-sm font-mono text-red-400/80">
                    {item.price}
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-green-400">
                      {item.agentstack}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="p-8 bg-green-500/5 border-t border-green-500/10 flex flex-col sm:flex-row justify-between items-center gap-6">
              <div>
                <div className="text-xs uppercase tracking-widest font-bold text-green-400/60 mb-1">Total Annual Savings</div>
                <div className="text-3xl font-black text-white">$68,724/year saved</div>
              </div>
              <div className="text-right">
                <Badge className="bg-green-500 text-[#07080C] font-black border-none px-4 py-2">
                  VS $49/mo PRO
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-[#3F4558] italic">
            "AgentStack replaced $50k/yr of tools for my own startup. Now it's yours. Free."
          </p>
        </div>
      </div>
    </section>
  );
}
