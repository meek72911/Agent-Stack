"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    GitBranch, MessageCircle, Trophy, Heart, Share2,
    ChevronUp, DollarSign, Clock, Plus, Loader2, ExternalLink
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Demo data — in production these come from /api/v1/community
const COMMUNITY_WORKFLOWS = [
    {
        id: "1",
        title: "Daily Competitor Intelligence Report",
        description: "Scrapes 10 competitor sites, summarizes changes, and emails a digest. Runs every morning.",
        author: { name: "Sarah Chen", avatar: "", initials: "SC" },
        category: "research",
        upvotes: 247,
        forks: 89,
        views: 1840,
        upvoted: false,
    },
    {
        id: "2",
        title: "LinkedIn Content Pipeline",
        description: "Turns your blog posts into 5 LinkedIn posts with hooks, carousels, and CTAs.",
        author: { name: "Mike Torres", avatar: "", initials: "MT" },
        category: "marketing",
        upvotes: 183,
        forks: 62,
        views: 1220,
        upvoted: true,
    },
    {
        id: "3",
        title: "GitLab PR Auto-Reviewer",
        description: "Reviews PRs for code quality, security issues, and suggests improvements inline.",
        author: { name: "Dev Prasad", avatar: "", initials: "DP" },
        category: "engineering",
        upvotes: 156,
        forks: 41,
        views: 980,
        upvoted: false,
    },
    {
        id: "4",
        title: "Customer Churn Early Warning",
        description: "Analyzes usage patterns and flags at-risk accounts 30 days before likely churn.",
        author: { name: "Amy Ko", avatar: "", initials: "AK" },
        category: "sales",
        upvotes: 134,
        forks: 38,
        views: 870,
        upvoted: false,
    },
];

const BOUNTIES = [
    {
        id: "b1",
        title: "Shopify order fulfillment automation",
        description: "Build a workflow that auto-processes Shopify orders: fulfillment update, customer email, inventory check.",
        reward: 250,
        deadline: "2026-03-25",
        tags: ["ecommerce", "shopify", "automation"],
        status: "open",
    },
    {
        id: "b2",
        title: "Multi-language customer support agent",
        description: "Support agent that auto-detects language and responds in the customer's language using DeepL + Claude.",
        reward: 500,
        deadline: "2026-03-30",
        tags: ["support", "translation", "internationalization"],
        status: "open",
    },
    {
        id: "b3",
        title: "Slack standup summarizer",
        description: "Read Slack standup channel, group by team, and generate a weekly executive summary.",
        reward: 150,
        deadline: "2026-03-20",
        tags: ["slack", "reporting", "productivity"],
        status: "in_progress",
    },
];

export function CommunityFeed() {
    const [workflows, setWorkflows] = useState(COMMUNITY_WORKFLOWS);

    function handleUpvote(id: string) {
        setWorkflows((prev) =>
            prev.map((w) =>
                w.id === id
                    ? { ...w, upvoted: !w.upvoted, upvotes: w.upvoted ? w.upvotes - 1 : w.upvotes + 1 }
                    : w
            )
        );
    }

    async function handleFork(id: string) {
        toast.success("Workflow forked to your library!");
    }

    return (
        <div className="space-y-3">
            <h2 className="text-lg font-semibold">Community Workflows</h2>
            {workflows.map((wf, i) => (
                <motion.div
                    key={wf.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                >
                    <Card className="hover:shadow-sm transition-shadow">
                        <CardContent className="flex gap-4 py-4">
                            {/* Upvote */}
                            <div className="flex flex-col items-center gap-1">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className={`h-8 w-8 ${wf.upvoted ? "text-primary" : ""}`}
                                    onClick={() => handleUpvote(wf.id)}
                                >
                                    <ChevronUp className="h-5 w-5" />
                                </Button>
                                <span className="text-xs font-medium tabular-nums">{wf.upvotes}</span>
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <p className="font-semibold text-sm">{wf.title}</p>
                                        <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{wf.description}</p>
                                    </div>
                                    <Badge variant="outline" className="shrink-0 text-xs capitalize">
                                        {wf.category}
                                    </Badge>
                                </div>
                                <div className="mt-3 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-5 w-5">
                                            <AvatarFallback className="text-[9px]">{wf.author.initials}</AvatarFallback>
                                        </Avatar>
                                        <span className="text-xs text-muted-foreground">{wf.author.name}</span>
                                        <span className="text-xs text-muted-foreground">·</span>
                                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <GitBranch className="h-3 w-3" /> {wf.forks} forks
                                        </span>
                                    </div>
                                    <Button size="sm" variant="outline" className="h-7 gap-1.5 text-xs" onClick={() => handleFork(wf.id)}>
                                        <GitBranch className="h-3 w-3" /> Fork
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </div>
    );
}

export function BountyBoard() {
    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Open Bounties</h2>
                <Badge variant="outline" className="gap-1">
                    <DollarSign className="h-3 w-3" /> Earn by contributing
                </Badge>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {BOUNTIES.map((bounty, i) => (
                    <motion.div
                        key={bounty.id}
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.08 }}
                    >
                        <Card className="h-full hover:shadow-md transition-shadow">
                            <CardHeader className="pb-2">
                                <div className="flex items-start justify-between gap-2">
                                    <CardTitle className="text-sm leading-tight">{bounty.title}</CardTitle>
                                    <Badge
                                        variant={bounty.status === "open" ? "default" : "secondary"}
                                        className="shrink-0 text-xs"
                                    >
                                        {bounty.status === "in_progress" ? "In Progress" : "Open"}
                                    </Badge>
                                </div>
                                <CardDescription className="text-xs">{bounty.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex flex-wrap gap-1">
                                    {bounty.tags.map((tag) => (
                                        <span key={tag} className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-lg font-bold text-primary">${bounty.reward}</p>
                                        <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            Due {new Date(bounty.deadline).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <Button
                                        size="sm"
                                        disabled={bounty.status !== "open"}
                                        onClick={() => toast.success("Claim submitted! The team will be in touch.")}
                                        className="h-7 text-xs"
                                    >
                                        Claim
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
