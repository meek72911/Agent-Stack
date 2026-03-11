import Link from "next/link";

const footerLinks = {
  Product: [
    { label: "Workflows", href: "/#workflows" },
    { label: "Pricing", href: "/#pricing" },
    { label: "Docs", href: "/docs" },
    { label: "GitHub", href: "https://github.com/Meek72vibe/agentstack" },
  ],
  Company: [
    { label: "About", href: "/#about" },
    { label: "Contact", href: "mailto:contact@agentstack.dev" },
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-[#1C1F2E] bg-[#07080C] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute -top-20 -right-20 h-[300px] w-[300px] rounded-full bg-[#F97316]/10 blur-[100px]" />
        <div className="absolute -bottom-20 -left-20 h-[250px] w-[250px] rounded-full bg-[#8B5CF6]/8 blur-[80px]" />
      </div>
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-premium shadow-glow-sm group-hover:shadow-glow transition-shadow duration-300">
                <span className="text-lg font-bold text-[#07080C]">A</span>
              </div>
              <span className="text-xl font-bold text-[#F1F5F9] tracking-tight">AgentStack</span>
            </Link>
            <p className="mt-4 text-sm text-[#94A3B8]">AI agents for everyone. Zero friction.</p>
            <div className="mt-6 flex gap-4">
              <a href="https://github.com/Meek72vibe/agentstack" target="_blank" rel="noopener noreferrer" className="text-[#94A3B8] hover:text-[#F1F5F9] transition-colors duration-200">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"/></svg>
              </a>
              <a href="https://linkedin.com/in/sarthak-khedkar-10a968242" target="_blank" rel="noopener noreferrer" className="text-[#94A3B8] hover:text-[#F1F5F9] transition-colors duration-200">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#F1F5F9]">Product</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.Product.map((link) => (
                <li key={link.href}><Link href={link.href} className="text-sm text-[#94A3B8] hover:text-[#F1F5F9]" target={link.href.startsWith("http") ? "_blank" : "_self"}>{link.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#F1F5F9]">Company</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.Company.map((link) => (
                <li key={link.href}><Link href={link.href} className="text-sm text-[#94A3B8] hover:text-[#F1F5F9]" target={link.href.startsWith("http") ? "_blank" : "_self"}>{link.label}</Link></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[#1C1F2E] pt-8 sm:flex-row">
          <p className="text-sm text-[#3F4558]">© 2026 AgentStack · Built by Sarthak Khedkar, Pune</p>
          <p className="text-sm text-[#3F4558]">AGPL-3.0 · Powered by Claude</p>
        </div>
      </div>
    </footer>
  );
}
