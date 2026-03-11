"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const testimonials = [
  {
    quote:
      "AgentStack cut our agent development time from weeks to hours. The workflow builder is a game-changer for our team.",
    name: "Sarah Chen",
    role: "CTO, Nexus AI",
    avatar: "",
    initials: "SC",
  },
  {
    quote:
      "We migrated 30 agents from a custom setup. Deployment, monitoring, analytics -- everything just works out of the box.",
    name: "Marcus Rivera",
    role: "Head of Engineering, DataForge",
    avatar: "",
    initials: "MR",
  },
  {
    quote:
      "The template marketplace alone saved us months of work. We launched our AI customer support in under a day.",
    name: "Emily Tanaka",
    role: "VP Product, CloudOps",
    avatar: "",
    initials: "ET",
  },
  {
    quote:
      "Enterprise-grade security with startup-speed iteration. AgentStack is the platform we wished we had two years ago.",
    name: "James Okonkwo",
    role: "CISO, FinSecure",
    avatar: "",
    initials: "JO",
  },
];

export function Testimonials() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(
    () => setCurrent((prev) => (prev + 1) % testimonials.length),
    []
  );

  const prev = useCallback(
    () =>
      setCurrent(
        (prev) => (prev - 1 + testimonials.length) % testimonials.length
      ),
    []
  );

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  const testimonial = testimonials[current];

  return (
    <section className="bg-muted/30 py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Loved by Engineering Teams
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            See what teams are building with AgentStack.
          </p>
        </div>

        <div className="relative mt-12">
          <div className="flex items-center justify-center">
            <Quote className="h-10 w-10 text-primary/20" />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
              className="mt-6 text-center"
            >
              <blockquote className="text-xl font-medium leading-relaxed md:text-2xl">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>
              <div className="mt-8 flex items-center justify-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={testimonial.avatar} />
                  <AvatarFallback>{testimonial.initials}</AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-full"
              onClick={prev}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={cn(
                    "h-2 rounded-full transition-all",
                    i === current
                      ? "w-6 bg-primary"
                      : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  )}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-full"
              onClick={next}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
