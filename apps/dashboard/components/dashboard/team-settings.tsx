"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    UserPlus, Mail, Loader2, Trash2, Shield, Crown, User, MoreHorizontal
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useUser } from "@/hooks/use-user";
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

const ROLE_ICONS = { owner: Crown, admin: Shield, member: User };
const ROLE_COLORS = { owner: "text-amber-500", admin: "text-blue-500", member: "text-muted-foreground" };

interface Member {
    id: string;
    email: string;
    full_name?: string;
    role: "owner" | "admin" | "member";
    joined_at: string;
}

export function TeamSettings() {
    const { user } = useUser();
    const { data, mutate, isLoading } = useSWR<{ members: Member[] }>("/workspace/members", fetcher);
    const members = data?.members ?? [];

    const [inviteEmail, setInviteEmail] = useState("");
    const [inviteRole, setInviteRole] = useState<"admin" | "member">("member");
    const [isSending, setIsSending] = useState(false);

    async function handleInvite(e: React.FormEvent) {
        e.preventDefault();
        if (!inviteEmail.trim()) return;
        setIsSending(true);
        try {
            const supabase = createClient();
            const { data: { session } } = await supabase.auth.getSession();
            const res = await fetch("/api/v1/workspace/invite", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${session?.access_token}` },
                body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
            });
            if (!res.ok) throw new Error("Failed to send invite");
            toast.success(`Invite sent to ${inviteEmail}`);
            setInviteEmail("");
            mutate();
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setIsSending(false);
        }
    }

    async function handleRemove(memberId: string) {
        try {
            const supabase = createClient();
            const { data: { session } } = await supabase.auth.getSession();
            await fetch(`/api/v1/workspace/members/${memberId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${session?.access_token}` },
            });
            toast.success("Member removed");
            mutate();
        } catch {
            toast.error("Failed to remove member");
        }
    }

    return (
        <div className="space-y-6 max-w-2xl">
            {/* Invite */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                        <UserPlus className="h-4 w-4" /> Invite Team Member
                    </CardTitle>
                    <CardDescription>Invitees will receive an email to join your workspace</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleInvite} className="flex flex-col gap-3 sm:flex-row sm:items-end">
                        <div className="flex-1 space-y-1.5">
                            <Label htmlFor="invite-email">Email address</Label>
                            <Input
                                id="invite-email"
                                type="email"
                                placeholder="colleague@company.com"
                                value={inviteEmail}
                                onChange={(e) => setInviteEmail(e.target.value)}
                            />
                        </div>
                        <div className="w-full sm:w-36 space-y-1.5">
                            <Label>Role</Label>
                            <Select value={inviteRole} onValueChange={(v) => setInviteRole(v as any)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="member">Member</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button type="submit" disabled={!inviteEmail.trim() || isSending} className="gap-2 self-end">
                            {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
                            {isSending ? "Sending..." : "Send Invite"}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Members list */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Team Members</CardTitle>
                    <CardDescription>
                        {members.length} member{members.length !== 1 ? "s" : ""} in your workspace
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <p className="text-sm text-muted-foreground">Loading members...</p>
                    ) : members.length === 0 ? (
                        <div className="rounded-lg border border-dashed p-6 text-center">
                            <UserPlus className="mx-auto h-8 w-8 text-muted-foreground/50" />
                            <p className="mt-2 text-sm text-muted-foreground">No team members yet — invite someone above</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-border">
                            {/* Show current user first */}
                            {user && (
                                <div className="flex items-center gap-3 py-3">
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback className="text-xs">
                                            {(user.user_metadata?.full_name ?? user.email ?? "?")[0].toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">
                                            {user.user_metadata?.full_name ?? user.email}
                                            <span className="ml-2 text-xs text-muted-foreground">(you)</span>
                                        </p>
                                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                                    </div>
                                    <Badge variant="outline" className="gap-1 text-amber-500 border-amber-200">
                                        <Crown className="h-3 w-3" /> Owner
                                    </Badge>
                                </div>
                            )}

                            {members.map((member) => {
                                const RoleIcon = ROLE_ICONS[member.role] ?? User;
                                const roleColor = ROLE_COLORS[member.role] ?? "";
                                return (
                                    <motion.div
                                        key={member.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex items-center gap-3 py-3"
                                    >
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback className="text-xs">
                                                {(member.full_name ?? member.email)[0].toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">{member.full_name ?? member.email}</p>
                                            <p className="text-xs text-muted-foreground truncate">{member.email}</p>
                                        </div>
                                        <Badge variant="outline" className={`gap-1 ${roleColor}`}>
                                            <RoleIcon className="h-3 w-3" />
                                            <span className="capitalize">{member.role}</span>
                                        </Badge>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-7 w-7">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem
                                                    className="gap-2 text-destructive focus:text-destructive"
                                                    onClick={() => handleRemove(member.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" /> Remove
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
