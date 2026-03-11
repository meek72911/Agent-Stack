"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Waitlist() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => { setSubmitted(true); setLoading(false); }, 1000);
  };

  return (
    <section className="py-24">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center">
          <h2 className="font-display text-4xl font-extrabold sm:text-5xl" style={{ background: 'linear-gradient(135deg, #F97316 0%, #8B5CF6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Start Building AI Workflows Today</h2>
          <p className="mt-4 text-lg text-[#94A3B8]">Join the waitlist. Get early access + 3 months free on Pro at launch.</p>
          {submitted ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mt-8 flex items-center justify-center gap-2 text-[#10B981]">
              <Check className="h-5 w-5" /><span className="text-lg font-medium">You're on the list!</span>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required className="flex-1 bg-[#0D0F17] border-[#1C1F2E] text-[#F1F5F9] placeholder:text-[#3F4558] focus:border-[#F97316]" style={{ borderRadius: '10px', padding: '14px 18px' }} />
              <Button type="submit" disabled={loading} className="bg-[#F97316] text-[#07080C] font-bold" style={{ borderRadius: '10px', padding: '14px 24px' }}>
                {loading ? <span className="animate-pulse">Joining...</span> : <><span>Join Waitlist</span><ArrowRight className="ml-2 h-5 w-5" /></>}
              </Button>
            </form>
          )}
          <p className="mt-4 text-sm text-[#3F4558]">No spam. Unsubscribe anytime.</p>
        </motion.div>
      </div>
    </section>
  );
}
