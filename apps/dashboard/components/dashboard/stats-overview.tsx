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

interface StatCard {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: React.ElementType;
  color: string;
  bg: string;
}

const stats: StatCard[] = [
  {
    label: "Active Agents",
    value: "12",
    change: "+2 this week",
    trend: "up",
    icon: Bot,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    label: "Executions",
    value: "24,891",
    change: "+12.5%",
    trend: "up",
    icon: Zap,
    color: "text-violet-500",
    bg: "bg-violet-500/10",
  },
  {
    label: "Success Rate",
    value: "98.7%",
    change: "+0.3%",
    trend: "up",
    icon: TrendingUp,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    label: "Monthly Cost",
    value: "$142.50",
    change: "-8.2%",
    trend: "down",
    icon: DollarSign,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function StatsOverview() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
    >
      {stats.map((stat) => {
        const Icon = stat.icon;
        const TrendIcon =
          stat.trend === "up" ? ArrowUpRight : ArrowDownRight;
        const trendColor =
          stat.label === "Monthly Cost"
            ? stat.trend === "down"
              ? "text-emerald-500"
              : "text-red-500"
            : stat.trend === "up"
            ? "text-emerald-500"
            : "text-red-500";

        return (
          <motion.div key={stat.label} variants={itemVariants}>
            <Card className="transition-shadow hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </span>
                  <div
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-lg",
                      stat.bg
                    )}
                  >
                    <Icon className={cn("h-5 w-5", stat.color)} />
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-2xl font-bold">{stat.value}</span>
                </div>
                <div className="mt-1 flex items-center gap-1">
                  <TrendIcon className={cn("h-3.5 w-3.5", trendColor)} />
                  <span className={cn("text-xs font-medium", trendColor)}>
                    {stat.change}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
