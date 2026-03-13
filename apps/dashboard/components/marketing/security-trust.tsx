"use client";
import { motion } from "framer-motion";
import { ShieldCheck, Lock, Eye, Zap, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function SecurityTrust() {
  const lastScan = new Date().getHours();
  
  return (
    <section id="security" className="py-24 bg-[#0D0F17]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <Badge variant="outline" className="mb-4 border-[#F97316]/30 text-[#F97316] bg-[#F97316]/5 px-4 py-1">
              Enterprise Grade Security
            </Badge>
            <h2 className="font-display text-4xl font-bold sm:text-5xl text-[#F1F5F9] mb-6">
              More transparent than SOC2.
            </h2>
            <p className="text-lg text-[#94A3B8] mb-8 leading-relaxed">
              We don't just ask for trust — we prove it. AgentStack is built for the most security-conscious founders and enterprises.
            </p>
            
            <div className="space-y-6">
              {[
                { title: "AES-256 Encryption", desc: "All API keys and sensitive data are encrypted at rest." },
                { title: "TLS 1.3 + TLS 1.2", desc: "Highest standard for data in transit." },
                { title: "RLS (Row Level Security)", desc: "Hard isolation between organization data." },
                { title: "OWASP LLM Top 10", desc: "Protection against prompt injection and data leakage." }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="mt-1 h-5 w-5 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                  </div>
                  <div>
                    <h4 className="text-[#F1F5F9] font-bold text-sm">{item.title}</h4>
                    <p className="text-[#94A3B8] text-xs mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#F97316]/20 to-transparent blur-[100px] pointer-events-none" />
            <div className="relative rounded-2xl border border-[#1C1F2E] bg-[#07080C] p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-[#F97316]/10 flex items-center justify-center">
                    <ShieldCheck className="h-6 w-6 text-[#F97316]" />
                  </div>
                  <div>
                    <div className="text-lg font-black text-white">Security Score</div>
                    <div className="text-xs text-[#5F6782]">Last scan: {lastScan} hours ago</div>
                  </div>
                </div>
                <div className="text-4xl font-black text-[#F1F5F9]">94<span className="text-sm text-[#5F6782]">/100</span></div>
              </div>

              <div className="space-y-4">
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: "94%" }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-[#F97316] to-[#FB923C]"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                    <Lock className="h-4 w-4 text-[#F97316] mb-2" />
                    <div className="text-xs font-bold text-white uppercase tracking-wider">TLS 1.3</div>
                    <div className="text-[10px] text-green-400 mt-1 uppercase">Active</div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                    <Eye className="h-4 w-4 text-[#F97316] mb-2" />
                    <div className="text-xs font-bold text-white uppercase tracking-wider">No Tracking</div>
                    <div className="text-[10px] text-green-400 mt-1 uppercase">Verified</div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-white/5">
                  <p className="text-[10px] text-[#5F6782] leading-relaxed">
                    AgentStack does not store your LLM prompt history. All processing happens within your secure tenant environment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
