"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Bot,
  GitBranch,
  CreditCard,
  Settings,
  Users,
  Key,
  BarChart3,
  BookOpen,
  ChevronLeft,
  Layers,
  Puzzle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/stores/ui-store";

import { useUsageCurrent } from "@/hooks/use-usage";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

/** Named export alias used by dashboard layout */
export const DashboardSidebar = Sidebar;

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, setSidebarCollapsed } = useUIStore();
  const { stats } = useUsageCurrent();

  const mainNav: NavItem[] = [
    { label: "Overview", href: "/dashboard/overview", icon: LayoutDashboard },
    { label: "Templates", href: "/dashboard/templates", icon: Layers },
    { label: "Agents", href: "/dashboard/agents", icon: Bot, badge: stats?.agents?.current?.toString() },
    { label: "Workflows", href: "/dashboard/workflows", icon: GitBranch },
    { label: "Integrations", href: "/dashboard/integrations", icon: Puzzle },
    { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  ];

  const bottomNav: NavItem[] = [
    { label: "Team", href: "/dashboard/settings/team", icon: Users },
    { label: "API Keys", href: "/dashboard/settings/keys", icon: Key },
    { label: "Billing", href: "/dashboard/settings/billing", icon: CreditCard },
    { label: "Settings", href: "/dashboard/settings", icon: Settings },
    { label: "Docs", href: "#", icon: BookOpen },
  ];

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  const renderItem = (item: NavItem) => {
    const active = isActive(item.href);
    const Icon = item.icon;

    const content = (
      <Link
        href={item.href}
        className={cn(
          "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300 relative overflow-hidden",
          active
            ? "bg-primary/10 text-primary shadow-[inset_0_0_20px_rgba(249,115,22,0.1)] border border-primary/20"
            : "text-muted-foreground hover:bg-white/5 hover:text-white border border-transparent"
        )}
      >
        <Icon
          className={cn(
            "h-5 w-5 shrink-0 transition-all duration-300",
            active ? "text-primary scale-110" : "group-hover:text-white group-hover:scale-110"
          )}
        />
        {!sidebarCollapsed && (
          <>
            <span className="flex-1 tracking-tight">{item.label}</span>
            {item.badge && (
              <span className="rounded-lg bg-primary/20 px-2 py-0.5 text-[9px] font-bold text-primary shadow-[0_0_10px_rgba(249,115,22,0.2)]">
                {item.badge}
              </span>
            )}
          </>
        )}
        
        {/* Hover Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
      </Link>
    );

    if (sidebarCollapsed) {
      return (
        <TooltipProvider key={item.href} delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="px-2">{content}</div>
            </TooltipTrigger>
            <TooltipContent side="right" className="font-bold glass-strong border-white/10 text-primary px-3 py-1.5 text-xs">
              {item.label}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return <div key={item.href} className="relative px-2">{content}</div>;
  };

  return (
    <motion.aside
      animate={{ width: sidebarCollapsed ? 80 : 260 }}
      transition={{ type: "spring", stiffness: 300, damping: 35 }}
      className="sticky top-0 z-50 flex h-screen flex-col border-r border-white/5 bg-[#050505]/95 backdrop-blur-md shadow-xl"
    >
      {/* Brand Header */}
      <div className="flex h-20 items-center gap-4 px-6">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-orange-600 shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-transform hover:scale-110 cursor-pointer">
          <Layers className="h-5 w-5 text-primary-foreground" />
        </div>
        {!sidebarCollapsed && (
          <div className="flex flex-col">
            <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              AgentStack
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/80">
              Enterprise v3
            </span>
          </div>
        )}
      </div>

      {/* Navigation Areas */}
      <ScrollArea className="flex-1 px-4 py-4">
        <div className="space-y-1">
          {!sidebarCollapsed && (
            <p className="px-4 py-2 text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/50">
              Overview
            </p>
          )}
          <nav className="flex flex-col gap-1.5">{mainNav.map(renderItem)}</nav>
        </div>

        <div className="my-8 px-4">
           <div className="h-px bg-gradient-to-r from-transparent via-white/5 to-transparent w-full" />
        </div>

        <div className="space-y-1">
          {!sidebarCollapsed && (
            <p className="px-4 py-2 text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/50">
              Management
            </p>
          )}
          <nav className="flex flex-col gap-1.5">{bottomNav.map(renderItem)}</nav>
        </div>
      </ScrollArea>

      {/* Collapse Action Footer */}
      <div className="p-4 bg-black/20 backdrop-blur-md">
        <Button
          variant="ghost"
          size="sm"
          className="w-full h-11 justify-center rounded-xl hover:bg-white/5 group border border-transparent hover:border-white/5 transition-all text-muted-foreground"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        >
          <ChevronLeft
            className={cn(
              "h-5 w-5 transition-transform duration-500",
              sidebarCollapsed ? "rotate-180" : "group-hover:-translate-x-1"
            )}
          />
          {!sidebarCollapsed && (
            <span className="ml-3 text-sm font-semibold">Hide Panel</span>
          )}
        </Button>
      </div>
    </motion.aside>
  );
}
