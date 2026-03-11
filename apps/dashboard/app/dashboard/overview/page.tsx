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

    const displayName =
        session.user.user_metadata?.full_name?.split(" ")[0] ??
        session.user.email?.split("@")[0] ??
        "Builder";

    return (
        <div className="space-y-6">
            {/* Welcome Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Good evening, {displayName} 👋</h1>
                    <p className="mt-1 text-muted-foreground">
                        Your AI agent team is ready to work.
                    </p>
                </div>
                <Button asChild className="gap-2">
                    <Link href="/dashboard/workflows/builder">
                        <Plus className="h-4 w-4" /> New Workflow
                    </Link>
                </Button>
            </div>

            {/* Stats */}
            <StatsOverview />

            {/* Quick Actions */}
            <div className="grid gap-4 sm:grid-cols-3">
                {[
                    {
                        title: "Browse Templates",
                        description: "Start with a proven workflow template",
                        href: "/dashboard/templates",
                        icon: Zap,
                    },
                    {
                        title: "Manage Agents",
                        description: "Activate agents from our library of 82",
                        href: "/dashboard/agents",
                        icon: Bot,
                    },
                    {
                        title: "View Workflows",
                        description: "See all your multi-agent pipelines",
                        href: "/dashboard/workflows",
                        icon: GitBranch,
                    },
                ].map((item) => {
                    const Icon = item.icon;
                    return (
                        <Card key={item.href} className="group hover:shadow-md transition-shadow">
                            <CardHeader className="pb-2">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    <Icon className="h-5 w-5" />
                                </div>
                                <CardTitle className="text-sm mt-2">{item.title}</CardTitle>
                                <CardDescription className="text-xs">{item.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button variant="ghost" size="sm" asChild className="gap-1 pl-0 text-primary">
                                    <Link href={item.href}>
                                        Get started <ArrowRight className="h-3 w-3" />
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Recent Activity */}
            <RecentActivity />
        </div>
    );
}
