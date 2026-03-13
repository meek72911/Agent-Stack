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
                "fixed top-4 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 ease-in-out",
                isScrolled 
                    ? "w-[95%] max-w-5xl" 
                    : "w-[90%] max-w-7xl"
            )}
        >
            <div className={cn(
                "w-full h-16 px-6 relative transition-all duration-500 ease-in-out border border-white/10 shadow-2xl overflow-hidden",
                isScrolled 
                    ? "bg-black/80 backdrop-blur-xl rounded-2xl py-2" 
                    : "bg-black/40 backdrop-blur-md rounded-[24px] py-3"
            )}>
                <div className="grid grid-cols-2 lg:grid-cols-3 items-center h-full">
                    {/* Column 1: Logo */}
                    <div className="flex justify-start">
                        <Link href="/" className="flex items-center gap-3 group shrink-0">
                            <div className="h-9 w-9 flex items-center justify-center rounded-lg bg-[#F97316] shadow-glow-sm transition-transform group-hover:scale-110">
                                <Layers className="h-5 w-5 text-[#07080C]" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-lg font-extrabold tracking-tight text-white leading-none">AgentStack</span>
                                <span className="text-[9px] uppercase tracking-widest text-[#F97316] font-bold mt-0.5">Aura v3.0</span>
                            </div>
                        </Link>
                    </div>

                    {/* Column 2: Desktop Navigation */}
                    <nav className="hidden lg:flex items-center justify-center gap-8">
                        {navLinks.map((link) => (
                            <Link 
                                key={link.name} 
                                href={link.href}
                                className="text-xs font-bold text-white/70 hover:text-white transition-all hover:scale-105 uppercase tracking-wider"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Column 3: Auth Buttons & Mobile Toggle */}
                    <div className="flex justify-end items-center gap-3">
                        <div className="hidden md:flex items-center gap-3">
                            <Link href="/login">
                                <Button variant="ghost" className="text-white hover:bg-white/5 font-bold px-4 h-9 text-xs">
                                    Log in
                                </Button>
                            </Link>
                            <Link href="/signup">
                                <Button className="bg-[#F97316] text-[#07080C] font-black border-none shadow-glow-sm hover:bg-[#FB923C] hover:scale-105 active:scale-95 transition-all px-6 h-9 text-xs uppercase tracking-tighter">
                                    Get Started
                                </Button>
                            </Link>
                        </div>
                        
                        {/* Mobile Menu Button */}
                        <button 
                            className="lg:hidden p-2 text-white hover:bg-white/5 rounded-lg transition-colors"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Expansion */}
                {mobileMenuOpen && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="lg:hidden border-t border-white/5 mt-4 pt-6 pb-4 space-y-6"
                    >
                        <div className="flex flex-col gap-4">
                            {navLinks.map((link) => (
                                <Link 
                                    key={link.name} 
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-sm font-bold text-white/70 hover:text-white uppercase tracking-widest"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                        <div className="flex flex-col gap-3 pt-6 border-t border-white/5">
                            <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                                <Button variant="outline" className="w-full border-white/10 text-white text-xs font-bold uppercase">
                                    Log in
                                </Button>
                            </Link>
                            <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                                <Button className="w-full bg-[#F97316] text-[#07080C] font-black h-10 text-xs uppercase">
                                    Get Started
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                )}
            </div>
        </header>
    );
}
