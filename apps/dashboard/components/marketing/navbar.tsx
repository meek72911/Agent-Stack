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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
                <div className="grid grid-cols-2 lg:grid-cols-3 items-center h-full">
                    {/* Column 1: Logo */}
                    <div className="flex justify-start">
                        <Link href="/" className="flex items-center gap-3 group shrink-0">
                            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-[#F97316] shadow-glow-sm transition-transform group-hover:scale-110">
                                <Layers className="h-5 w-5 text-[#07080C]" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl font-extrabold tracking-tight text-white leading-none">AgentStack</span>
                                <span className="text-[10px] uppercase tracking-widest text-[#F97316] font-bold mt-1">Aura v3.0</span>
                            </div>
                        </Link>
                    </div>

                    {/* Column 2: Desktop Navigation (Hidden on Tablet/Mobile) */}
                    <nav className="hidden lg:flex items-center justify-center gap-8">
                        {navLinks.map((link) => (
                            <Link 
                                key={link.name} 
                                href={link.href}
                                className="text-sm font-bold text-muted-foreground hover:text-white transition-all hover:scale-105"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Column 3: Auth Buttons & Mobile Toggle */}
                    <div className="flex justify-end items-center gap-3">
                        <div className="hidden md:flex items-center gap-3">
                            <Link href="/login">
                                <Button variant="ghost" className="text-white hover:bg-white/5 font-bold px-4">
                                    Log in
                                </Button>
                            </Link>
                            <Link href="/signup">
                                <Button className="bg-[#F97316] text-[#07080C] font-black border-none shadow-premium hover:bg-[#FB923C] hover:scale-105 active:scale-95 transition-all px-8 h-11">
                                    Get Started
                                </Button>
                            </Link>
                        </div>
                        
                        {/* Mobile Menu Button */}
                        <button 
                            className="lg:hidden p-2 text-white hover:bg-white/5 rounded-lg transition-colors"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X /> : <Menu />}
                        </button>
                    </div>
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
                            <Button className="w-full bg-[#F97316] text-[#07080C] font-black h-11">
                                Get Started
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            )}
        </header>
    );
}
