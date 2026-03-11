"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Copy, Trash2, MoreHorizontal, Clock, CheckCircle2, XCircle, Loader2, Plus } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useWorkflows } from "@/hooks/use-workflows";
import { createClient } from "@/lib/supabase/client";
import type { Workflow } from "@/types/workflow";

function StatusBadge({ status }: { status?: string }) {
    const map: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
        active: { label: "Active", variant: "default" },
        running: { label: "Running", variant: "secondary" },
        error: { label: "Error", variant: "destructive" },
        draft: { label: "Draft", variant: "outline" },
    };
    const s = map[status ?? "draft"] ?? map.draft;
    return <Badge variant={s.variant}>{s.label}</Badge>;
}

function WorkflowCardSkeleton() {
    return (
        <Card>
            <CardHeader className="pb-3">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-full" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-9 w-24" />
            </CardContent>
        </Card>
    );
}

function WorkflowCard({ workflow }: { workflow: Workflow }) {
    const { mutate } = useWorkflows();
    const [isRunning, setIsRunning] = useState(false);
    const supabase = createClient();

    async function getToken() {
        const { data: { session } } = await supabase.auth.getSession();
        return session?.access_token;
    }

    async function handleRun() {
        setIsRunning(true);
        try {
            const token = await getToken();
            const res = await fetch(`/api/v1/workflows/${workflow.id}/execute`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ input: "", context: {} }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.detail);
            toast.success(`Workflow started — Execution ID: ${data.execution_id.slice(0, 8)}...`);
        } catch (err: any) {
            toast.error(err.message ?? "Failed to start workflow");
        } finally {
            setIsRunning(false);
        }
    }

    async function handleDuplicate() {
        try {
            const token = await getToken();
            const res = await fetch(`/api/v1/workflows/${workflow.id}/duplicate`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Duplication failed");
            toast.success("Workflow duplicated");
            mutate();
        } catch (err: any) {
            toast.error(err.message);
        }
    }

    async function handleDelete() {
        try {
            const token = await getToken();
            const res = await fetch(`/api/v1/workflows/${workflow.id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Delete failed");
            toast.success("Workflow deleted");
            mutate();
        } catch (err: any) {
            toast.error(err.message);
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Card className="group hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                            <Link
                                href={`/workflows/${workflow.id}`}
                                className="font-semibold hover:text-primary truncate block"
                            >
                                {workflow.name}
                            </Link>
                            {workflow.description && (
                                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{workflow.description}</p>
                            )}
                        </div>
                        <StatusBadge />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {workflow.total_executions ?? 0} runs
                            </span>
                            {workflow.last_run_at && (
                                <span>Last run {new Date(workflow.last_run_at).toLocaleDateString()}</span>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <Button size="sm" onClick={handleRun} disabled={isRunning} className="gap-1.5">
                                {isRunning ? (
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                    <Play className="h-3 w-3" />
                                )}
                                Run
                            </Button>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={handleDuplicate} className="gap-2">
                                        <Copy className="h-4 w-4" /> Duplicate
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={handleDelete} className="gap-2 text-destructive focus:text-destructive">
                                        <Trash2 className="h-4 w-4" /> Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}

export function WorkflowList() {
    const { workflows, isLoading, error } = useWorkflows();

    if (isLoading) {
        return (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => <WorkflowCardSkeleton key={i} />)}
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-6 text-center">
                <XCircle className="mx-auto h-8 w-8 text-destructive" />
                <p className="mt-2 text-sm font-medium">Failed to load workflows</p>
                <p className="text-xs text-muted-foreground">{error.message}</p>
            </div>
        );
    }

    if (workflows.length === 0) {
        return (
            <div className="rounded-lg border border-dashed p-12 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    <Play className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="font-semibold">No workflows yet</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                    Create your first workflow from a template or from scratch.
                </p>
                <Button className="mt-4 gap-2" asChild>
                    <Link href="/templates"><Plus className="h-4 w-4" />Browse Templates</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {workflows.map((wf) => (
                <WorkflowCard key={wf.id} workflow={wf} />
            ))}
        </div>
    );
}
