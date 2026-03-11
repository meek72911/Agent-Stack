"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    User, Bell, Globe, Lock, Loader2, Save, Moon, Sun, Monitor
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/hooks/use-user";
import { useTheme } from "next-themes";
import { createClient } from "@/lib/supabase/client";

export function GeneralSettings() {
    const { user } = useUser();
    const { theme, setTheme } = useTheme();
    const [displayName, setDisplayName] = useState(user?.user_metadata?.full_name ?? "");
    const [isSaving, setIsSaving] = useState(false);
    const [emailNotifs, setEmailNotifs] = useState(true);
    const [executionAlerts, setExecutionAlerts] = useState(true);

    async function handleSaveProfile() {
        setIsSaving(true);
        try {
            const supabase = createClient();
            const { error } = await supabase.auth.updateUser({
                data: { full_name: displayName.trim() },
            });
            if (error) throw error;
            toast.success("Profile updated");
        } catch (err: any) {
            toast.error(err.message ?? "Failed to update");
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <div className="space-y-6 max-w-2xl">

            {/* Profile */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                        <User className="h-4 w-4" /> Profile
                    </CardTitle>
                    <CardDescription>Your account information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="display-name">Display Name</Label>
                        <Input
                            id="display-name"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            placeholder="Your name"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Email</Label>
                        <Input value={user?.email ?? ""} disabled className="bg-muted" />
                        <p className="text-xs text-muted-foreground">Email cannot be changed here. Contact support.</p>
                    </div>
                    <Button onClick={handleSaveProfile} disabled={isSaving} className="gap-2">
                        {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        Save Profile
                    </Button>
                </CardContent>
            </Card>

            {/* Appearance */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                        <Monitor className="h-4 w-4" /> Appearance
                    </CardTitle>
                    <CardDescription>Choose how AgentStack looks</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { value: "light", label: "Light", icon: Sun },
                            { value: "dark", label: "Dark", icon: Moon },
                            { value: "system", label: "System", icon: Monitor },
                        ].map(({ value, label, icon: Icon }) => (
                            <button
                                key={value}
                                onClick={() => setTheme(value)}
                                className={`flex flex-col items-center gap-2 rounded-lg border p-4 text-sm font-medium transition-all ${theme === value
                                        ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                                        : "border-border hover:border-primary/40"
                                    }`}
                            >
                                <Icon className="h-5 w-5" />
                                {label}
                            </button>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                        <Bell className="h-4 w-4" /> Notifications
                    </CardTitle>
                    <CardDescription>Control what you hear about</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium">Email notifications</p>
                            <p className="text-xs text-muted-foreground">Weekly summary, important updates</p>
                        </div>
                        <Switch checked={emailNotifs} onCheckedChange={setEmailNotifs} />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium">Execution alerts</p>
                            <p className="text-xs text-muted-foreground">Alert when a workflow errors or completes</p>
                        </div>
                        <Switch checked={executionAlerts} onCheckedChange={setExecutionAlerts} />
                    </div>
                </CardContent>
            </Card>

            {/* Danger zone */}
            <Card className="border-destructive/50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base text-destructive">
                        <Lock className="h-4 w-4" /> Danger Zone
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium">Delete account</p>
                            <p className="text-xs text-muted-foreground">Permanently delete your account and all data</p>
                        </div>
                        <Button variant="destructive" size="sm" onClick={() => toast.error("Contact support to delete your account")}>
                            Delete Account
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
