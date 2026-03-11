"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Grid,
  List,
  Link2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Zap,
  Mail,
  Slack,
  Figma,
  Github,
  Cloud,
  Database,
  Settings,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// MCP App Types
interface MCPApp {
  id: string;
  name: string;
  category: string;
  description: string;
  status: "connected" | "disconnected" | "needs-reauth";
  icon?: React.ReactNode;
  apps?: string[]; // Sub-apps in category
}

// Sample MCP Apps data
const mcpApps: MCPApp[] = [
  {
    id: "email",
    name: "Email Apps",
    category: "Communication",
    description: "Connect Gmail, Outlook, and other email providers",
    status: "disconnected",
    icon: <Mail className="h-6 w-6" />,
    apps: ["Gmail", "Outlook", "Yahoo Mail"],
  },
  {
    id: "slack",
    name: "Slack",
    category: "Communication",
    description: "Connect Slack for notifications and actions",
    status: "connected",
    icon: <Slack className="h-6 w-6" />,
  },
  {
    id: "notion",
    name: "Notion",
    category: "Productivity",
    description: "Read and write to Notion databases",
    status: "connected",
    icon: <FileText className="h-6 w-6" />,
  },
  {
    id: "github",
    name: "GitHub",
    category: "Development",
    description: "Repository management and issues",
    status: "disconnected",
    icon: <Github className="h-6 w-6" />,
  },
  {
    id: "figma",
    name: "Figma",
    category: "Design",
    description: "Read designs and export assets",
    status: "needs-reauth",
    icon: <Figma className="h-6 w-6" />,
  },
  {
    id: "database",
    name: "Database Apps",
    category: "Data",
    description: "PostgreSQL, MySQL, MongoDB connections",
    status: "disconnected",
    icon: <Database className="h-6 w-6" />,
    apps: ["PostgreSQL", "MySQL", "MongoDB"],
  },
  {
    id: "cloud-storage",
    name: "Cloud Storage",
    category: "Storage",
    description: "AWS S3, Google Drive, Dropbox",
    status: "disconnected",
    icon: <Cloud className="h-6 w-6" />,
    apps: ["AWS S3", "Google Drive", "Dropbox"],
  },
];

export function MCPMarketplace() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [connectingApp, setConnectingApp] = useState<string | null>(null);

  const categories = ["all", ...new Set(mcpApps.map((app) => app.category))];

  const filteredApps = mcpApps.filter((app) => {
    const matchesSearch =
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || app.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleConnect = (appId: string) => {
    setConnectingApp(appId);
    // Simulate connection process
    setTimeout(() => {
      setConnectingApp(null);
      // Update app status to connected
      console.log(`Connected to ${appId}`);
    }, 2000);
  };

  const getStatusIcon = (status: MCPApp["status"]) => {
    switch (status) {
      case "connected":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "needs-reauth":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Link2 className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: MCPApp["status"]) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      connected: "default",
      "needs-reauth": "secondary",
      disconnected: "outline",
    };
    return (
      <Badge variant={variants[status]} className="capitalize">
        {status.replace("-", " ")}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">MCP Marketplace</h2>
          <p className="text-sm text-muted-foreground">
            One-click connect to 3,000+ apps via Pipedream Connect
          </p>
        </div>
        <Badge variant="outline" className="text-xs">
          <Zap className="h-3 w-3 mr-1" />
          Powered by Pipedream
        </Badge>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search apps..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
              className="capitalize"
            >
              {cat === "all" ? "All Apps" : cat}
            </Button>
          ))}
        </div>
      </div>

      {/* App Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredApps.map((app, index) => (
          <motion.div
            key={app.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Card className={cn(
              "hover:border-[#F97316] transition-all cursor-pointer",
              connectingApp === app.id && "animate-pulse"
            )}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#F97316]/10 text-[#F97316]">
                      {app.icon || <Grid className="h-5 w-5" />}
                    </div>
                    <div>
                      <CardTitle className="text-base">{app.name}</CardTitle>
                      <CardDescription className="text-xs">{app.category}</CardDescription>
                    </div>
                  </div>
                  {getStatusIcon(app.status)}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">{app.description}</p>
                
                {/* Sub-apps */}
                {app.apps && (
                  <div className="mb-3 flex flex-wrap gap-1">
                    {app.apps.slice(0, 3).map((subApp) => (
                      <Badge key={subApp} variant="secondary" className="text-xs">
                        {subApp}
                      </Badge>
                    ))}
                    {app.apps.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{app.apps.length - 3}
                      </Badge>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  {getStatusBadge(app.status)}
                  <Button
                    size="sm"
                    variant={app.status === "connected" ? "outline" : "default"}
                    onClick={() => handleConnect(app.id)}
                    disabled={connectingApp !== null}
                    className={cn(
                      app.status === "connected" && "text-green-500 border-green-500",
                      connectingApp === app.id && "opacity-70"
                    )}
                  >
                    {connectingApp === app.id ? (
                      <>
                        Connecting...
                      </>
                    ) : app.status === "connected" ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        Connected
                      </>
                    ) : app.status === "needs-reauth" ? (
                      "Re-authenticate"
                    ) : (
                      "Connect"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Info Banner */}
      <div className="rounded-lg border border-[#F97316]/30 bg-[#F97316]/5 p-4">
        <div className="flex items-center gap-3">
          <Zap className="h-5 w-5 text-[#F97316]" />
          <div>
            <p className="text-sm font-medium">
              One-Click Setup
            </p>
            <p className="text-xs text-muted-foreground">
              No JSON editing. No terminal. No config files. Just click Connect.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
