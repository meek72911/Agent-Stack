"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, Play, Trash2 } from "lucide-react";

export function Scheduler() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" /> Workflow Scheduler
        </CardTitle>
        <CardDescription>
          Schedule workflows to run automatically using cron expressions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Workflow</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select workflow" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="workflow1">Daily Report Generation</SelectItem>
                <SelectItem value="workflow2">Data Sync</SelectItem>
                <SelectItem value="workflow3">Backup Process</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Timezone</Label>
            <Select defaultValue="utc">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="utc">UTC</SelectItem>
                <SelectItem value="est">Eastern Time</SelectItem>
                <SelectItem value="pst">Pacific Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label>Cron Expression</Label>
          <Input placeholder="0 9 * * 1-5 (9 AM weekdays)" />
          <p className="text-xs text-muted-foreground mt-1">
            Format: minute hour day month weekday (e.g., "0 9 * * 1-5" for 9 AM weekdays)
          </p>
        </div>
        <Button className="w-full">
          <Play className="h-4 w-4 mr-2" /> Schedule Workflow
        </Button>

        {/* Existing Schedules */}
        <div className="mt-6 space-y-2">
          <h4 className="font-medium">Scheduled Workflows</h4>
          <div className="border rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Daily Report</p>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Clock className="h-3 w-3" /> 9:00 AM UTC (Mon-Fri)
                </p>
              </div>
              <Button variant="ghost" size="sm">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
