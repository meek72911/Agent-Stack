"use client";
const stats = ["✦ 82+ Agent Templates", "✦ 8 Workflow Categories", "✦ Claude Powered", "✦ AGPL-3.0 Licensed", "✦ AES-256 Encrypted Keys", "✦ Real-Time Execution Traces", "✦ PDF + DOCX Support", "✦ Zero Code Required"];
export function StatsMarquee() {
  return (
    <section className="border-y border-[#1C1F2E] bg-[rgba(13,15,23,0.5)] py-4 overflow-hidden">
      <div className="relative"><div className="flex animate-marquee">
        {stats.map((stat, i) => <div key={`first-${i}`} className="flex items-center gap-2 whitespace-nowrap px-8 text-sm text-[#3F4558]"><span className="text-[#F97316]">{stat.split('✦')[0]}</span><span>{stat.split('✦')[1]}</span></div>)}
        {stats.map((stat, i) => <div key={`second-${i}`} className="flex items-center gap-2 whitespace-nowrap px-8 text-sm text-[#3F4558]"><span className="text-[#F97316]">{stat.split('✦')[0]}</span><span>{stat.split('✦')[1]}</span></div>)}
      </div></div>
    </section>
  );
}
