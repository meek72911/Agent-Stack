"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    Plus, Trash2, GripVertical, ChevronDown, ChevronUp,
    Bot, Loader2, Save, ArrowLeft
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";

interface Step {
    id: string;
    name: string;
    agentType: string;
    prompt: string;
    inputFrom: string; // "user_input" | stepId
}

const AGENT_TYPES = [
    { value: "llm", label: "LLM Agent (GPT / Claude / Gemini)" },
    { value: "researcher", label: "Web Researcher" },
    { value: "coder", label: "Code Generator" },
    { value: "summarizer", label: "Summarizer" },
    { value: "classifier", label: "Classifier" },
    { value: "writer", label: "Content Writer" },
    { value: "analyst", label: "Data Analyst" },
];

const EXECUTION_MODES = [
    { value: "sequential", label: "Sequential — steps run one after another" },
    { value: "parallel", label: "Parallel — all steps run at once" },
    { value: "pipeline", label: "Pipeline — each step feeds the next" },
];

function newStep(): Step {
    return { id: crypto.randomUUID(), name: "", agentType: "llm", prompt: "", inputFrom: "user_input" };
}

export function WorkflowBuilder() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [executionMode, setExecutionMode] = useState("sequential");
    const [steps, setSteps] = useState<Step[]>([newStep()]);
    const [isSaving, setIsSaving] = useState(false);
    const [expandedStep, setExpandedStep] = useState<string | null>(steps[0]?.id ?? null);

    function addStep() {
        const s = newStep();
        setSteps((prev) => [...prev, s]);
        setExpandedStep(s.id);
    }

    function removeStep(id: string) {
        setSteps((prev) => prev.filter((s) => s.id !== id));
    }

    function updateStep(id: string, patch: Partial<Step>) {
        setSteps((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
    }

    function moveStep(id: string, dir: -1 | 1) {
        const idx = steps.findIndex((s) => s.id === id);
        if (idx + dir < 0 || idx + dir >= steps.length) return;
        const next = [...steps];
        [next[idx], next[idx + dir]] = [next[idx + dir], next[idx]];
        setSteps(next);
    }

    async function handleSave() {
        if (!name.trim()) { toast.error("Workflow name is required"); return; }
        if (steps.some((s) => !s.agentType)) { toast.error("All steps need an agent type"); return; }

        setIsSaving(true);
        try {
            const supabase = createClient();
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;

            const payload = {
                name: name.trim(),
                description: description.trim(),
                execution_mode: executionMode,
                steps: steps.map((s, i) => ({
                    name: s.name || `Step ${i + 1}`,
                    agent_type: s.agentType,
                    prompt_template: s.prompt,
                    order: i,
                    input_source: s.inputFrom,
                })),
            };

            const res = await fetch("/api/v1/workflows", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.detail ?? "Failed to save");

            toast.success("Workflow created!");
            router.push(`/workflows/${data.id}`);
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <div className="mx-auto max-w-3xl space-y-6">
            {/* Workflow meta */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Workflow Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="wf-name">Name *</Label>
                        <Input
                            id="wf-name"
                            placeholder="e.g. Weekly SEO Report"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="wf-desc">Description</Label>
                        <Textarea
                            id="wf-desc"
                            placeholder="What does this workflow do?"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={2}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Execution Mode</Label>
                        <Select value={executionMode} onValueChange={setExecutionMode}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {EXECUTION_MODES.map((m) => (
                                    <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Steps */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold">Steps <span className="ml-1 text-sm text-muted-foreground">({steps.length})</span></h2>
                    <Button size="sm" variant="outline" onClick={addStep} className="gap-1.5">
                        <Plus className="h-3.5 w-3.5" /> Add Step
                    </Button>
                </div>

                {steps.map((step, idx) => (
                    <motion.div
                        key={step.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Card>
                            <CardHeader
                                className="cursor-pointer select-none py-3"
                                onClick={() => setExpandedStep(expandedStep === step.id ? null : step.id)}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                                        {idx + 1}
                                    </div>
                                    <span className="flex-1 text-sm font-medium">
                                        {step.name || `Step ${idx + 1}`}
                                        {step.agentType && (
                                            <span className="ml-2 font-normal text-muted-foreground">
                                                — {AGENT_TYPES.find((a) => a.value === step.agentType)?.label.split(" ")[0]}
                                            </span>
                                        )}
                                    </span>
                                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => moveStep(step.id, -1)} disabled={idx === 0}>
                                            <ChevronUp className="h-3.5 w-3.5" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => moveStep(step.id, 1)} disabled={idx === steps.length - 1}>
                                            <ChevronDown className="h-3.5 w-3.5" />
                                        </Button>
                                        <Button
                                            variant="ghost" size="icon"
                                            className="h-7 w-7 text-destructive hover:text-destructive"
                                            onClick={() => removeStep(step.id)}
                                            disabled={steps.length === 1}
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                    {expandedStep === step.id ? (
                                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                                    ) : (
                                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                    )}
                                </div>
                            </CardHeader>

                            {expandedStep === step.id && (
                                <CardContent className="border-t pt-4 space-y-3">
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <div className="space-y-1.5">
                                            <Label>Step Name</Label>
                                            <Input
                                                placeholder={`Step ${idx + 1}`}
                                                value={step.name}
                                                onChange={(e) => updateStep(step.id, { name: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label>Agent Type</Label>
                                            <Select value={step.agentType} onValueChange={(v) => updateStep(step.id, { agentType: v })}>
                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    {AGENT_TYPES.map((a) => (
                                                        <SelectItem key={a.value} value={a.value}>{a.label}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label>Prompt / Instructions</Label>
                                        <Textarea
                                            placeholder="Instructions for this agent step. Use {{input}} to reference the previous step's output."
                                            value={step.prompt}
                                            onChange={(e) => updateStep(step.id, { prompt: e.target.value })}
                                            rows={3}
                                            className="font-mono text-sm"
                                        />
                                    </div>
                                    {idx > 0 && (
                                        <div className="space-y-1.5">
                                            <Label>Input Source</Label>
                                            <Select value={step.inputFrom} onValueChange={(v) => updateStep(step.id, { inputFrom: v })}>
                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="user_input">Original user input</SelectItem>
                                                    {steps.slice(0, idx).map((s, si) => (
                                                        <SelectItem key={s.id} value={s.id}>
                                                            Output of Step {si + 1}: {s.name || `Step ${si + 1}`}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}
                                </CardContent>
                            )}
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Save */}
            <div className="flex items-center justify-between rounded-lg border bg-muted/30 p-4">
                <p className="text-sm text-muted-foreground">
                    {steps.length} step{steps.length !== 1 ? "s" : ""} · {executionMode} execution
                </p>
                <Button onClick={handleSave} disabled={isSaving || !name.trim()} className="gap-2">
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    {isSaving ? "Creating..." : "Create Workflow"}
                </Button>
            </div>
        </div>
    );
}
