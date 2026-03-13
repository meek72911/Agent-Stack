"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Layers, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function MarketingNavbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Features", href: "#features" },
        { name: "Workflows", href: "#workflows" },
        { name: "Pricing", href: "#pricing" },
        { name: "Open Source", href: "https://github.com/Meek72vibe/agentstack" },
    ];

    return (
        <header 
            className={cn(
                "fixed top-0 left-0 right-0 z-[100] transition-all duration-300 border-b",
                isScrolled 
                    ? "bg-[#020202]/80 backdrop-blur-md border-white/10 py-3 shadow-2xl" 
                    : "bg-transparent border-transparent py-5"
            )}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-primary to-orange-600 shadow-glow-sm transition-transform group-hover:scale-110">
                            <Layers className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-extrabold tracking-tight text-white">AgentStack</span>
                            <span className="text-[10px] uppercase tracking-widest text-primary font-bold">Aura v3.0</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link 
                                key={link.name} 
                                href={link.href}
                                className="text-sm font-medium text-muted-foreground hover:text-white transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Auth Buttons */}
                    <div className="hidden md:flex items-center gap-4">
                        <Link href="/login">
                            <Button variant="ghost" className="text-white hover:bg-white/5 font-semibold">
                                Log in
                            </Button>
                        </Link>
                        <Link href="/signup">
                            <Button className="bg-gradient-premium text-[#07080C] font-bold border-none shadow-glow-sm hover:scale-[1.02] active:scale-95 transition-all">
                                Get Started
                            </Button>
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button 
                        className="md:hidden p-2 text-white"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="md:hidden absolute top-full left-0 right-0 bg-[#0A0B10] border-b border-white/10 p-6 space-y-6 shadow-2xl"
                >
                    <div className="flex flex-col gap-4">
                        {navLinks.map((link) => (
                            <Link 
                                key={link.name} 
                                href={link.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-lg font-medium text-white"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                    <div className="flex flex-col gap-3 pt-6 border-t border-white/5">
                        <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                            <Button variant="outline" className="w-full border-white/10 text-white">
                                Log in
                            </Button>
                        </Link>
                        <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                            <Button className="w-full bg-primary text-black font-bold">
                                Get Started
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            )}
        </header>
    );
}
