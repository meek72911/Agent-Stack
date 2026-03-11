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

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

const mainNav: NavItem[] = [
  { label: "Overview", href: "/dashboard/overview", icon: LayoutDashboard },
  { label: "Templates", href: "/dashboard/templates", icon: Layers },
  { label: "Agents", href: "/dashboard/agents", icon: Bot, badge: "12" },
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

/** Named export alias used by dashboard layout */
export const DashboardSidebar = Sidebar;

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, setSidebarCollapsed } = useUIStore();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  const renderItem = (item: NavItem) => {
    const active = isActive(item.href);
    const Icon = item.icon;

    const content = (
      <Link
        href={item.href}
        className={cn(
          "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
          active
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        )}
      >
        <Icon
          className={cn(
            "h-4 w-4 shrink-0",
            active && "text-primary"
          )}
        />
        {!sidebarCollapsed && (
          <>
            <span className="flex-1">{item.label}</span>
            {item.badge && (
              <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold">
                {item.badge}
              </span>
            )}
          </>
        )}
        {active && (
          <motion.div
            layoutId="sidebar-active"
            className="absolute left-0 h-6 w-1 rounded-r-full bg-primary"
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
          />
        )}
      </Link>
    );

    if (sidebarCollapsed) {
      return (
        <TooltipProvider key={item.href} delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>{content}</TooltipTrigger>
            <TooltipContent side="right" className="font-medium">
              {item.label}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return <div key={item.href} className="relative">{content}</div>;
  };

  return (
    <motion.aside
      animate={{ width: sidebarCollapsed ? 64 : 240 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="sticky top-14 z-30 flex h-[calc(100vh-3.5rem)] flex-col border-r border-border bg-background"
    >
      {/* Logo */}
      <div className="flex h-12 items-center gap-2 px-4">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary">
          <Layers className="h-4 w-4 text-primary-foreground" />
        </div>
        {!sidebarCollapsed && (
          <span className="text-base font-bold">AgentStack</span>
        )}
      </div>

      {/* Main nav */}
      <ScrollArea className="flex-1 px-2 py-2">
        <nav className="flex flex-col gap-1">{mainNav.map(renderItem)}</nav>

        <div className="my-4 border-t border-border" />

        <nav className="flex flex-col gap-1">{bottomNav.map(renderItem)}</nav>
      </ScrollArea>

      {/* Collapse toggle */}
      <div className="border-t border-border p-2">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-center"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        >
          <ChevronLeft
            className={cn(
              "h-4 w-4 transition-transform",
              sidebarCollapsed && "rotate-180"
            )}
          />
          {!sidebarCollapsed && (
            <span className="ml-2 text-xs">Collapse</span>
          )}
        </Button>
      </div>
    </motion.aside>
  );
}
