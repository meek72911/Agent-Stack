import type { Metadata } from "next";
import { TeamSettings } from "@/components/dashboard/team-settings";

export const metadata: Metadata = { title: "Team - AgentStack" };

/** Team management (Phase 2 -- stub for now) */
export default function TeamPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Team</h1>
        <p className="text-muted-foreground">
          Invite team members and manage roles
        </p>
      </div>
      <TeamSettings />
    </div>
  );
}
