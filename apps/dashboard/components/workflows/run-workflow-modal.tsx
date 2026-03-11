"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
    Play, Clock, DollarSign, 
    FileText, MessageSquare, AlertCircle,
    Loader2, ArrowRight
} from "lucide-react";
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from "@/components/shared/file-upload";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface RunWorkflowModalProps {
    workflow: {
        id: string;
        name: string;
        description: string;
    } | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    hasApiKey?: boolean;
}

export function RunWorkflowModal({ workflow, open, onOpenChange, hasApiKey = true }: RunWorkflowModalProps) {
    const router = useRouter();
    const [isStarting, setIsStarting] = useState(false);
    const [input, setInput] = useState("");

    const handleStart = () => {
        if (!hasApiKey) {
            toast.error("Add an API key to run workflows", {
                description: "You can add your keys in Settings -> API Keys",
                action: {
                    label: "Settings",
                    onClick: () => router.push("/settings/keys")
                }
            });
            return;
        }

        if (input.length < 5) {
            toast.error("Please provide more detailed input instructions.");
            return;
        }

        setIsStarting(true);
        setTimeout(() => {
            setIsStarting(false);
            onOpenChange(false);
            toast.success("Workflow execution started!");
            router.push(`/executions/mock-${workflow?.id || "run"}`);
        }, 1200);
    };

    if (!workflow) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-primary border-primary/20">WORKFLOW RUN</Badge>
                        <span className="text-xs text-muted-foreground font-mono">ID: {workflow.id.slice(0, 8)}</span>
                    </div>
                    <DialogTitle className="text-xl">{workflow.name}</DialogTitle>
                    <DialogDescription>{workflow.description}</DialogDescription>
                </DialogHeader>

                <div className="space-y-6 pt-4">
                    <div className="space-y-3">
                        <Label htmlFor="workflow-input" className="text-sm font-semibold flex items-center gap-2">
                            <MessageSquare className="h-4 w-4" />
                            Workflow Input
                        </Label>
                        <Textarea
                            id="workflow-input"
                            placeholder="Describe the task or project the agents should focus on today..."
                            className="h-32 resize-none text-sm"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <p className="text-[10px] text-muted-foreground">Detailed inputs lead to higher quality agent reasoning.</p>
                    </div>

                    <div className="space-y-3">
                        <Label className="text-sm font-semibold flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Reference Files (Optional)
                        </Label>
                        <FileUpload maxFiles={3} />
                    </div>

                    <div className="flex items-center justify-between rounded-xl border bg-muted/30 p-4">
                        <div className="space-y-1">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Estimates</span>
                            <div className="flex items-center gap-4 text-xs font-semibold">
                                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-primary" /> ~8-12m</span>
                                <span className="flex items-center gap-1"><DollarSign className="h-3.5 w-3.5 text-green-600" /> ~$0.20 - $0.45</span>
                            </div>
                        </div>
                        <AlertCircle className="h-4 w-4 text-muted-foreground opacity-30" />
                    </div>
                </div>

                <DialogFooter className="mt-4">
                    <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleStart} disabled={isStarting} className="gap-2 px-8 min-w-[140px]">
                        {isStarting ? (
                            <><Loader2 className="h-4 w-4 animate-spin" /> Starting...</>
                        ) : (
                            <><Play className="h-4 w-4 fill-current" /> Start Workflow</>
                        )}
                    </Button>
                </DialogFooter>

                {!hasApiKey && (
                    <div className="mt-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 p-3 border border-amber-200 dark:border-amber-900/50">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
                            <div className="space-y-1">
                                <p className="text-xs font-semibold text-amber-800 dark:text-amber-400">API Key Missing</p>
                                <p className="text-[10px] text-amber-700 dark:text-amber-500 leading-relaxed">
                                    You can browse workflows, but you need a key to run them.
                                </p>
                                <Button 
                                    variant="link" 
                                    size="sm" 
                                    className="h-auto p-0 text-[10px] text-amber-800 dark:text-amber-400 font-bold hover:no-underline"
                                    onClick={() => router.push("/settings/keys")}
                                >
                                    Add Key Now <ArrowRight className="h-2 w-2 ml-1" />
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
