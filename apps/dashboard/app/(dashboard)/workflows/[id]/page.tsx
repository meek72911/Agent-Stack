import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Play, Settings2, Clock, CheckCircle2, XCircle } from "lucide-react";
import { createServerClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { WorkflowRunButton } from "@/components/workflows/workflow-run-button";

interface Props {
    params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    return { title: `Workflow ${params.id.slice(0, 8)}... - AgentStack` };
}

export default async function WorkflowDetailPage({ params }: Props) {
    const supabase = createServerClient();
    const { data, error } = await supabase
        .from("workflows")
        .select("*, workflow_steps(*)")
        .eq("id", params.id)
        .single();

    if (error || !data) {
        notFound();
    }

    const workflow = data;
    const steps = workflow.workflow_steps ?? [];

    return (
        <div className="space-y-6">
            {/* Back button + header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/workflows"><ArrowLeft className="h-4 w-4" /></Link>
                </Button>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold">{workflow.name}</h1>
                    {workflow.description && (
                        <p className="text-muted-foreground text-sm">{workflow.description}</p>
                    )}
                </div>
                <WorkflowRunButton workflowId={params.id} />
            </div>

            {/* Info cards */}
            <div className="grid gap-4 sm:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-muted-foreground">Total Runs</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{workflow.total_executions ?? 0}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-muted-foreground">Steps</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{steps.length}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-muted-foreground">Last Run</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm font-medium">
                            {workflow.last_run_at
                                ? new Date(workflow.last_run_at).toLocaleString()
                                : "Never"}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Workflow steps visualization */}
            <Card>
                <CardHeader>
                    <CardTitle>Workflow Steps</CardTitle>
                    <CardDescription>Each step is executed in order by your AI agents</CardDescription>
                </CardHeader>
                <CardContent>
                    {steps.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No steps configured yet.</p>
                    ) : (
                        <div className="space-y-3">
                            {steps.map((step: any, i: number) => (
                                <div key={step.id} className="flex items-center gap-3">
                                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                                        {i + 1}
                                    </div>
                                    <div className="flex-1 rounded-lg border p-3">
                                        <p className="text-sm font-medium">{step.name ?? `Step ${i + 1}`}</p>
                                        {step.agent_id && (
                                            <p className="text-xs text-muted-foreground">Agent: {step.agent_id}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
