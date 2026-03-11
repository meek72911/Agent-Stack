"use client";

import { motion } from "framer-motion";
import { Bot, MoreVertical, Play, Pause, Settings, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { Agent, AgentStatus } from "@/types/agent";

interface AgentCardProps {
  agent: Agent;
  onSelect?: (agent: Agent) => void;
  onToggle?: (agent: Agent) => void;
  onDelete?: (agent: Agent) => void;
}

const statusConfig: Record<
  AgentStatus,
  { label: string; color: string; dotColor: string }
> = {
  idle: {
    label: "Idle",
    color: "text-muted-foreground",
    dotColor: "bg-muted-foreground",
  },
  running: {
    label: "Running",
    color: "text-emerald-500",
    dotColor: "bg-emerald-500",
  },
  error: {
    label: "Error",
    color: "text-red-500",
    dotColor: "bg-red-500",
  },
  paused: {
    label: "Paused",
    color: "text-amber-500",
    dotColor: "bg-amber-500",
  },
  deploying: {
    label: "Deploying",
    color: "text-blue-500",
    dotColor: "bg-blue-500",
  },
};

export function AgentCard({
  agent,
  onSelect,
  onToggle,
  onDelete,
}: AgentCardProps) {
  const status = statusConfig[agent.status];

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <Card
        className="group cursor-pointer transition-shadow hover:shadow-lg dark:hover:shadow-primary/5"
        onClick={() => onSelect?.(agent)}
      >
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Bot className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold leading-tight">{agent.name}</h3>
                <div className="mt-1 flex items-center gap-1.5">
                  <span
                    className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      status.dotColor,
                      agent.status === "running" && "animate-pulse"
                    )}
                  />
                  <span className={cn("text-xs font-medium", status.color)}>
                    {status.label}
                  </span>
                </div>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggle?.(agent);
                  }}
                >
                  {agent.status === "running" ? (
                    <>
                      <Pause className="mr-2 h-4 w-4" /> Pause
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" /> Start
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                  <Settings className="mr-2 h-4 w-4" /> Configure
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete?.(agent);
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
            {agent.description}
          </p>

          {/* Stats row */}
          <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
            <span>
              <strong className="text-foreground">
                {agent.totalRuns.toLocaleString()}
              </strong>{" "}
              runs
            </span>
            <span>
              <strong className="text-foreground">
                {agent.successRate}%
              </strong>{" "}
              success
            </span>
            <span>
              <strong className="text-foreground">
                {agent.avgLatencyMs}ms
              </strong>{" "}
              avg
            </span>
          </div>

          {/* Tags */}
          {agent.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {agent.tags.slice(0, 3).map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="text-[10px] px-1.5 py-0"
                >
                  {tag}
                </Badge>
              ))}
              {agent.tags.length > 3 && (
                <Badge
                  variant="outline"
                  className="text-[10px] px-1.5 py-0"
                >
                  +{agent.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
