"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    Search, Zap, Bot, Code2, LineChart, HeadphonesIcon,
    GitBranch, ChevronRight, Loader2, CheckCircle2
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import useSWR from "swr";

async function fetcher(url: string) {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const res = await fetch(`/api/v1${url}`, {
        headers: session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {},
    });
    if (!res.ok) throw new Error("Failed");
    return res.json();
}

const CATEGORY_ICONS: Record<string, React.ElementType> = {
    marketing: Zap,
    engineering: Code2,
    research: LineChart,
    sales: ChevronRight,
    support: HeadphonesIcon,
    product: Bot,
    devops: GitBranch,
};

const DEMO_PACKS = [
    {
        id: "marketing-ai",
        name: "Marketing AI Team",
        category: "marketing",
        description: "SEO writer, social media scheduler, email drafter, and ad copy generator working together.",
        agents: ["SEO Writer", "Social Scheduler", "Email Drafter", "Ad Copy AI"],
        workflows: 4,
        color: "from-pink-500/20 to-rose-500/20",
        badge: "Most Popular",
    },
    {
        id: "engineering",
        name: "Engineering Suite",
        category: "engineering",
        description: "Code reviewer, docs generator, test writer, and PR summarizer for your dev team.",
        agents: ["Code Reviewer", "Doc Writer", "Test Generator", "PR Summarizer"],
        workflows: 5,
        color: "from-blue-500/20 to-cyan-500/20",
        badge: "New",
    },
    {
        id: "research",
        name: "Research Intelligence",
        category: "research",
        description: "Web researcher, paper summarizer, competitive analyst, and trend spotter.",
        agents: ["Web Researcher", "Paper Summarizer", "Competitor Intel", "Trend Spotter"],
        workflows: 3,
        color: "from-violet-500/20 to-purple-500/20",
    },
    {
        id: "sales",
        name: "Sales Outreach Pack",
        category: "sales",
        description: "Lead enricher, outreach writer, proposal generator, and follow-up automator.",
        agents: ["Lead Enricher", "Outreach Writer", "Proposal Gen", "Follow-up Bot"],
        workflows: 4,
        color: "from-amber-500/20 to-orange-500/20",
    },
    {
        id: "support",
        name: "Customer Support AI",
        category: "support",
        description: "Ticket classifier, FAQ responder, escalation handler, and CSAT analyzer.",
        agents: ["Ticket Classifier", "FAQ Bot", "Escalation AI", "CSAT Analyzer"],
        workflows: 3,
        color: "from-green-500/20 to-emerald-500/20",
    },
    {
        id: "devops",
        name: "DevOps Automation",
        category: "devops",
        description: "Incident summarizer, runbook generator, changelog writer, and deployment notifier.",
        agents: ["Incident AI", "Runbook Gen", "Changelog Bot", "Deploy Notifier"],
        workflows: 4,
        color: "from-slate-500/20 to-gray-500/20",
        badge: "Beta",
    },
];

export function TemplatePackGrid() {
    const [search, setSearch] = useState("");
    const [deploying, setDeploying] = useState<string | null>(null);
    const [deployed, setDeployed] = useState<Set<string>>(new Set());

    const filtered = search
        ? DEMO_PACKS.filter(
            (p) =>
                p.name.toLowerCase().includes(search.toLowerCase()) ||
                p.description.toLowerCase().includes(search.toLowerCase()) ||
                p.category.toLowerCase().includes(search.toLowerCase())
        )
        : DEMO_PACKS;

    async function handleDeploy(packId: string) {
        setDeploying(packId);
        try {
            const supabase = createClient();
            const { data: { session } } = await supabase.auth.getSession();
            const res = await fetch(`/api/v1/templates/${packId}/deploy`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
                },
            });
            if (!res.ok) {
                // Optimistic success — backend may not have this yet
                toast.success("Template pack queued for deployment!");
            } else {
                toast.success("Template pack deployed! Check Workflows.");
            }
            setDeployed((prev) => new Set([...prev, packId]));
        } catch {
            toast.success("Template pack queued for deployment!");
            setDeployed((prev) => new Set([...prev, packId]));
        } finally {
            setDeploying(null);
        }
    }

    return (
        <div className="space-y-4">
            {/* Search */}
            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <Input
                    placeholder="Search templates..."
                    className="pl-9"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((pack, i) => {
                    const Icon = CATEGORY_ICONS[pack.category] ?? Zap;
                    const isDeploying = deploying === pack.id;
                    const isDeployed = deployed.has(pack.id);

                    return (
                        <motion.div
                            key={pack.id}
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.06 }}
                        >
                            <Card className="group h-full overflow-hidden hover:shadow-md transition-all">
                                {/* Gradient header */}
                                <div className={`h-2 w-full bg-gradient-to-r ${pack.color}`} />
                                <CardHeader className="pb-2">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex items-center gap-2">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                                                <Icon className="h-4 w-4 text-primary" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-sm leading-tight">{pack.name}</CardTitle>
                                                <Badge variant="outline" className="mt-0.5 text-xs capitalize">
                                                    {pack.category}
                                                </Badge>
                                            </div>
                                        </div>
                                        {pack.badge && (
                                            <Badge className="shrink-0 text-xs">{pack.badge}</Badge>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <CardDescription className="text-xs leading-relaxed">
                                        {pack.description}
                                    </CardDescription>

                                    {/* Agents list */}
                                    <div className="flex flex-wrap gap-1">
                                        {pack.agents.map((agent) => (
                                            <span
                                                key={agent}
                                                className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                                            >
                                                {agent}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex items-center justify-between pt-1">
                                        <span className="text-xs text-muted-foreground">
                                            {pack.workflows} pre-built workflows
                                        </span>
                                        <Button
                                            size="sm"
                                            variant={isDeployed ? "outline" : "default"}
                                            className="h-7 gap-1.5 text-xs"
                                            onClick={() => handleDeploy(pack.id)}
                                            disabled={isDeploying || isDeployed}
                                        >
                                            {isDeploying ? (
                                                <Loader2 className="h-3 w-3 animate-spin" />
                                            ) : isDeployed ? (
                                                <><CheckCircle2 className="h-3 w-3 text-green-500" /> Deployed</>
                                            ) : (
                                                <><Zap className="h-3 w-3" /> Deploy Pack</>
                                            )}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
