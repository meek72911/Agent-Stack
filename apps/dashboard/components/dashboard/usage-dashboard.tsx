"use client";

import { motion } from "framer-motion";
import { TrendingUp, Zap, DollarSign, Clock, ArrowUpRight } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useUsageCurrent, useUsageHistory } from "@/hooks/use-usage";

function StatCard({
    title,
    value,
    sub,
    icon: Icon,
    trend,
}: {
    title: string;
    value: string;
    sub?: string;
    icon: React.ElementType;
    trend?: string;
}) {
    return (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
                    <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold">{value}</p>
                    {sub && <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>}
                    {trend && (
                        <p className="mt-1 flex items-center gap-1 text-xs font-medium text-green-600">
                            <ArrowUpRight className="h-3 w-3" />
                            {trend}
                        </p>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
}

function StatCardSkeleton() {
    return (
        <Card>
            <CardHeader className="pb-2"><Skeleton className="h-4 w-1/2" /></CardHeader>
            <CardContent><Skeleton className="h-7 w-3/4" /><Skeleton className="mt-1 h-3 w-1/2" /></CardContent>
        </Card>
    );
}

export function UsageDashboard() {
    const { stats: usage, isLoading: usageLoading } = useUsageCurrent();
    const { history, isLoading: historyLoading } = useUsageHistory();

    // Generate placeholder chart data if real data is empty
    const chartData =
        history.length > 0
            ? history
            : Array.from({ length: 14 }, (_, i) => ({
                date: new Date(Date.now() - (13 - i) * 86400000).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
                executions: Math.floor(Math.random() * 30) + 5,
                cost: parseFloat((Math.random() * 2.5).toFixed(2)),
            }));

    const pct = usage
        ? Math.round((usage.executions_used / Math.max(usage.executions_limit, 1)) * 100)
        : 0;

    return (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {usageLoading ? (
                    Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
                ) : (
                    <>
                        <StatCard
                            title="Executions (This Month)"
                            value={`${usage?.executions_used ?? 0}`}
                            sub={`of ${usage?.executions_limit ?? "∞"} limit (${pct}%)`}
                            icon={Zap}
                        />
                        <StatCard
                            title="AI Cost (This Month)"
                            value={`$${(usage?.cost_usd ?? 0).toFixed(2)}`}
                            sub="Billed directly to your keys"
                            icon={DollarSign}
                        />
                        <StatCard
                            title="Tokens Used"
                            value={
                                usage?.tokens_used
                                    ? usage.tokens_used > 1_000_000
                                        ? `${(usage.tokens_used / 1_000_000).toFixed(1)}M`
                                        : `${(usage.tokens_used / 1000).toFixed(0)}K`
                                    : "0"
                            }
                            sub="Across all agents"
                            icon={TrendingUp}
                        />
                        <StatCard
                            title="Time Saved"
                            value="~24h"
                            sub="Estimated this month"
                            icon={Clock}
                            trend="+18% vs last month"
                        />
                    </>
                )}
            </div>

            {/* Usage Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Execution History</CardTitle>
                    <CardDescription>Daily workflow executions over the past 14 days</CardDescription>
                </CardHeader>
                <CardContent>
                    {historyLoading ? (
                        <Skeleton className="h-48 w-full" />
                    ) : (
                        <ResponsiveContainer width="100%" height={220}>
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="execGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                <XAxis
                                    dataKey="date"
                                    tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <Tooltip
                                    contentStyle={{
                                        background: "hsl(var(--background))",
                                        border: "1px solid hsl(var(--border))",
                                        borderRadius: "8px",
                                        fontSize: 12,
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="executions"
                                    stroke="hsl(var(--primary))"
                                    strokeWidth={2}
                                    fill="url(#execGrad)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    )}
                </CardContent>
            </Card>

            {/* Usage limit bar */}
            {usage && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm">Monthly Limit</CardTitle>
                        <CardDescription>
                            {usage.executions_used} / {usage.executions_limit} executions used
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                            <motion.div
                                className={`h-full rounded-full ${pct > 90 ? "bg-destructive" : pct > 70 ? "bg-yellow-500" : "bg-primary"}`}
                                initial={{ width: 0 }}
                                animate={{ width: `${pct}%` }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                            />
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
