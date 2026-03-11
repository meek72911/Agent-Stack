"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Brain, Save, Loader2, Info } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/hooks/use-user";
import { createClient } from "@/lib/supabase/client";

export function WorkspaceMemory() {
    const { user } = useUser();
    const [isSaving, setIsSaving] = useState(false);
    
    // In a real app, these would be fetched from the organization table or a separate workspace_memory table
    const [memory, setMemory] = useState({
        company_name: "My Awesome Agency",
        tone_of_voice: "Professional, yet approachable and energetic.",
        target_audience: "SMB owners and marketing managers looking for AI automation.",
        brand_guidelines: "Use minimalist design principles. Emphasize speed and reliability.",
    });

    async function handleSave() {
        setIsSaving(true);
        try {
            const supabase = createClient();
            // Assuming we store this in organization metadata or a custom column
            const { error } = await supabase
                .from("organizations")
                .update({ 
                    workspace_memory: memory 
                })
                .eq("id", user?.organization_id);
                
            if (error) throw error;
            toast.success("Workspace memory updated");
        } catch (err: any) {
            toast.error(err.message ?? "Failed to save memory");
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <div className="space-y-6 max-w-3xl">
            <div className="flex items-start gap-4 rounded-xl border bg-primary/5 p-4">
                <Brain className="h-5 w-5 text-primary mt-1 shrink-0" />
                <div className="space-y-1">
                    <p className="text-sm font-semibold text-primary">Global Context Injection</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                        Information saved here is automatically injected into the system prompt of every agent in this workspace. 
                        This ensures consistency across all workflows without manual prompting.
                    </p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        Core Identity
                    </CardTitle>
                    <CardDescription>Fundamental details about your organization</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Company Name</Label>
                        <Input 
                            value={memory.company_name} 
                            onChange={(e) => setMemory({...memory, company_name: e.target.value})}
                            placeholder="e.g. Acme Corp" 
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Content & Voice</CardTitle>
                    <CardDescription>Guidelines for agent-generated content</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Tone of Voice</Label>
                        <Textarea 
                            value={memory.tone_of_voice} 
                            onChange={(e) => setMemory({...memory, tone_of_voice: e.target.value})}
                            placeholder="Describe how agents should sound..." 
                            className="min-h-[100px]"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Target Audience</Label>
                        <Textarea 
                            value={memory.target_audience} 
                            onChange={(e) => setMemory({...memory, target_audience: e.target.value})}
                            placeholder="Who is the primary audience for these agents?" 
                            className="min-h-[100px]"
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Brand Guidelines</CardTitle>
                    <CardDescription>Specific rules, constraints, or styles to follow</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Brand Guidelines (Detailed)</Label>
                        <Textarea 
                            value={memory.brand_guidelines} 
                            onChange={(e) => setMemory({...memory, brand_guidelines: e.target.value})}
                            placeholder="Enter detailed instructions, Dos and Don'ts..." 
                            className="min-h-[150px]"
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end pt-4">
                <Button onClick={handleSave} disabled={isSaving} size="lg" className="px-8 flex gap-2">
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Save Workspace Memory
                </Button>
            </div>
        </div>
    );
}
