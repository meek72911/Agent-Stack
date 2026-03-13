"use client";
import { motion } from "framer-motion";
import { Github, Star, Book } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function OpenSource() {
  return (
    <section id="open-source" className="py-24 bg-[#07080C]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex-1">
            <Badge variant="outline" className="mb-4 border-white/20 text-white bg-white/5 px-4 py-1">
              AGPL-3.0 Licensed
            </Badge>
            <h2 className="font-display text-4xl font-bold text-[#F1F5F9] mb-6">
              Built for the community, <br />by the community.
            </h2>
            <p className="text-lg text-[#94A3B8] mb-8 max-w-xl">
              Self-host AgentStack in 5 minutes on your own infrastructure. No lock-in, no black boxes. Just pure, powerful AI agents.
            </p>
            
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <div className="text-2xl font-bold text-white">128</div>
                <div className="text-sm text-[#5F6782]">GitHub Stars</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">Active</div>
                <div className="text-sm text-[#5F6782]">Last commit: 2h ago</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <a href="https://github.com/meek72911/Agent-Stack" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="gap-2 bg-white text-black font-bold hover:bg-white/90">
                  <Github className="h-5 w-5" /> Star on GitHub
                </Button>
              </a>
              <a href="https://github.com/meek72911/Agent-Stack" target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="gap-2 border-white/10 text-white hover:bg-white/5 font-bold">
                  Read the Source
                </Button>
              </a>
            </div>
          </div>
          
          <div className="flex-1 w-full max-w-md">
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 font-mono text-xs text-[#94A3B8] space-y-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-3 w-3 rounded-full bg-red-500/50" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/50" />
                <div className="h-3 w-3 rounded-full bg-green-500/50" />
                <span className="ml-2 text-[10px] text-[#3F4558]">deploy-agentstack.sh</span>
              </div>
              <div className="text-white/40"># Pull the latest image</div>
              <div>$ docker pull agentstack/core:latest</div>
              <div className="text-white/40 mt-4"># Set your environment</div>
              <div>$ export AGENTSTACK_KEY=YOUR_KEY</div>
              <div className="text-white/40 mt-4"># Spin it up</div>
              <div className="text-green-400">$ docker-compose up -d</div>
              <div className="mt-6 text-white/20">AgentStack Core v3.0 starting...</div>
              <div className="text-white/20">Ready on http://localhost:3000</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
