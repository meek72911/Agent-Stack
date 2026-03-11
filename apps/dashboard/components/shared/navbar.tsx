"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Bell,
  Settings,
  LogOut,
  User,
  ChevronDown,
  Command,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import { useUIStore } from "@/stores/ui-store";

interface NavbarProps {
  variant?: "dashboard" | "marketing";
}

export function Navbar({ variant = "dashboard" }: NavbarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const { toggleCommandPalette } = useUIStore();
  const [searchFocused, setSearchFocused] = useState(false);

  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() ?? "U";

  if (variant === "marketing") {
    return (
      <nav className="sticky top-0 z-50 border-b border-[rgba(249,115,22,0.08)] bg-[rgba(7,8,12,0.75)] backdrop-blur-[24px] backdrop-saturate-[180%]">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F97316]">
              <span className="text-lg font-bold text-[#07080C]">A</span>
            </div>
            <span className="text-xl font-bold text-[#F1F5F9]">AgentStack</span>
          </Link>
          <div className="hidden items-center gap-8 md:flex">
            {[
              { href: "/#workflows", label: "Workflows" },
              { href: "/#pricing", label: "Pricing" },
              { href: "/docs", label: "Docs" },
              { href: "https://github.com/Meek72vibe/agentstack", label: "GitHub" },
            ].map((link) => (
              <Link key={link.href} href={link.href} className="text-sm font-medium text-[#94A3B8] transition-all hover:text-[#F1F5F9]" target={link.href.startsWith("http") ? "_blank" : "_self"}>
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login"><Button variant="ghost" size="sm" className="text-[#94A3B8] hover:text-[#F1F5F9]">Sign In</Button></Link>
            <Link href="/register"><Button size="sm" className="bg-[#F97316] text-[#07080C] font-semibold" style={{ borderRadius: '8px', boxShadow: '0 0 20px rgba(249,115,22,0.3)' }}>Start Free</Button></Link>
          </div>
        </div>
      </nav>
    );
  }
              { href: "/#features", label: "Features" },
              { href: "/#pricing", label: "Pricing" },
              { href: "/#faq", label: "FAQ" },
              { href: "https://agentstack-api.onrender.com/docs", label: "API Docs" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                target={link.href.startsWith("http") ? "_blank" : "_self"}
                rel={link.href.startsWith("http") ? "noopener noreferrer" : ""}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Sign Up</Button>
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center gap-4 px-4 lg:px-6">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search agents, workflows..."
            className={cn(
              "h-9 pl-9 pr-12 transition-all",
              searchFocused && "ring-2 ring-primary/20"
            )}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            onKeyDown={(e) => {
              if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                toggleCommandPalette();
              }
            }}
          />
          <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 select-none rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
            <Command className="inline h-3 w-3" />K
          </kbd>
        </div>

        <div className="ml-auto flex items-center gap-2">
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative h-9 w-9">
            <Bell className="h-4 w-4" />
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
              3
            </span>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex h-9 items-center gap-2 px-2"
              >
                <Avatar className="h-7 w-7">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback className="text-xs">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden text-sm font-medium lg:inline-block">
                  {user?.name ?? "User"}
                </span>
                <ChevronDown className="h-3 w-3 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/settings/profile" className="flex items-center gap-2">
                  <User className="h-4 w-4" /> Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" /> Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => logout()}
                className="text-destructive focus:text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4" /> Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
