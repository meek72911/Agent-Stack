"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What AI models does AgentStack support?",
    answer:
      "AgentStack supports GPT-4o, GPT-4, Claude 3.5 Sonnet, Llama 3, Mistral, and any OpenAI-compatible endpoint. You can switch models per agent or even per workflow step.",
  },
  {
    question: "Do I need to manage infrastructure?",
    answer:
      "No. AgentStack handles all infrastructure -- compute, scaling, monitoring, and deployments. Your agents run in isolated containers with automatic scaling based on load.",
  },
  {
    question: "Can I self-host AgentStack?",
    answer:
      "Yes! We offer a Docker-based self-hosted option for Enterprise customers who need to keep data on-premise. It includes the full platform with SSO integration.",
  },
  {
    question: "How does pricing work for executions?",
    answer:
      "Each agent run counts as one execution. Multi-step workflows count as a single execution regardless of the number of steps. Model token costs are passed through at cost with no markup.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Absolutely. We are SOC 2 Type II certified. All data is encrypted at rest and in transit. Agent conversations are isolated per workspace, and you can enable data retention policies.",
  },
  {
    question: "Can I migrate from LangChain / CrewAI?",
    answer:
      "Yes. We provide migration guides and import tools for LangChain, CrewAI, AutoGen, and custom Python agents. Most migrations take under an hour.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Everything you need to know about AgentStack.
          </p>
        </div>

        <Accordion
          type="single"
          collapsible
          className="mt-12 space-y-4"
        >
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="rounded-xl border border-border bg-card px-6 data-[state=open]:shadow-sm"
            >
              <AccordionTrigger className="text-left text-base font-medium hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
