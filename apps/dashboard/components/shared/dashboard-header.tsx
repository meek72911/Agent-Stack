"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, Settings, LogOut, User, ChevronDown, Layers, Search } from "lucide-react";
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
import { useUser } from "@/hooks/use-user";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export function DashboardHeader() {
    const router = useRouter();
    const { user, profile } = useUser();
    const supabase = createClient();

    const initials =
        user?.user_metadata?.full_name
            ?.split(" ")
            .map((n: string) => n[0])
            .join("")
            .toUpperCase() ??
        user?.email?.[0]?.toUpperCase() ??
        "U";

    async function handleLogout() {
        const { error } = await supabase.auth.signOut();
        if (error) {
            toast.error("Failed to sign out");
        } else {
            router.push("/login");
            router.refresh();
        }
    }

    return (
        <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-white/[0.05] bg-background/98 px-4 backdrop-blur-md lg:px-8">
            {/* Premium Search */}
            <div className="relative hidden flex-1 max-w-lg sm:flex items-center group">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors pointer-events-none z-10" />
                <Input
                    placeholder="Search agents, neural workflows, or logs..."
                    className="h-11 pl-11 pr-16 bg-white/[0.03] border-white/5 rounded-xl group-focus-within:border-primary/50 group-focus-within:bg-white/[0.05] transition-all shadow-inner font-medium text-sm placeholder:text-muted-foreground/50"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-bold text-muted-foreground/50 uppercase tracking-tighter pointer-events-none group-focus-within:border-primary/30 group-focus-within:text-primary transition-all">
                    ⌘ K
                </div>
            </div>

            <div className="ml-auto flex items-center gap-2">
                {/* Admin Mode Toggle */}
                {(profile?.role === "admin" || profile?.role === "owner") && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="hidden md:flex items-center gap-2 px-4 h-10 rounded-xl bg-primary/10 border border-primary/20 text-primary font-bold hover:bg-primary/20 hover:border-primary/30 active:scale-95 transition-all group"
                        asChild
                    >
                        <Link href="/dashboard/admin">
                            <Zap className="h-4 w-4 fill-primary animate-pulse" />
                            <span className="tracking-tight">Admin Mode</span>
                        </Link>
                    </Button>
                )}

                {/* Notifications Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="relative h-10 w-10 hover:bg-white/5 active:scale-95 transition-all">
                            <Bell className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
                            <span className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-[0_0_10px_rgba(249,115,22,0.5)]">
                                2
                            </span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80 p-0 overflow-hidden glass-strong border-white/10 shadow-premium">
                        <div className="flex items-center justify-between p-4 border-b border-white/5 bg-white/5">
                            <h3 className="text-sm font-semibold">Notifications</h3>
                            <Button variant="ghost" size="sm" className="h-7 text-[10px] uppercase tracking-wider text-muted-foreground hover:text-primary">
                                Mark all read
                            </Button>
                        </div>
                        <div className="max-h-[300px] overflow-y-auto">
                            {[
                                { title: "Agent Deployment", description: "Market Analyst Agent is now live", time: "5m ago", type: "success" },
                                { title: "System Alert", description: "API rate limit reached for OpenAI integration", time: "12m ago", type: "warning" }
                            ].map((n, i) => (
                                <DropdownMenuItem key={i} className="flex flex-col items-start gap-1 p-4 border-b border-white/5 last:border-0 hover:bg-white/5 focus:bg-white/5 cursor-pointer">
                                    <div className="flex items-center justify-between w-full">
                                        <span className="text-sm font-medium">{n.title}</span>
                                        <span className="text-[10px] text-muted-foreground">{n.time}</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground leading-relaxed">{n.description}</p>
                                </DropdownMenuItem>
                            ))}
                        </div>
                        <div className="p-2 border-t border-white/5 text-center">
                            <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground hover:text-primary">
                                View all notifications
                            </Button>
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* User Menu */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="flex h-10 items-center gap-2 px-2 hover:bg-white/5 rounded-lg transition-all active:scale-95">
                            <div className="p-0.5 rounded-full bg-gradient-to-tr from-primary to-purple-500 shadow-glow-sm">
                                <Avatar className="h-7 w-7 border-2 border-background">
                                    <AvatarImage src={user?.user_metadata?.avatar_url} />
                                    <AvatarFallback className="text-[10px] font-bold">{initials}</AvatarFallback>
                                </Avatar>
                            </div>
                            <div className="hidden flex-col items-start lg:flex text-left">
                                <span className="text-xs font-semibold leading-none">
                                    {user?.user_metadata?.full_name ?? user?.email?.split("@")[0] ?? "User"}
                                </span>
                                <span className="text-[10px] text-muted-foreground leading-none mt-1 uppercase tracking-tighter">
                                    Pro Plan
                                </span>
                            </div>
                            <ChevronDown className="h-3 w-3 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 glass-strong border-white/10 shadow-premium p-1">
                        <div className="flex items-center gap-3 p-3 mb-1">
                             <Avatar className="h-10 w-10">
                                <AvatarImage src={user?.user_metadata?.avatar_url} />
                                <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col min-w-0">
                                <p className="text-sm font-semibold truncate leading-none">
                                    {user?.user_metadata?.full_name ?? "User"}
                                </p>
                                <p className="text-[10px] text-muted-foreground truncate mt-1">
                                    {user?.email}
                                </p>
                            </div>
                        </div>
                        <DropdownMenuSeparator className="bg-white/5" />
                        <DropdownMenuItem asChild>
                            <Link href="/dashboard/settings/workspace" className="flex items-center gap-3 py-2 px-3 rounded-md transition-colors">
                                <User className="h-4 w-4 text-muted-foreground" /> 
                                <span className="text-sm">Account Settings</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/dashboard/settings" className="flex items-center gap-3 py-2 px-3 rounded-md transition-colors">
                                <Settings className="h-4 w-4 text-muted-foreground" /> 
                                <span className="text-sm">Preferences</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-white/5" />
                        <DropdownMenuItem
                            onClick={handleLogout}
                            className="flex items-center gap-3 py-2 px-3 rounded-md text-red-400 focus:text-red-400 focus:bg-red-400/10 cursor-pointer"
                        >
                            <LogOut className="h-4 w-4" /> 
                            <span className="text-sm font-medium">Power Off</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
