"use client";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { question: "What is AgentStack?", answer: "AgentStack is an AI workflow automation platform for agencies and teams. We give you 82+ pre-built agent templates to automate repetitive tasks like client reports, research, content and support — no coding needed." },
  { question: "What AI models do you support?", answer: "AgentStack runs on Claude Haiku and Sonnet by Anthropic. You can bring your own API key (BYOK) for full control over your usage and costs." },
  { question: "Do I need to know how to code?", answer: "No. AgentStack is built for non-technical users. Pick a template, configure your inputs, and run." },
  { question: "What file types can I upload?", answer: "PDF and DOCX files are supported. Upload documents as context for your agent workflows." },
  { question: "Is my API key safe?", answer: "Yes. All API keys are encrypted with AES-256 and never stored in plain text." },
  { question: "Can I white-label AgentStack for my agency?", answer: "Yes. The Team plan ($149/month) includes white-label options for agency use." },
  { question: "Is there a free plan?", answer: "Yes. Free plan includes 2 workflows and 1,000 runs per month — no credit card needed." },
];

export function FAQ() {
  return (
    <section id="faq" className="bg-[rgba(13,15,23,0.3)] py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="text-xs font-semibold tracking-[3px] text-[#F97316] uppercase">FAQ</span>
          <h2 className="mt-4 font-display text-3xl font-bold sm:text-4xl" style={{ color: '#F1F5F9' }}>Frequently Asked Questions</h2>
          <p className="mt-4 text-lg text-[#94A3B8]">Everything you need to know about AgentStack.</p>
        </div>
        <Accordion type="single" collapsible className="mt-12 space-y-4">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="rounded-xl border border-[#1C1F2E] bg-[#0D0F17] px-6">
              <AccordionTrigger className="text-left text-base font-medium hover:no-underline text-[#F1F5F9]">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-[#94A3B8]">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
