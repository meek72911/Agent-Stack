"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is AgentStack?",
    answer:
      "AgentStack is an AI workflow automation platform for agencies and teams. We give you 82+ pre-built agent templates to automate repetitive tasks like client reports, research, content and support — no coding needed.",
  },
  {
    question: "What AI models do you support?",
    answer:
      "AgentStack runs on Claude Haiku and Sonnet by Anthropic. You can bring your own API key (BYOK) for full control over your usage and costs.",
  },
  {
    question: "Do I need to know how to code?",
    answer:
      "No. AgentStack is built for non-technical users. Pick a template, configure your inputs, and run.",
  },
  {
    question: "What file types can I upload?",
    answer:
      "PDF and DOCX files are supported. Upload documents as context for your agent workflows.",
  },
  {
    question: "Is my API key safe?",
    answer:
      "Yes. All API keys are encrypted with AES-256 and never stored in plain text.",
  },
  {
    question: "Can I white-label AgentStack for my agency?",
    answer:
      "Yes. The Team plan ($149/month) includes white-label options for agency use.",
  },
  {
    question: "Is there a free plan?",
    answer:
      "Yes. Free plan includes 2 workflows and 1,000 runs per month — no credit card needed.",
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
