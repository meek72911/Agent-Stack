"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ChevronRight, Rocket, CheckCircle2, Layers } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

const STEP_COUNT = 2;

async function apiPost(path: string, body: unknown, token?: string) {
    const res = await fetch(`/api/v1${path}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
    });
    return res;
}

export function OnboardingWizard() {
    const router = useRouter();
    const supabase = createClient();

    const [step, setStep] = useState(1);
    const [workspaceName, setWorkspaceName] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    async function handleFinish() {
        setIsLoading(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;
            const userId = session?.user?.id;

            if (!token || !userId) {
                toast.error("Session expired — please log in again.");
                router.push("/login");
                return;
            }

            const slug = workspaceName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
            
            // 1. Create Workspace
            try {
                await apiPost("/onboarding/organization", { name: workspaceName, slug }, token);
            } catch {
                await supabase.from("organizations").upsert({ name: workspaceName, slug }, { onConflict: "id" });
            }

            // 2. Mark onboarding complete
            try {
                await apiPost("/onboarding/complete", {}, token);
            } catch {
                await supabase.from("profiles").update({ onboarding_completed: true }).eq("id", userId);
            }

            await supabase.auth.updateUser({ data: { onboarded: true } });

            toast.success("Welcome aboard! Let's build.");
            router.push("/dashboard");
        } catch (err: any) {
            toast.error(err.message ?? "Setup failed — please try again");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="space-y-8">
            <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary">
                    <Layers className="h-7 w-7 text-primary-foreground" />
                </div>
                <h1 className="text-2xl font-bold">Welcome to AgentStack</h1>
                <p className="mt-1 text-sm text-muted-foreground">Your AI product team in 60 seconds</p>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                >
                    {step === 1 && (
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="workspace-name" className="text-base font-semibold">What is your workspace name?</Label>
                                <p className="text-sm text-muted-foreground pb-2">
                                    You can change this later in settings.
                                </p>
                                <Input
                                    id="workspace-name"
                                    placeholder="e.g. Acme Ops, Design Squad"
                                    className="h-12 text-lg px-4"
                                    value={workspaceName}
                                    onChange={(e) => setWorkspaceName(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && workspaceName.trim() && setStep(2)}
                                    autoFocus
                                />
                            </div>
                            <Button
                                className="w-full h-12 text-base font-semibold"
                                onClick={() => setStep(2)}
                                disabled={!workspaceName.trim()}
                            >
                                Continue
                                <ChevronRight className="ml-2 h-5 w-5" />
                            </Button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6">
                            <div className="rounded-xl border bg-card p-6 space-y-4">
                                <h2 className="text-lg font-bold">You&apos;re all set!</h2>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30">
                                            <CheckCircle2 className="h-3 w-3" />
                                        </div>
                                        <span>Workspace <strong>{workspaceName}</strong> created</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30">
                                            <CheckCircle2 className="h-3 w-3" />
                                        </div>
                                        <span>82 high-performance agents ready</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30">
                                            <Rocket className="h-3 w-3" />
                                        </div>
                                        <span>Ready to deploy first template</span>
                                    </div>
                                </div>
                                <div className="mt-6 space-y-2 border-t pt-4">
                                    <p className="text-xs text-muted-foreground text-center">
                                        → Add your API key later in Settings
                                    </p>
                                    <p className="text-xs text-muted-foreground text-center">
                                        → Explore templates freely
                                    </p>
                                </div>
                            </div>
                            <Button 
                                className="w-full h-12 text-base font-semibold gap-2" 
                                onClick={handleFinish} 
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <><Loader2 className="h-5 w-5 animate-spin" /> Preparing...</>
                                ) : (
                                    <>Go to Dashboard <Rocket className="h-5 w-5" /></>
                                )}
                            </Button>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
