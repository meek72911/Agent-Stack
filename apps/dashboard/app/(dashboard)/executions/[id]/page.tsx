import type { Metadata } from "next";
import { ExecutionTraceViewer } from "@/components/workflows/execution-trace";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Share2, MoreVertical } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "Execution Trace - AgentStack" };

export default function ExecutionPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
                <Link href="/workflows">
                    <ChevronLeft className="h-5 w-5" />
                </Link>
            </Button>
            <div>
                <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold tracking-tight">Execution Trace</h1>
                    <Badge variant="outline" className="font-mono text-[10px]">{params.id}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                    Orchestrating Market Intelligence Engine
                </p>
            </div>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
                <Share2 className="h-4 w-4" /> Share
            </Button>
            <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
            </Button>
        </div>
      </div>

      <ExecutionTraceViewer />
    </div>
  );
}
