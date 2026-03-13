"use client";
const stats = ["✦ 82+ Agent Templates", "✦ 8 Workflow Categories", "✦ Claude Powered", "✦ AGPL-3.0 Licensed", "✦ AES-256 Encrypted Keys", "✦ Real-Time Execution Traces", "✦ PDF + DOCX Support", "✦ Zero Code Required"];
export function StatsMarquee() {
  return (
    <section className="border-y border-white/5 bg-black/40 py-4 overflow-hidden relative group">
      <div className="flex animate-marquee hover:[animation-play-state:paused]">
        {[...stats, ...stats].map((stat, i) => (
          <div key={i} className="flex items-center gap-3 whitespace-nowrap px-10">
            <span className="text-primary text-xl">✦</span>
            <span className="text-sm font-bold text-muted-foreground uppercase tracking-[0.2em] group-hover:text-white transition-colors duration-500">
              {stat.replace('✦ ', '')}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
