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

interface ActivityItem {
  id: string;
  type: "agent_run" | "workflow_run" | "deploy" | "error";
  title: string;
  description: string;
  timestamp: string;
  status: "success" | "error" | "running" | "pending";
}

const activities: ActivityItem[] = [
  {
    id: "1",
    type: "agent_run",
    title: "Customer Support Agent",
    description: "Resolved ticket #4521 -- refund processed",
    timestamp: "2 min ago",
    status: "success",
  },
  {
    id: "2",
    type: "workflow_run",
    title: "Content Pipeline",
    description: "Generated 5 blog outlines from RSS feeds",
    timestamp: "8 min ago",
    status: "success",
  },
  {
    id: "3",
    type: "agent_run",
    title: "Data Analyst Agent",
    description: "Processing Q4 revenue report...",
    timestamp: "12 min ago",
    status: "running",
  },
  {
    id: "4",
    type: "error",
    title: "Slack Notifier Agent",
    description: "Rate limit exceeded -- retrying in 30s",
    timestamp: "18 min ago",
    status: "error",
  },
  {
    id: "5",
    type: "deploy",
    title: "Code Review Agent v2.1",
    description: "Deployed to production successfully",
    timestamp: "1 hour ago",
    status: "success",
  },
  {
    id: "6",
    type: "workflow_run",
    title: "Lead Enrichment Workflow",
    description: "Enriched 142 leads from HubSpot sync",
    timestamp: "2 hours ago",
    status: "success",
  },
];

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
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-base font-semibold">
          Recent Activity
        </CardTitle>
        <Badge variant="outline" className="text-xs">
          Live
          <span className="ml-1.5 h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
        </Badge>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          <div className="space-y-1 px-6 pb-6">
            {activities.map((activity, i) => {
              const TypeIcon = iconMap[activity.type];
              const status = statusConfig[activity.status];
              const StatusIcon = status.icon;

              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="group flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-muted/50"
                >
                  <div
                    className={cn(
                      "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                      status.bg
                    )}
                  >
                    <TypeIcon className={cn("h-4 w-4", status.color)} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-medium">
                        {activity.title}
                      </p>
                      <StatusIcon
                        className={cn("h-3.5 w-3.5 shrink-0", status.color)}
                      />
                    </div>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {activity.description}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {activity.timestamp}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
