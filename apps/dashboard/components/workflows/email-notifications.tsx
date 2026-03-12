"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function EmailNotifications() {
  const [settings, setSettings] = useState({
    execution_complete: true,
    daily_summary: false,
    weekly_report: false,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/v1/notifications/email/settings");
      if (res.ok) {
        setSettings(await res.json());
      }
    } catch (error) {
      console.error("Failed to fetch settings");
    }
  };

  const updateSettings = async (newSettings: typeof settings) => {
    setSettings(newSettings);
    try {
      await fetch("/api/v1/notifications/email/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSettings),
      });
      toast.success("Settings updated");
    } catch (error) {
      toast.error("Failed to update settings");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Notifications</CardTitle>
        <CardDescription>Manage your email notification preferences</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="execution-complete">Execution Complete</Label>
          <Switch
            id="execution-complete"
            checked={settings.execution_complete}
            onCheckedChange={(checked) => updateSettings({ ...settings, execution_complete: checked })}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="daily-summary">Daily Summary</Label>
          <Switch
            id="daily-summary"
            checked={settings.daily_summary}
            onCheckedChange={(checked) => updateSettings({ ...settings, daily_summary: checked })}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="weekly-report">Weekly Report</Label>
          <Switch
            id="weekly-report"
            checked={settings.weekly_report}
            onCheckedChange={(checked) => updateSettings({ ...settings, weekly_report: checked })}
          />
        </div>
      </CardContent>
    </Card>
  );
}
