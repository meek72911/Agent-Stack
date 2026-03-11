import type { Metadata } from "next";
import { CommunityFeed } from "@/components/dashboard/community-feed";

export const metadata: Metadata = { title: "Community - AgentStack" };

/** Community contributions, shared workflows, bounties */
export default function CommunityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Community</h1>
        <p className="text-muted-foreground">
          Shared workflows, contributions, and bounties
        </p>
      </div>
      <CommunityFeed />
    </div>
  );
}
