"use client";

import { motion } from "framer-motion";
import {
    ArrowLeft, Bot, GitBranch, Key, Activity, Settings,
    Loader2, ExternalLink
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

interface Props {
    workspaceId: string;
}

export function ClientWorkspaceDetail({ workspaceId }: Props) {
    const { data: ws, isLoading } = useSWR<{
        id: string;
        name: string;
        slug: string;
        status: string;
        agents_count: number;
        workflows_count: number;
        executions_this_month: number;
        created_at: string;
    }>(`/workspaces/${workspaceId}`, fetcher);

    const { data: agentsData } = useSWR<{ agents: any[] }>(
        `/workspaces/${workspaceId}/agents`,
        fetcher
    );
    const { data: workflowsData } = useSWR<{ workflows: any[] }>(
        `/workspaces/${workspaceId}/workflows`,
        fetcher
    );

    if (isLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-8 w-48" />
                <div className="grid gap-4 sm:grid-cols-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <Card key={i}><CardHeader><Skeleton className="h-4 w-1/2" /></CardHeader><CardContent><Skeleton className="h-7 w-16" /></CardContent></Card>
                    ))}
                </div>
            </div>
        );
    }

    if (!ws) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">Workspace not found.</p>
                <Button asChild variant="outline" className="mt-4">
                    <Link href="/clients"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Clients</Link>
                </Button>
            </div>
        );
    }

    const agents = agentsData?.agents ?? [];
    const workflows = workflowsData?.workflows ?? [];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/clients"><ArrowLeft className="h-4 w-4" /></Link>
                </Button>
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-bold">{ws.name}</h1>
                        <Badge variant={ws.status === "active" ? "default" : "outline"} className="text-xs capitalize">
                            {ws.status}
                        </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground font-mono">{ws.slug}</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-3">
                {[
                    { label: "Active Agents", value: ws.agents_count ?? 0, icon: Bot },
                    { label: "Workflows", value: ws.workflows_count ?? 0, icon: GitBranch },
                    { label: "Runs This Month", value: ws.executions_this_month ?? 0, icon: Activity },
                ].map(({ label, value, icon: Icon }) => (
                    <Card key={label}>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm text-muted-foreground">{label}</CardTitle>
                            <Icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">{value}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Tabs */}
            <Tabs defaultValue="agents">
                <TabsList>
                    <TabsTrigger value="agents" className="gap-1.5">
                        <Bot className="h-3.5 w-3.5" /> Agents
                    </TabsTrigger>
                    <TabsTrigger value="workflows" className="gap-1.5">
                        <GitBranch className="h-3.5 w-3.5" /> Workflows
                    </TabsTrigger>
                    <TabsTrigger value="keys" className="gap-1.5">
                        <Key className="h-3.5 w-3.5" /> API Keys
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="agents" className="mt-4">
                    {agents.length === 0 ? (
                        <p className="text-sm text-muted-foreground py-4">No agents activated for this workspace.</p>
                    ) : (
                        <div className="grid gap-3 sm:grid-cols-2">
                            {agents.map((a: any) => (
                                <Card key={a.id}>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm">{a.name}</CardTitle>
                                        <CardDescription className="text-xs">{a.role}</CardDescription>
                                    </CardHeader>
                                </Card>
                            ))}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="workflows" className="mt-4">
                    {workflows.length === 0 ? (
                        <p className="text-sm text-muted-foreground py-4">No workflows in this workspace yet.</p>
                    ) : (
                        <div className="space-y-2">
                            {workflows.map((wf: any) => (
                                <div key={wf.id} className="flex items-center justify-between rounded-lg border p-3">
                                    <div>
                                        <p className="text-sm font-medium">{wf.name}</p>
                                        <p className="text-xs text-muted-foreground">{wf.total_executions ?? 0} runs</p>
                                    </div>
                                    <Button size="sm" variant="outline" asChild>
                                        <Link href={`/workflows/${wf.id}`}><ExternalLink className="h-3.5 w-3.5" /></Link>
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="keys" className="mt-4">
                    <p className="text-sm text-muted-foreground py-4">
                        API keys for this client workspace are managed separately for isolation.
                        <br />
                        <Button variant="link" className="h-auto p-0 mt-1 text-primary" asChild>
                            <Link href="/settings/api-keys">Manage global keys →</Link>
                        </Button>
                    </p>
                </TabsContent>
            </Tabs>
        </div>
    );
}
