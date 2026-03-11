"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    Plus, Building2, Users, GitBranch, Key, ExternalLink,
    MoreHorizontal, Loader2, Zap
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    Dialog, DialogContent, DialogDescription, DialogFooter,
    DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
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

interface ClientWorkspace {
    id: string;
    name: string;
    slug: string;
    agents_count: number;
    workflows_count: number;
    created_at: string;
    status: "active" | "inactive";
}

function WorkspaceCardSkeleton() {
    return (
        <Card>
            <CardHeader><Skeleton className="h-5 w-1/2" /></CardHeader>
            <CardContent><Skeleton className="h-4 w-full mb-2" /><Skeleton className="h-8 w-24" /></CardContent>
        </Card>
    );
}

export function ClientWorkspaceGrid() {
    const { data, mutate, isLoading } = useSWR<{ workspaces: ClientWorkspace[] }>(
        "/workspaces",
        fetcher
    );
    const workspaces = data?.workspaces ?? [];

    const [isCreating, setIsCreating] = useState(false);
    const [newName, setNewName] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [saving, setSaving] = useState(false);

    async function handleCreate() {
        if (!newName.trim()) return;
        setSaving(true);
        try {
            const supabase = createClient();
            const { data: { session } } = await supabase.auth.getSession();
            const res = await fetch("/api/v1/workspaces", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${session?.access_token}` },
                body: JSON.stringify({ name: newName.trim() }),
            });
            const d = await res.json();
            if (!res.ok) throw new Error(d.detail ?? "Failed");
            toast.success(`Client workspace "${newName}" created`);
            setNewName("");
            setDialogOpen(false);
            mutate();
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="space-y-4">
            {/* Header controls */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{workspaces.length} client workspace{workspaces.length !== 1 ? "s" : ""}</p>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button size="sm" className="gap-2">
                            <Plus className="h-4 w-4" /> New Client Workspace
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create Client Workspace</DialogTitle>
                            <DialogDescription>
                                Each client gets their own isolated environment with separate agents, workflows, and API keys.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-2 py-2">
                            <Label htmlFor="ws-name">Client / Company Name</Label>
                            <Input
                                id="ws-name"
                                placeholder="e.g. Acme Corp"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                            />
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                            <Button onClick={handleCreate} disabled={!newName.trim() || saving} className="gap-2">
                                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                                Create
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Grid */}
            {isLoading ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 3 }).map((_, i) => <WorkspaceCardSkeleton key={i} />)}
                </div>
            ) : workspaces.length === 0 ? (
                <div className="rounded-lg border border-dashed p-12 text-center">
                    <Building2 className="mx-auto h-10 w-10 text-muted-foreground/50" />
                    <h3 className="mt-4 font-semibold">No client workspaces yet</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Create isolated environments for each of your clients.
                    </p>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {workspaces.map((ws, i) => (
                        <motion.div
                            key={ws.id}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.06 }}
                        >
                            <Card className="h-full hover:shadow-md transition-shadow">
                                <CardHeader className="pb-2">
                                    <div className="flex items-start justify-between">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                                            <Building2 className="h-5 w-5 text-primary" />
                                        </div>
                                        <Badge variant={ws.status === "active" ? "default" : "outline"} className="text-xs">
                                            {ws.status}
                                        </Badge>
                                    </div>
                                    <CardTitle className="mt-2 text-sm">{ws.name}</CardTitle>
                                    <CardDescription className="text-xs font-mono">{ws.slug}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <Zap className="h-3 w-3" /> {ws.agents_count ?? 0} agents
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <GitBranch className="h-3 w-3" /> {ws.workflows_count ?? 0} workflows
                                        </span>
                                    </div>
                                    <Button size="sm" variant="outline" className="w-full gap-1.5" asChild>
                                        <Link href={`/clients/${ws.id}`}>
                                            <ExternalLink className="h-3.5 w-3.5" /> Open Workspace
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
