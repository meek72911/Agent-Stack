import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Bot, GitBranch, Zap, Plus, ArrowRight } from "lucide-react";
import { createServerClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { StatsOverview } from "@/components/dashboard/stats-overview";
import { RecentActivity } from "@/components/dashboard/recent-activity";

export const metadata: Metadata = { title: "Dashboard - AgentStack" };

/** Dashboard home page — server component, reads Supabase session server-side */
export default async function DashboardOverviewPage() {
    const supabase = createServerClient();
    const {
        data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
        redirect("/login");
    }

    // Fetch real counts on the server for quick actions
    const { data: agentsData } = await supabase.from("agents").select("id", { count: "exact", head: true });
    const { data: workflowsData } = await supabase.from("workflows").select("id", { count: "exact", head: true });

    const agentCount = agentsData?.length ?? 0;
    const workflowCount = workflowsData?.length ?? 0;

    const displayName =
        session.user.user_metadata?.full_name?.split(" ")[0] ??
        session.user.email?.split("@")[0] ??
        "Builder";

    const quickActions = [
        {
            title: "Browse Templates",
            description: "Start with a proven workflow template",
            href: "/dashboard/templates",
            icon: Zap,
        },
        {
            title: "Manage Agents",
            description: `Activate agents from our library of ${agentCount}`,
            href: "/dashboard/agents",
            icon: Bot,
        },
        {
            title: "View Workflows",
            description: `See all your ${workflowCount} multi-agent pipelines`,
            href: "/dashboard/workflows",
            icon: GitBranch,
        },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Welcome Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-white/5">
                <div>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight font-display">
                        Good evening, <span className="text-gradient-premium">{displayName}</span> 👋
                    </h1>
                    <p className="mt-3 text-muted-foreground font-medium flex items-center gap-2">
                         <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
                        System Online • Your AI agent team has completed 12 tasks today.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="rounded-xl px-6 border-white/10 hover:bg-white/5 transition-all hidden sm:flex">
                        System Logs
                    </Button>
                    <Button asChild className="gap-2 rounded-xl px-8 shadow-glow transition-all hover:scale-105 active:scale-95 bg-gradient-to-r from-primary to-orange-600 border-0">
                        <Link href="/dashboard/workflows/builder">
                            <Plus className="h-5 w-5" /> Create Neural Workflow
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <StatsOverview />

            {/* Quick Actions */}
            <div className="grid gap-6 sm:grid-cols-3">
                {quickActions.map((item, i) => {
                    const Icon = item.icon;
                    return (
                        <Card key={item.href} className="premium-card group relative h-full flex flex-col pt-4">
                            <CardHeader className="pb-2 relative z-10 flex-1">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-glow-sm transition-transform group-hover:scale-110 group-hover:rotate-3 duration-500">
                                        <Icon className="h-6 w-6" />
                                    </div>
                                    <div className="h-8 w-8 rounded-full border border-white/5 flex items-center justify-center bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                        <ArrowRight className="h-4 w-4 text-primary" />
                                    </div>
                                </div>
                                <CardTitle className="text-xl font-extrabold tracking-tight group-hover:text-primary transition-colors">
                                    {item.title}
                                </CardTitle>
                                <CardDescription className="text-sm text-muted-foreground/80 leading-relaxed mt-2">
                                    {item.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-0 relative z-10">
                                <Button variant="ghost" asChild className="w-full justify-between px-4 py-6 rounded-xl bg-white/5 hover:bg-primary/10 hover:text-primary border border-white/5 transition-all active:scale-95">
                                    <Link href={item.href} className="flex items-center justify-between w-full font-bold uppercase tracking-wider text-[10px]">
                                        Explore Feature <Plus className="h-4 w-4" />
                                    </Link>
                                </Button>
                            </CardContent>
                            
                            {/* Visual Polish */}
                            <div className="absolute top-0 right-0 p-3 opacity-20 transform translate-x-2 -translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-700">
                                <Icon className="h-16 w-16 text-primary/10 blur-sm" />
                            </div>
                        </Card>
                    );
                })}
            </div>

            {/* Recent Activity */}
            <RecentActivity />
        </div>
    );
}
