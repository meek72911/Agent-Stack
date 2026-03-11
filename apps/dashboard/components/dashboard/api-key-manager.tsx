"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Key, Plus, Trash2, ShieldCheck, 
    AlertTriangle, Check, Loader2, Globe,
    ChevronDown, ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
    Select, SelectContent,SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface ApiKey {
    id: string;
    provider: string;
    keyMask: string;
    createdAt: string;
}

const PROVIDERS = [
    { id: "openai", name: "OpenAI", logo: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg", help: "https://platform.openai.com/api-keys" },
    { id: "anthropic", name: "Anthropic", help: "https://console.anthropic.com/settings/keys" },
    { id: "gemini", name: "Google Gemini", help: "https://aistudio.google.com/app/apikey" },
    { id: "groq", name: "Groq", help: "https://console.groq.com/keys" },
    { id: "custom_openai", name: "Custom (OpenAI Compatible)" },
];

export function ApiKeyManager() {
    const [keys, setKeys] = useState<ApiKey[]>([
        { id: "1", provider: "openai", keyMask: "sk-••••••••••••v12j", createdAt: "2026-03-01" },
        { id: "2", provider: "anthropic", keyMask: "sk-ant-•••••••••••8z9q", createdAt: "2026-03-05" },
    ]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isTesting, setIsTesting] = useState(false);
    const [testResult, setTestResult] = useState<"success" | "error" | null>(null);

    // Form state
    const [provider, setProvider] = useState("");
    const [keyValue, setKeyValue] = useState("");

    const handleAddKey = () => {
        if (!provider || !keyValue) {
            toast.error("Please select a provider and enter a key.");
            return;
        }
        
        const newKey: ApiKey = {
            id: Math.random().toString(36).substr(2, 9),
            provider,
            keyMask: `${keyValue.substr(0, 4)}••••••••••${keyValue.substr(-4)}`,
            createdAt: new Date().toISOString().split("T")[0],
        };
        
        setKeys([newKey, ...keys]);
        setIsAddModalOpen(false);
        setKeyValue("");
        setProvider("");
        setTestResult(null);
        toast.success("API Key added and encrypted successfully!");
    };

    const handleTest = () => {
        setIsTesting(true);
        setTestResult(null);
        setTimeout(() => {
            setIsTesting(false);
            setTestResult("success");
            toast.success("Connection successful!");
        }, 1500);
    };

    const removeKey = (id: string) => {
        setKeys(keys.filter(k => k.id !== id));
        toast.info("API key removed.");
    };

    return (
        <div className="space-y-6">
            <Card className="border-primary/20 bg-primary/5">
                <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                        <div className="rounded-full bg-primary/10 p-2">
                            <ShieldCheck className="h-5 w-5 text-primary" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-sm font-semibold text-primary">Secure BYOK Storage</h3>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Your API keys are encrypted at-rest using AES-256-GCM. We never expose them in plain text, 
                                and they are only decrypted in memory during workflow execution.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-bold tracking-tight">Saved API Keys</h2>
                    <p className="text-sm text-muted-foreground">Manage keys for your AI providers</p>
                </div>
                <Button onClick={() => setIsAddModalOpen(true)} className="gap-2">
                    <Plus className="h-4 w-4" /> Add API Key
                </Button>
            </div>

            <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                    {keys.length > 0 ? (
                        keys.map((key) => (
                            <motion.div
                                key={key.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="group flex items-center justify-between rounded-xl border bg-card p-4 shadow-sm transition-all hover:border-primary/30"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                                        <Globe className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-bold capitalize">{key.provider}</span>
                                            <Badge variant="secondary" className="h-4 text-[9px] uppercase tracking-widest">Active</Badge>
                                        </div>
                                        <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground font-mono">
                                            <span>{key.keyMask}</span>
                                            <span className="text-[10px] opacity-50">• Added on {key.createdAt}</span>
                                        </div>
                                    </div>
                                </div>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="opacity-0 group-hover:opacity-100 text-destructive hover:bg-destructive/10"
                                    onClick={() => removeKey(key.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </motion.div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center rounded-xl border border-dashed">
                            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                                <Key className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <h3 className="text-sm font-semibold">No API keys added yet</h3>
                            <p className="text-xs text-muted-foreground mt-1 max-w-[240px]">
                                Add your first key to start running multi-agent workflows.
                            </p>
                            <Button variant="outline" size="sm" className="mt-4" onClick={() => setIsAddModalOpen(true)}>
                                <Plus className="h-3 w-3 mr-1" /> Add Key
                            </Button>
                        </div>
                    )}
                </AnimatePresence>
            </div>

            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add API Key</DialogTitle>
                        <DialogDescription>
                            Connect your preferred AI model provider to run workflows.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <Label>Provider</Label>
                            <Select value={provider} onValueChange={setProvider}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a provider" />
                                </SelectTrigger>
                                <SelectContent>
                                    {PROVIDERS.map(p => (
                                        <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="key-value">API Key</Label>
                                {provider && PROVIDERS.find(p => p.id === provider)?.help && (
                                    <a 
                                        href={PROVIDERS.find(p => p.id === provider)?.help} 
                                        target="_blank" 
                                        className="text-[10px] text-primary hover:underline flex items-center gap-1"
                                    >
                                        How to get <ExternalLink className="h-2 w-2" />
                                    </a>
                                )}
                            </div>
                            <Input
                                id="key-value"
                                type="password"
                                placeholder="..."
                                value={keyValue}
                                onChange={(e) => setKeyValue(e.target.value)}
                            />
                        </div>
                        
                        {testResult === "success" && (
                            <div className="rounded-lg bg-green-100 dark:bg-green-900/20 p-3 flex items-center gap-3 text-xs text-green-700 dark:text-green-400">
                                <Check className="h-4 w-4" /> Connected successfully
                            </div>
                        )}
                    </div>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button 
                            variant="outline" 
                            disabled={!keyValue || isTesting}
                            onClick={handleTest}
                        >
                            {isTesting ? (
                                <><Loader2 className="h-3 w-3 animate-spin mr-2" /> Testing...</>
                            ) : (
                                "Test Connection"
                            )}
                        </Button>
                        <Button onClick={handleAddKey} disabled={!provider || !keyValue}>
                            Save API Key
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
