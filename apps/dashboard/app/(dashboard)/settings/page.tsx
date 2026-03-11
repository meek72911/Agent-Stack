import type { Metadata } from "next";
import { GeneralSettings } from "@/components/dashboard/general-settings";

export const metadata: Metadata = { title: "Settings - AgentStack" };

/** General account settings: profile, tenant name, preferences */
export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and workspace preferences
        </p>
      </div>
      <GeneralSettings />
    </div>
  );
}
