"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Bot, CheckCircle2, AlertCircle, Loader2, 
    Clock, Zap, DollarSign, RefreshCw, Eye 
} from "lucide-react";
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, 
    Tooltip, ResponsiveContainer, Cell 
} from "recharts";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription
} from "@/components/ui/dialog";

interface TraceStep {
    id: string;
    agent: string;
    status: "pending" | "running" | "completed" | "failed";
    duration?: string;
    tokens?: number;
    cost?: number;
    output?: string;
    error?: string;
}

export function ExecutionTraceViewer() {
    const [steps, setSteps] = useState<TraceStep[]>([
        { id: "1", agent: "Market Researcher", status: "completed", duration: "1.2s", tokens: 1200, cost: 0.02, output: "Target audience identified: Tech-savvy professionals aged 25-40 interested in AI productivity tools." },
        { id: "2", agent: "Content Strategist", status: "running", duration: "0s", tokens: 0, cost: 0 },
        { id: "3", agent: "SEO Specialist", status: "pending", tokens: 0, cost: 0 },
        { id: "4", agent: "Social Media Manager", status: "pending", tokens: 0, cost: 0 },
    ]);
    const [showPrompt, setShowPrompt] = useState<string | null>(null);

    // Mock real-time progress simulation
    useEffect(() => {
        const interval = setInterval(() => {
            setSteps(prev => {
                const runningIdx = prev.findIndex(s => s.status === "running");
                if (runningIdx === -1) return prev;

                const next = [...prev];
                const current = next[runningIdx];
                
                // Complete current
                next[runningIdx] = { 
                    ...current, 
                    status: "completed", 
                    duration: "2.4s", 
                    tokens: 2100, 
                    cost: 0.04,
                    output: "Drafted 5 high-converting headlines and content structure."
                };

                // Start next if exists
                if (runningIdx + 1 < next.length) {
                    next[runningIdx + 1] = { ...next[runningIdx + 1], status: "running", duration: "0.5s" };
                }
                
                return next;
            });
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const totalTokens = steps.reduce((acc, s) => acc + (s.tokens || 0), 0);
    const totalCost = steps.reduce((acc, s) => acc + (s.cost || 0), 0);
    const totalDuration = "4.1s";

    const chartData = steps.filter(s => s.tokens && s.tokens > 0).map(s => ({
        name: s.agent.split(" ")[0],
        tokens: s.tokens
    }));

    return (
        <div className="space-y-6">
            {/* Steps Timeline */}
            <div className="space-y-4">
                {steps.map((step, idx) => (
                    <motion.div
                        key={step.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className={`relative flex gap-4 rounded-xl border bg-card p-4 shadow-sm transition-all ${
                            step.status === "running" ? "ring-2 ring-primary/20 bg-primary/5" : ""
                        }`}
                    >
                        {/* Status Icon */}
                        <div className="flex flex-col items-center">
                            <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                                step.status === "completed" ? "bg-green-100 dark:bg-green-900/20 text-green-600" :
                                step.status === "running" ? "bg-primary/10 text-primary" :
                                step.status === "failed" ? "bg-destructive/10 text-destructive" :
                                "bg-muted text-muted-foreground"
                            }`}>
                                {step.status === "completed" && <CheckCircle2 className="h-5 w-5" />}
                                {step.status === "running" && <Loader2 className="h-5 w-5 animate-spin" />}
                                {step.status === "failed" && <AlertCircle className="h-5 w-5" />}
                                {step.status === "pending" && <Clock className="h-4 w-4" />}
                            </div>
                            {idx < steps.length - 1 && (
                                <div className="mt-2 h-full w-0.5 bg-muted" />
                            )}
                        </div>

                        {/* Step Details */}
                        <div className="flex-1 space-y-3">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="text-sm font-semibold">{step.agent}</h3>
                                    <div className="flex items-center gap-3 mt-1 text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {step.duration || "Waiting..."}</span>
                                        <span className="flex items-center gap-1"><Zap className="h-3 w-3" /> {step.tokens || 0} tokens</span>
                                        <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" /> ${step.cost?.toFixed(3) || "0.000"}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="sm" className="h-7 text-[10px]" onClick={() => setShowPrompt(step.agent)}>
                                        <Eye className="h-3 w-3 mr-1" /> Prompt
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-7 text-[10px]" disabled={step.status !== "completed"}>
                                        <RefreshCw className="h-3 w-3 mr-1" /> Rerun
                                    </Button>
                                    <Badge variant={step.status === "completed" ? "default" : "secondary"} className="h-5 text-[10px] tracking-tight">
                                        {step.status}
                                    </Badge>
                                </div>
                            </div>

                            {step.status === "running" && (
                                <Progress value={45} className="h-1 animate-pulse" />
                            )}

                            {step.status === "completed" && (
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="rounded-lg bg-muted/30 p-3 text-xs leading-relaxed text-muted-foreground border border-border/50"
                                >
                                    {step.output}
                                </motion.div>
                            )}

                            {step.status === "failed" && (
                                <div className="rounded-lg bg-destructive/10 p-3 text-xs text-destructive border border-destructive/20 flex items-center gap-2">
                                    <AlertCircle className="h-4 w-4" />
                                    {step.error || "Execution timeout or API error."}
                                </div>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Summary & Charts */}
            <div className="grid gap-4 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Token Distribution</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[200px] pt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                                <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} />
                                <YAxis fontSize={10} axisLine={false} tickLine={false} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: "8px", border: "1px solid hsl(var(--border))", fontSize: "11px" }}
                                />
                                <Bar dataKey="tokens" radius={[4, 4, 0, 0]}>
                                    {chartData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={`hsl(var(--primary) / ${1 - index * 0.2})`} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Run Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-4">
                        <div className="flex justify-between items-center border-b pb-2">
                            <span className="text-xs text-muted-foreground">Total Tokens</span>
                            <span className="text-sm font-bold">{totalTokens.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center border-b pb-2">
                            <span className="text-xs text-muted-foreground">Estimated Cost</span>
                            <span className="text-sm font-bold text-green-600">${totalCost.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-muted-foreground">Total Duration</span>
                            <span className="text-sm font-bold">{totalDuration}</span>
                        </div>
                        <Button className="w-full mt-2 gap-2" size="sm">
                            <RefreshCw className="h-3 w-3" /> Rerun Entire Workflow
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Prompt Dialog */}
            <Dialog open={!!showPrompt} onOpenChange={() => setShowPrompt(null)}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Agent Prompt — {showPrompt}</DialogTitle>
                        <DialogDescription>Exact instruction set sent to the model for this step.</DialogDescription>
                    </DialogHeader>
                    <div className="mt-4 rounded-xl bg-muted p-4 font-mono text-xs leading-relaxed overflow-y-auto max-h-[400px]">
                        {`{
  "system": "You are a professional ${showPrompt}. Your task is to process the input based on previous context...",
  "context": "Previous output: [IDENTIFIED_AUDIENCE_DATA]",
  "instruction": "Draft a comprehensive strategy involving...",
  "output_format": "JSON with fields: title, structure, keywords"
}`}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
