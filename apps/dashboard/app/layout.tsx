import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";

import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "AgentStack - Your AI Product Team in 60 seconds",
  description:
    "9 free AI agent workflows that replace $50,000/yr of SaaS tools. One click. No code. Built for solo founders and devs.",
  keywords: ["AI agents", "SaaS replacement", "founder tools", "open source", "workflow automation"],
  openGraph: {
    title: "AgentStack | Your AI Product Team",
    description: "Build your team with 9 free AI agent workflows. Replaces Snyk, Semrush, Mabl and more.",
    url: "https://agentstack7.vercel.app",
    siteName: "AgentStack",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
