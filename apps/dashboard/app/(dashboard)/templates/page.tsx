import type { Metadata } from "next";
import { TemplatePackGrid } from "@/components/dashboard/template-pack-grid";

export const metadata: Metadata = { title: "Templates - AgentStack" };

/** Browse template packs: Research, Engineering, Marketing, Support, DevOps */
export default function TemplatesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Template Packs</h1>
        <p className="text-muted-foreground">
          Pre-built agent teams ready to deploy in one click
        </p>
      </div>
      <TemplatePackGrid />
    </div>
  );
}
