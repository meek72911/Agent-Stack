"use client";

import { motion } from "framer-motion";
import {
  Bot,
  GitBranch,
  CheckCircle2,
  XCircle,
  Clock,
  Zap,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useExecutions } from "@/hooks/use-executions";

const iconMap = {
  agent_run: Bot,
  workflow_run: GitBranch,
  deploy: Zap,
  error: XCircle,
};

const statusConfig = {
  success: {
    icon: CheckCircle2,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    label: "Success",
  },
  error: {
    icon: XCircle,
    color: "text-red-500",
    bg: "bg-red-500/10",
    label: "Error",
  },
  running: {
    icon: Clock,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    label: "Running",
  },
  pending: {
    icon: Clock,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    label: "Pending",
  },
};

export function RecentActivity() {
  const { executions, isLoading } = useExecutions(10);

  function getRelativeTime(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  }

  function mapStatus(status: string): keyof typeof statusConfig {
    switch (status) {
      case "completed": return "success";
      case "failed": return "error";
      case "running": return "running";
      default: return "pending";
    }
  }

  return (
    <Card className="premium-card relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-6">
        <div className="space-y-1">
          <CardTitle className="text-xl font-extrabold tracking-tight">
            Activity Stream
          </CardTitle>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Real-time event monitor</p>
        </div>
        <Badge variant="outline" className="text-[10px] uppercase tracking-widest font-bold bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-3 py-1">
          <span className="mr-2 h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
          Live Matrix
        </Badge>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[430px]">
          <div className="space-y-2 px-6 pb-6">
            {isLoading ? (
              <div className="py-20 flex flex-col items-center justify-center gap-4 text-muted-foreground">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <p className="text-xs font-bold uppercase tracking-widest animate-pulse">Syncing Streams...</p>
              </div>
            ) : executions.length === 0 ? (
              <div className="py-20 text-center text-sm text-muted-foreground font-medium italic">
                The stream is currently silent.
              </div>
            ) : (
              executions.map((activity: any, i: number) => {
                const type = activity.type || "agent_run";
                const TypeIcon = iconMap[type as keyof typeof iconMap] || Bot;
                const statusKey = mapStatus(activity.status);
                const status = statusConfig[statusKey];
                const StatusIcon = status.icon;

                return (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    className="group flex items-center gap-4 rounded-2xl p-4 transition-all duration-300 bg-white/[0.02] border border-white/[0.03] hover:bg-white/[0.05] hover:border-primary/20 hover:shadow-xl relative overflow-hidden"
                  >
                    <div
                      className={cn(
                        "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-all duration-500 group-hover:scale-110 shadow-glow-sm",
                        status.bg
                      )}
                    >
                      <TypeIcon className={cn("h-6 w-6", status.color)} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-extrabold tracking-tight group-hover:text-primary transition-colors">
                          {activity.workflows?.name || "Neural Workflow Task"}
                        </p>
                        <div className={cn("flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-tighter border", status.bg, status.color, "border-white/5")}>
                           <StatusIcon className="h-2.5 w-2.5" />
                           {status.label}
                        </div>
                      </div>
                      <p className="mt-1 truncate text-xs text-muted-foreground leading-relaxed">
                        {activity.error || `System directive processed successfully • ${activity.id.slice(0, 8)}`}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        {getRelativeTime(activity.created_at)}
                      </span>
                      <div className="h-1.5 w-1.5 rounded-full bg-white/10 group-hover:bg-primary transition-colors duration-500" />
                    </div>
                    
                    {/* Hover Glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/[0.01] to-transparent transform translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-700" />
                  </motion.div>
                );
              })
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
