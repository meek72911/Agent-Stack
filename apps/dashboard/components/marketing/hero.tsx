"use client";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { gsap } from "gsap";
import { Board as KanbanBoard } from "@/components/kanban";

export function Hero() {
  const cardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);
  const orb3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !cardRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = containerRef.current!.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 15;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 15;

      // 3D tilt on dashboard card
      gsap.to(cardRef.current, {
        rotationY: x,
        rotationX: -y,
        duration: 0.5,
        ease: "power2.out",
        transformPerspective: 1000,
      });

      // Parallax effect on orbs (inverse movement for depth)
      if (orb1Ref.current) {
        gsap.to(orb1Ref.current, {
          x: -x * 0.5,
          y: -y * 0.5,
          duration: 0.5,
          ease: "power2.out",
        });
      }
      if (orb2Ref.current) {
        gsap.to(orb2Ref.current, {
          x: -x * 0.3,
          y: -y * 0.3,
          duration: 0.5,
          ease: "power2.out",
        });
      }
      if (orb3Ref.current) {
        gsap.to(orb3Ref.current, {
          x: -x * 0.7,
          y: -y * 0.7,
          duration: 0.5,
          ease: "power2.out",
        });
      }
    };

    containerRef.current.addEventListener("mousemove", handleMouseMove);

    // Initial animation
    gsap.from(cardRef.current, {
      rotationX: 15,
      rotationY: -10,
      opacity: 0,
      y: 30,
      duration: 1,
      ease: "power3.out",
    });

    // Ambient float animations for orbs
    [orb1Ref, orb2Ref, orb3Ref].forEach((ref, i) => {
      if (ref.current) {
        gsap.to(ref.current, {
          y: `+=${15 + i * 5}`,
          duration: 4 + i,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }
    });

    return () => {
      containerRef.current?.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);
  return (
    <section className="relative overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-28">
      {/* Premium gradient orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-[#F97316]/10 blur-[150px]" />
        <div className="absolute -bottom-60 -left-60 h-[500px] w-[500px] rounded-full bg-[#8B5CF6]/8 blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-[#F97316]/5 blur-[100px]" />
        
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>
      
      {/* Subtle animated border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#F97316]/50 to-transparent" />
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col items-start text-left">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.5 }} 
              className="mb-6 inline-block"
            >
              <span className="inline-flex items-center gap-2 border border-[rgba(249,115,22,0.35)] bg-[rgba(249,115,22,0.08)] px-4 py-1.5 rounded-full text-sm text-[#F97316] font-medium shadow-[0_0_20px_rgba(249,115,22,0.2)] animate-float-slow">
                <span className="h-2 w-2 rounded-full bg-[#F97316] animate-pulse shadow-[0_0_10px_rgba(249,115,22,0.8)]" />
                Powered by Claude · Open Source
              </span>
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="font-display text-5xl font-extrabold leading-tight sm:text-6xl lg:text-7xl" style={{ letterSpacing: '-2px', color: '#F1F5F9' }}>
              AI Agents for <span className="text-gradient-premium">Everyone.</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="mt-5 max-w-lg text-lg text-[#94A3B8]" style={{ lineHeight: '1.7' }}>
              Students, teachers, creators, founders — anyone can build and run AI workflows with natural language. Zero code. 22+ templates. Powered by Claude.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="mt-8 flex flex-wrap items-center gap-4">
              <Link href="/signup"><Button size="lg" className="gap-2 text-base bg-[#F97316] text-[#07080C] font-extrabold shadow-premium hover:bg-[#FB923C] hover:scale-[1.02] transition-all duration-200" style={{ borderRadius: '12px', padding: '16px 32px' }}>Start for Free <ArrowRight className="h-5 w-5" /></Button></Link>
              <Link href="#workflows"><Button variant="outline" size="lg" className="gap-2 text-base border-[#1C1F2E] text-[#94A3B8] hover:border-[#F97316]/50 hover:text-[#F1F5F9] transition-all duration-200" style={{ borderRadius: '12px', padding: '16px 32px' }}>View Workflows</Button></Link>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }} className="mt-5 flex items-center gap-1 text-sm text-[#3F4558]">
              <span className="text-[#10B981]">✓</span><span>Free plan</span><span className="mx-2">·</span><span className="text-[#10B981]">✓</span><span>No credit card</span><span className="mx-2">·</span><span className="text-[#10B981]">✓</span><span>AGPL-3.0 open source</span>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.5 }} className="mt-6 flex items-center gap-2">
              <a href="https://github.com/Meek72vibe/agentstack" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-lg border border-[#1C1F2E] bg-[#0D0F17] px-3 py-1.5 text-sm text-[#94A3B8]">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"/></svg>
                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" /><span>128</span><span>stars</span>
              </a>
            </motion.div>
          </div>
          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.4 }} className="relative" ref={containerRef}>
            {/* Parallax background orbs */}
            <div ref={orb1Ref} className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-gradient-to-r from-orange-500/30 to-amber-500/20 blur-[120px]" />
            <div ref={orb2Ref} className="absolute -bottom-40 -left-32 h-80 w-80 rounded-full bg-gradient-to-r from-violet-500/20 to-purple-500/30 blur-[100px]" />
            <div ref={orb3Ref} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-48 w-48 rounded-full bg-gradient-to-r from-orange-500/20 to-amber-500/10 blur-[80px]" />
            
            <div
              ref={cardRef}
              className="relative animate-float overflow-hidden rounded-3xl border border-[rgba(249,115,22,0.3)] shadow-premium"
              style={{
                backdropFilter: 'blur(10px)',
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Gradient border top */}
              <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(249,115,22,0.6), rgba(139,92,246,0.3), rgba(249,115,22,0.6), transparent)' }} />
              
              {/* Window controls */}
              <div className="flex h-12 items-center justify-between gap-2 border-b border-[#1C1F2E] bg-[#0D0F17]/90 px-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-[#FF5F56]" />
                  <div className="h-3 w-3 rounded-full bg-[#FFBD2E]" />
                  <div className="h-3 w-3 rounded-full bg-[#27C93F]" />
                </div>
                <span className="text-xs text-[#3F4558] font-mono">AgentStack Dashboard</span>
                <div className="w-12" />
              </div>
              
              {/* Dashboard Content */}
              <div className="aspect-[16/10] w-full bg-gradient-to-br from-[#0D0F17] via-[#13161F] to-[#0D0F17] p-5">
                <div className="grid h-full grid-cols-4 gap-4">
                  {/* Sidebar */}
                  <div className="col-span-1 rounded-xl bg-[#0D0F17] border border-[#1C1F2E] p-4 space-y-3">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                        <span className="text-xs font-bold text-[#07080C]">A</span>
                      </div>
                      <span className="text-xs text-[#94A3B8]">AgentStack</span>
                    </div>
                    <div className="h-2 w-20 rounded bg-[#1C1F2E]" />
                    <div className="h-2 w-full rounded bg-[#1C1F2E]" />
                    <div className="h-2 w-3/4 rounded bg-[#1C1F2E]" />
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-[#F97316]" />
                        <div className="h-2 w-16 rounded bg-[#1C1F2E]" />
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-[#8B5CF6]" />
                        <div className="h-2 w-14 rounded bg-[#1C1F2E]" />
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-[#10B981]" />
                        <div className="h-2 w-12 rounded bg-[#1C1F2E]" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Main Content */}
                  <div className="col-span-3 space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="h-6 w-32 rounded bg-[#1C1F2E]" />
                      <div className="flex gap-2">
                        <div className="h-8 w-24 rounded-lg bg-[#F97316]/30" />
                        <div className="h-8 w-8 rounded-lg bg-[#1C1F2E]" />
                      </div>
                    </div>
                    
                    {/* Cards Row */}
                    <div className="grid grid-cols-3 gap-4 h-[calc(100%-40px)]">
                      {/* Card 1 */}
                      <div className="rounded-xl bg-[#0D0F17] border border-[#1C1F2E] p-3">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="h-3 w-3 rounded-full bg-[#F97316]" />
                          <div className="h-2 w-16 rounded bg-[#1C1F2E]" />
                        </div>
                        <div className="space-y-2">
                          <div className="h-20 rounded-lg bg-[#13161F] border border-[#1C1F2E] flex items-center justify-center">
                            <div className="flex gap-1">
                              {[40, 60, 35, 70, 55].map((h, i) => (
                                <div key={i} className="w-3 rounded-full bg-[#F97316]/40" style={{ height: `${h}%` }} />
                              ))}
                            </div>
                          </div>
                          <div className="h-14 rounded-lg bg-[#13161F] border border-[#1C1F2E]" />
                        </div>
                      </div>
                      
                      {/* Card 2 */}
                      <div className="rounded-xl bg-[#0D0F17] border border-[#1C1F2E] p-3">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="h-3 w-3 rounded-full bg-[#8B5CF6]" />
                          <div className="h-2 w-20 rounded bg-[#1C1F2E]" />
                        </div>
                        <div className="space-y-2">
                          <div className="h-24 rounded-lg bg-[#13161F] border border-[#1C1F2E]" />
                          <div className="h-12 rounded-lg bg-[#13161F] border border-[#1C1F2E]" />
                        </div>
                      </div>
                      
                      {/* Card 3 */}
                      <div className="rounded-xl bg-[#0D0F17] border border-[#1C1F2E] p-3">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="h-3 w-3 rounded-full bg-[#10B981]" />
                          <div className="h-2 w-14 rounded bg-[#1C1F2E]" />
                        </div>
                        <div className="space-y-2">
                          <div className="h-18 rounded-lg bg-[#13161F] border border-[#1C1F2E] flex items-center justify-center">
                            <div className="text-xs text-[#3F4558] font-mono">WORKFLOW</div>
                          </div>
                          <div className="h-14 rounded-lg bg-[#13161F] border border-[#1C1F2E]" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Subtle shine effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              
              {/* The actual Kanban Board */}
              <div className="absolute inset-0 p-5 flex items-center justify-center">
                <div className="w-full h-full glow-board rounded-2xl bg-[#0D0F17]/80 backdrop-blur-xl border border-[#1C1F2E]/50 p-4 overflow-hidden">
                  <KanbanBoard />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
