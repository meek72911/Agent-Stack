"use client";

import { motion } from "framer-motion";
import { 
    Play, Clock, MoreHorizontal, FileText, 
    CheckCircle2, AlertCircle, Loader2 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface Workflow {
    id: string;
    name: string;
    description: string;
    status: "active" | "draft" | "paused";
    lastRun: string;
    executionCount: number;
    successRate: number;
}

const DEMO_WORKFLOWS: Workflow[] = [
    {
        id: "1",
        name: "Weekly Content Engine",
        description: "Scrapes news, generates 3 blog posts, and drafts social media threads.",
        status: "active",
        lastRun: "2 hours ago",
        executionCount: 145,
        successRate: 98.5
    },
    {
        id: "2",
        name: "Security Vulnerability Scan",
        description: "Scans new PRs for secrets and common OWASP vulnerabilities.",
        status: "active",
        lastRun: "15 mins ago",
        executionCount: 890,
        successRate: 100
    },
    {
        id: "3",
        name: "Customer Feedback Analyst",
        description: "Monitors Discord and Reddit to categorize sentiment and surface bugs.",
        status: "paused",
        lastRun: "3 days ago",
        executionCount: 42,
        successRate: 92.1
    }
];

import { useState } from "react";
import { RunWorkflowModal } from "@/components/workflows/run-workflow-modal";

export function SavedWorkflows() {
    const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);

    return (
        <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {DEMO_WORKFLOWS.map((wf, i) => (
                    <motion.div
                        key={wf.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <Card className="group relative overflow-hidden transition-all hover:shadow-lg dark:hover:shadow-primary/5">
                            <CardHeader className="pb-2">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <CardTitle className="text-sm font-bold tracking-tight">
                                                {wf.name}
                                            </CardTitle>
                                            <Badge 
                                                variant={wf.status === "active" ? "default" : "secondary"}
                                                className="h-4 px-1 text-[10px] uppercase font-bold"
                                            >
                                                {wf.status}
                                            </Badge>
                                        </div>
                                        <CardDescription className="line-clamp-2 text-xs leading-relaxed">
                                            {wf.description}
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pb-3 text-xs">
                                <div className="flex items-center justify-between text-muted-foreground">
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="h-3 w-3" />
                                        <span>{wf.lastRun}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <FileText className="h-3 w-3" />
                                        <span>{wf.executionCount} runs</span>
                                    </div>
                                </div>
                                <div className="mt-3 space-y-1">
                                    <div className="flex items-center justify-between text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70">
                                        <span>Success Rate</span>
                                        <span>{wf.successRate}%</span>
                                    </div>
                                    <div className="h-1 w-full rounded-full bg-muted">
                                        <motion.div 
                                            className="h-full rounded-full bg-primary"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${wf.successRate}%` }}
                                            transition={{ duration: 1, delay: i * 0.2 }}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="pt-0">
                                <div className="flex w-full items-center gap-2">
                                    <Button 
                                        size="sm" 
                                        className="h-8 flex-1 gap-1.5 text-xs font-semibold shadow-sm"
                                        onClick={() => setSelectedWorkflow(wf)}
                                    >
                                        <Play className="h-3 w-3 fill-current" />
                                        Run Now
                                    </Button>
                                    <Button variant="outline" size="icon" className="h-8 w-8 shrink-0 hover:bg-muted">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardFooter>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <RunWorkflowModal 
                workflow={selectedWorkflow} 
                open={!!selectedWorkflow} 
                onOpenChange={(open) => !open && setSelectedWorkflow(null)}
                hasApiKey={false} // Mock: toggle to false to test lazy API key banner
            />
        </div>
    );
}
