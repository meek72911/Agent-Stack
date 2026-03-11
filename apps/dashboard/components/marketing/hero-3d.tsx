"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function Hero3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const orbsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Parallax effect on mouse move
      const handleMouseMove = (e: MouseEvent) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;

        gsap.to(cardRef.current, {
          rotationY: x,
          rotationX: -y,
          duration: 0.5,
          ease: "power2.out",
          transformPerspective: 1000,
        });

        // Move orbs inversely for depth
        orbsRef.current.forEach((orb, i) => {
          if (orb) {
            const speed = (i + 1) * 0.3;
            gsap.to(orb, {
              x: -x * speed,
              y: -y * speed,
              duration: 0.5,
              ease: "power2.out",
            });
          }
        });
      };

      containerRef.current?.addEventListener("mousemove", handleMouseMove);

      // Initial animation
      gsap.from(cardRef.current, {
        rotationX: 30,
        rotationY: -20,
        opacity: 0,
        y: 50,
        duration: 1.2,
        ease: "power3.out",
      });

      // Orb floating animation
      orbsRef.current.forEach((orb, i) => {
        if (orb) {
          gsap.to(orb, {
            y: "+=30",
            duration: 3 + i,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
        }
      });

      // Ambient glow pulsing
      gsap.to(".ambient-glow", {
        opacity: 0.4,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      return () => {
        containerRef.current?.removeEventListener("mousemove", handleMouseMove);
      };
    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full perspective-1000"
      style={{ perspective: "1000px" }}
    >
      {/* 3D Background Orbs */}
      <div
        ref={(el) => (orbsRef.current[0] = el)}
        className="ambient-glow absolute -top-20 -right-20 h-64 w-64 rounded-full bg-gradient-to-r from-orange-500/30 to-amber-500/20 blur-[100px]"
        style={{ transform: "translateZ(-200px)" }}
      />
      <div
        ref={(el) => (orbsRef.current[1] = el)}
        className="ambient-glow absolute -bottom-40 -left-32 h-80 w-80 rounded-full bg-gradient-to-r from-violet-500/20 to-purple-500/30 blur-[120px]"
        style={{ transform: "translateZ(-300px)" }}
      />
      <div
        ref={(el) => (orbsRef.current[2] = el)}
        className="ambient-glow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-48 w-48 rounded-full bg-gradient-to-r from-orange-500/20 to-amber-500/10 blur-[80px]"
        style={{ transform: "translateZ(-150px)" }}
      />

      {/* 3D Card */}
      <div
        ref={cardRef}
        className="relative mx-auto max-w-2xl p-8"
        style={{
          transformStyle: "preserve-3d",
          transform: "rotateX(0deg) rotateY(0deg)",
        }}
      >
        <div className="rounded-3xl border border-orange-500/20 bg-black/40 backdrop-blur-xl p-8 shadow-[0_0_60px_rgba(249,115,22,0.3),0_0_120px_rgba(139,92,246,0.2)]">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm text-orange-400 font-medium">
              AI-Powered Workflow Engine
            </span>
          </div>
          <div className="space-y-4">
            <div className="h-3 w-3/4 rounded-full bg-white/10" />
            <div className="h-3 w-2/3 rounded-full bg-white/5" />
            <div className="flex gap-3 mt-6">
              <div className="h-8 w-20 rounded-lg bg-orange-500/30" />
              <div className="h-8 w-16 rounded-lg bg-violet-500/30" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
