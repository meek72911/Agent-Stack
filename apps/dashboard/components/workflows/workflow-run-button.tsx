"use client";

import { useState } from "react";
import { Play, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

interface Props {
    workflowId: string;
}

export function WorkflowRunButton({ workflowId }: Props) {
    const [isRunning, setIsRunning] = useState(false);

    async function handleRun() {
        setIsRunning(true);
        try {
            const supabase = createClient();
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;

            const res = await fetch(`/api/v1/workflows/${workflowId}/execute`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ input: "", context: {} }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.detail ?? "Execution failed");
            toast.success(`Workflow started — Execution: ${data.execution_id?.slice(0, 8)}...`);
        } catch (err: any) {
            toast.error(err.message ?? "Failed to run workflow");
        } finally {
            setIsRunning(false);
        }
    }

    return (
        <Button onClick={handleRun} disabled={isRunning} className="gap-2">
            {isRunning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
            {isRunning ? "Running..." : "Run Workflow"}
        </Button>
    );
}
