"use client";

import { motion } from "framer-motion";
import {
  Bot,
  Zap,
  TrendingUp,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useUsageCurrent, useUsageHistory } from "@/hooks/use-usage";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function StatsOverview() {
  const { stats, isLoading: isStatsLoading } = useUsageCurrent();
  const { history, isLoading: isHistoryLoading } = useUsageHistory(30);

  const isLoading = isStatsLoading || isHistoryLoading;

  // Calculate success rate from history
  const totalExecs = history.reduce((acc: number, curr: any) => acc + curr.executions, 0);
  const totalSuccess = history.reduce((acc: number, curr: any) => acc + curr.successful, 0);
  const successRate = totalExecs > 0 ? ((totalSuccess / totalExecs) * 100).toFixed(1) : "100";

  const displayStats = [
    {
      label: "Active Agents",
      value: isLoading ? "..." : (stats?.agents?.current ?? "0").toString(),
      change: "+2 this week", 
      trend: "up" as const,
      icon: Bot,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "Executions",
      value: isLoading ? "..." : (stats?.executions?.current ?? "0").toLocaleString(),
      change: "+12.5%",
      trend: "up" as const,
      icon: Zap,
      color: "text-violet-500",
      bg: "bg-violet-500/10",
    },
    {
      label: "Success Rate",
      value: isLoading ? "..." : `${successRate}%`,
      change: "+0.3%",
      trend: "up" as const,
      icon: TrendingUp,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Monthly Cost",
      value: isLoading ? "..." : `$${((stats?.cost?.current_cents ?? 0) / 100).toFixed(2)}`,
      change: "-8.2%",
      trend: "down" as const,
      icon: DollarSign,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
    >
      {displayStats.map((stat) => (
        <motion.div key={stat.label} variants={itemVariants}>
          <Card className="premium-card group h-full relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                   <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-[0.2em]">{stat.label}</p>
                   <h3 className="text-3xl font-extrabold tracking-tight text-white group-hover:text-primary transition-colors">
                     {stat.value}
                   </h3>
                </div>
                <div className={cn(
                  "p-3 rounded-2xl bg-opacity-10 transition-all duration-500 group-hover:scale-110 group-hover:bg-opacity-20 shadow-glow-sm", 
                  stat.bg
                )}>
                  <stat.icon className={cn("h-6 w-6", stat.color)} />
                </div>
              </div>
              
              <div className="mt-6 flex items-center gap-2">
                <div className={cn(
                  "flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold border border-white/5 backdrop-blur-md",
                  stat.trend === "up" ? "text-emerald-400 bg-emerald-400/10" : "text-red-400 bg-red-400/10"
                )}>
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="h-3 w-3" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3" />
                  )}
                  {stat.change}
                </div>
                <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">vs last period</span>
              </div>
              
              {/* Card Decoration */}
              <div className="absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-primary/5 blur-3xl group-hover:bg-primary/10 transition-all duration-700" />
              <div className="absolute top-0 right-0 h-px w-0 bg-gradient-to-r from-transparent via-primary/50 to-transparent group-hover:w-full transition-all duration-1000" />
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}
