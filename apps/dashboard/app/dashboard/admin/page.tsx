"use client";

import { useUser } from "@/hooks/use-user";
import { redirect } from "next/navigation";
import { 
    Users, 
    Activity, 
    ShieldCheck, 
    Server, 
    Zap, 
    TrendingUp,
    ShieldAlert
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export default function AdminPage() {
    const { profile, isLoading } = useUser();

    if (isLoading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
        );
    }

    // Protection for non-admins
    if (profile?.role !== "admin" && profile?.role !== "owner") {
        redirect("/dashboard/overview");
    }

    const stats = [
        { label: "Total Users", value: "1,284", icon: Users, color: "text-blue-500", bg: "bg-blue-500/10", trend: "+12%" },
        { label: "Active Agents", value: "452", icon: Zap, color: "text-amber-500", bg: "bg-amber-500/10", trend: "+5%" },
        { label: "System Uptime", value: "99.98%", icon: Server, color: "text-emerald-500", bg: "bg-emerald-500/10", trend: "Stable" },
        { label: "Critical Alerts", value: "0", icon: ShieldAlert, color: "text-red-500", bg: "bg-red-500/10", trend: "0 active" },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary uppercase tracking-widest">
                            Admin Control
                        </div>
                        <Badge variant="outline" className="text-[10px] border-emerald-500/20 text-emerald-400 bg-emerald-500/5 uppercase tracking-tighter">
                            System Live
                        </Badge>
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight">Platform Control Center</h1>
                    <p className="text-muted-foreground mt-1">Global oversight and infrastructure management.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="glass-strong border-white/10 hover:bg-white/5 font-bold">
                        System Logs
                    </Button>
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-glow-sm">
                        Global Settings
                    </Button>
                </div>
            </div>

            {/* Stats Matrix */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <Card className="premium-card group">
                            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{stat.label}</CardTitle>
                                <div className={`p-2 rounded-xl ${stat.bg} ${stat.color} transition-transform group-hover:scale-110 duration-500`}>
                                    <stat.icon className="h-4 w-4" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-extrabold tracking-tight mb-1">{stat.value}</div>
                                <p className="text-[10px] font-bold text-emerald-500 uppercase flex items-center gap-1">
                                    <TrendingUp className="h-3 w-3" />
                                    {stat.trend} <span className="text-muted-foreground ml-1">vs last period</span>
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Platform Insights */}
            <div className="grid gap-6 lg:grid-cols-7">
                <Card className="lg:col-span-4 premium-card">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold">User Growth Matrix</CardTitle>
                        <CardDescription>Platform-wide user acquisition and retention metrics.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] flex items-center justify-center border border-white/5 rounded-2xl bg-white/[0.01] text-muted-foreground italic text-sm">
                            [Interactive Analytics Visualization Loading...]
                        </div>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-3 premium-card">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold text-gradient">Infrastructure Health</CardTitle>
                        <CardDescription>Real-time status of microservices and DB clusters.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[
                            { name: "API Cluster (FastAPI)", status: "Healthy", ping: "24ms" },
                            { name: "Database (PostgreSQL)", status: "Optimal", ping: "12ms" },
                            { name: "Redis Cache (Upstash)", status: "Healthy", ping: "8ms" },
                            { name: "Storage (Cloudflare R2)", status: "Online", ping: "45ms" },
                            { name: "Frontend Edge (Vercel)", status: "Active", ping: "15ms" },
                        ].map((system) => (
                            <div key={system.name} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.03] hover:bg-white/[0.05] transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                    <span className="text-sm font-semibold">{system.name}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Badge variant="outline" className="text-[10px] border-emerald-500/20 text-emerald-400 py-0">{system.status}</Badge>
                                    <span className="text-[10px] text-muted-foreground font-mono">{system.ping}</span>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
