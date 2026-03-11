"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type TimeRange = "7d" | "30d" | "90d";

const ranges: { label: string; value: TimeRange }[] = [
  { label: "7 days", value: "7d" },
  { label: "30 days", value: "30d" },
  { label: "90 days", value: "90d" },
];

// Placeholder chart data
const mockData = {
  "7d": [42, 58, 35, 67, 80, 72, 90],
  "30d": Array.from({ length: 30 }, () => Math.floor(Math.random() * 100 + 20)),
  "90d": Array.from({ length: 90 }, () => Math.floor(Math.random() * 150 + 30)),
};

export function UsageChart() {
  const [range, setRange] = useState<TimeRange>("7d");
  const data = mockData[range];
  const max = Math.max(...data);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">
          Executions Over Time
        </CardTitle>
        <div className="flex gap-1">
          {ranges.map((r) => (
            <Button
              key={r.value}
              variant={range === r.value ? "secondary" : "ghost"}
              size="sm"
              className="h-7 px-2.5 text-xs"
              onClick={() => setRange(r.value)}
            >
              {r.label}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        {/* Simple bar chart visualization */}
        <div className="mt-4 flex h-64 items-end gap-[2px]">
          {data.map((value, i) => (
            <div
              key={i}
              className="group relative flex-1"
              style={{ height: "100%" }}
            >
              <div
                className={cn(
                  "absolute bottom-0 w-full rounded-t-sm bg-primary/80 transition-all group-hover:bg-primary",
                )}
                style={{ height: `${(value / max) * 100}%` }}
              />
              {/* Tooltip on hover */}
              <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 rounded bg-popover px-2 py-1 text-xs font-medium shadow opacity-0 transition-opacity group-hover:opacity-100">
                {value}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {range === "7d"
              ? "Mon"
              : range === "30d"
              ? "30 days ago"
              : "90 days ago"}
          </span>
          <span>Today</span>
        </div>
      </CardContent>
    </Card>
  );
}
