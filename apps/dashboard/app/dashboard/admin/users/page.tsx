"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/hooks/use-user";
import { createClient } from "@/lib/supabase/client";
import { redirect } from "next/navigation";
import { 
    Users, 
    Search, 
    Filter, 
    MoreVertical, 
    Shield, 
    UserPlus, 
    Mail, 
    Calendar,
    ArrowUpDown
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export default function AdminUsersPage() {
    const { profile, isLoading: authLoading } = useUser();
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const supabase = createClient();

    useEffect(() => {
        async function fetchUsers() {
            try {
                const { data, error } = await supabase
                    .from("profiles")
                    .select("*")
                    .order("created_at", { ascending: false });

                if (error) throw error;
                setUsers(data || []);
            } catch (error) {
                console.error("Error fetching users:", error);
                toast.error("Failed to load users");
            } finally {
                setLoading(false);
            }
        }

        if (profile?.role === "admin" || profile?.role === "owner") {
            fetchUsers();
        }
    }, [profile, supabase]);

    if (authLoading) return <div className="h-[80vh] flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" /></div>;

    if (profile?.role !== "admin" && profile?.role !== "owner") {
        redirect("/dashboard/overview");
    }

    const filteredUsers = users.filter(u => 
        u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getRoleBadge = (role: string) => {
        switch (role) {
            case "owner": return <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 uppercase text-[10px]">Owner</Badge>;
            case "admin": return <Badge className="bg-primary/10 text-primary border-primary/20 uppercase text-[10px]">Admin</Badge>;
            default: return <Badge variant="outline" className="uppercase text-[10px] text-muted-foreground">Member</Badge>;
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                     <div className="flex items-center gap-2 mb-2">
                        <Users className="h-4 w-4 text-primary" />
                        <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Platform Users</span>
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight">User Management</h1>
                    <p className="text-muted-foreground mt-1">Control access, roles, and view engagement metrics.</p>
                </div>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-glow-sm">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Invite Member
                </Button>
            </div>

            {/* Filter Bar */}
            <Card className="premium-card">
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input 
                                placeholder="Search by name or email..." 
                                className="pl-10 glass-strong border-white/5 bg-white/[0.02] focus:bg-white/[0.05]"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" className="glass-strong border-white/10 hover:bg-white/5 text-xs">
                                <Filter className="h-4 w-4 mr-2" />
                                Filter
                            </Button>
                            <Button variant="outline" className="glass-strong border-white/10 hover:bg-white/5 text-xs">
                                <ArrowUpDown className="h-4 w-4 mr-2" />
                                Sort
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Users Table (Simplified List) */}
            <div className="grid gap-3">
                {loading ? (
                    Array(5).fill(0).map((_, i) => (
                        <div key={i} className="h-20 w-full animate-pulse bg-white/5 rounded-2xl border border-white/5" />
                    ))
                ) : filteredUsers.length === 0 ? (
                    <Card className="premium-card py-20 text-center text-muted-foreground uppercase text-[10px] font-bold tracking-widest">
                        No users mapped to this query
                    </Card>
                ) : (
                    filteredUsers.map((u, i) => (
                        <motion.div
                            key={u.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="group flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/[0.03] hover:bg-white/[0.05] hover:border-primary/20 transition-all shadow-premium"
                        >
                            <div className="flex items-center gap-4">
                                <Avatar className="h-12 w-12 border-2 border-white/5 group-hover:border-primary/50 transition-colors">
                                    <AvatarImage src={u.avatar_url} />
                                    <AvatarFallback className="font-bold text-xs bg-white/10">{u.full_name?.[0] || u.email?.[0]?.toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-extrabold tracking-tight text-sm group-hover:text-primary transition-colors">{u.full_name || "Nexus User"}</span>
                                        {getRoleBadge(u.role)}
                                    </div>
                                    <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-medium">
                                        <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {u.email}</span>
                                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Joined {new Date(u.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="hidden lg:flex flex-col items-end">
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Status</span>
                                    <span className="text-xs font-semibold text-emerald-400">Connected</span>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:text-white hover:bg-white/5 rounded-xl">
                                            <MoreVertical className="h-5 w-5" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56 glass-strong border-white/10 shadow-premium">
                                        <DropdownMenuLabel className="text-xs uppercase tracking-widest font-bold text-muted-foreground/50">User Actions</DropdownMenuLabel>
                                        <DropdownMenuSeparator className="bg-white/5" />
                                        <DropdownMenuItem className="cursor-pointer">
                                            <Shield className="h-4 w-4 mr-3" /> Change Role
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="cursor-pointer text-red-400 focus:text-red-400 focus:bg-red-400/10">
                                            Suspend Account
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
}
