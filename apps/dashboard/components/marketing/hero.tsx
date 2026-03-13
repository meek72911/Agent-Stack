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
          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.4 }} className="relative perspective-2000" ref={containerRef}>
            {/* Parallax background orbs */}
            <div ref={orb1Ref} className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-gradient-to-r from-orange-500/30 to-amber-500/20 blur-[120px] pointer-events-none" />
            <div ref={orb2Ref} className="absolute -bottom-40 -left-32 h-80 w-80 rounded-full bg-gradient-to-r from-violet-500/20 to-purple-500/30 blur-[100px] pointer-events-none" />
            
            <div ref={cardRef} className="relative z-10">
              {/* MacBook Screen Container */}
              <div className="relative mx-auto rounded-[1.5rem] bg-[#1a1a1a] p-2 shadow-2xl ring-1 ring-white/10 overflow-hidden group">
                {/* Metallic Frame / Bezel */}
                <div className="relative rounded-[1.2rem] bg-[#020202] pt-6 pb-2 px-1 shadow-inner border border-white/5">
                  {/* Camera Notch Area */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 h-4 w-24 bg-black rounded-b-xl z-50 flex items-center justify-center gap-2 px-3">
                    <div className="h-1 w-1 rounded-full bg-blue-500/40" />
                    <div className="h-1.5 w-1.5 rounded-full bg-white/5" />
                  </div>

                  {/* The actual Screen Content (Kanban Board) */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg bg-[#0D0F17]">
                    <div className="absolute inset-0 glow-board">
                      <KanbanBoard />
                    </div>
                    
                    {/* Subtle Screen Glare */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-transparent pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* MacBook Base (Perspective Base) */}
              <div className="relative mx-auto -mt-1 h-3 w-[105%] -left-[2.5%] rounded-b-2xl bg-gradient-to-b from-[#404040] to-[#121212] shadow-2xl">
                {/* Lip / Opening Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1.5 bg-[#000000]/40 rounded-b-md shadow-inner" />
              </div>
              
              {/* Ground Reflection / Glow */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[80%] h-12 bg-orange-600/20 blur-3xl pointer-events-none" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
