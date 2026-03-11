"use client";

import { useState } from "react";
import {
  Settings,
  Wrench,
  Brain,
  Clock,
  Save,
  RotateCcw,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Agent, AgentConfig as AgentConfigType } from "@/types/agent";

interface AgentConfigProps {
  agent: Agent;
  onSave?: (config: AgentConfigType) => void;
  isSaving?: boolean;
}

const models = [
  { value: "gpt-4o", label: "GPT-4o" },
  { value: "gpt-4-turbo", label: "GPT-4 Turbo" },
  { value: "claude-3.5-sonnet", label: "Claude 3.5 Sonnet" },
  { value: "llama-3-70b", label: "Llama 3 70B" },
  { value: "mistral-large", label: "Mistral Large" },
];

export function AgentConfig({ agent, onSave, isSaving }: AgentConfigProps) {
  const [config, setConfig] = useState<AgentConfigType>(agent.config);
  const [activeTab, setActiveTab] = useState("general");

  const handleSave = () => onSave?.(config);

  const handleReset = () => setConfig(agent.config);

  const isDirty = JSON.stringify(config) !== JSON.stringify(agent.config);

  return (
    <div className="space-y-6">
      {/* Header with save controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">{agent.name}</h2>
          <p className="text-sm text-muted-foreground">
            Configure agent behavior, tools, and scheduling.
          </p>
        </div>
        <div className="flex gap-2">
          {isDirty && (
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="mr-2 h-3.5 w-3.5" />
              Reset
            </Button>
          )}
          <Button
            size="sm"
            onClick={handleSave}
            disabled={!isDirty || isSaving}
          >
            <Save className="mr-2 h-3.5 w-3.5" />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="general" className="gap-1.5">
            <Settings className="h-3.5 w-3.5" /> General
          </TabsTrigger>
          <TabsTrigger value="tools" className="gap-1.5">
            <Wrench className="h-3.5 w-3.5" /> Tools
          </TabsTrigger>
          <TabsTrigger value="memory" className="gap-1.5">
            <Brain className="h-3.5 w-3.5" /> Memory
          </TabsTrigger>
          <TabsTrigger value="schedule" className="gap-1.5">
            <Clock className="h-3.5 w-3.5" /> Schedule
          </TabsTrigger>
        </TabsList>

        {/* General Tab */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Model Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Select
                    value={config.model}
                    onValueChange={(v) =>
                      setConfig({ ...config, model: v })
                    }
                  >
                    <SelectTrigger id="model">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {models.map((m) => (
                        <SelectItem key={m.value} value={m.value}>
                          {m.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxTokens">Max Tokens</Label>
                  <Input
                    id="maxTokens"
                    type="number"
                    value={config.maxTokens}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        maxTokens: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Temperature</Label>
                  <span className="text-sm font-mono text-muted-foreground">
                    {config.temperature.toFixed(2)}
                  </span>
                </div>
                <Slider
                  value={[config.temperature]}
                  onValueChange={([v]) =>
                    setConfig({ ...config, temperature: v })
                  }
                  max={2}
                  step={0.01}
                  className="py-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Precise</span>
                  <span>Creative</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="systemPrompt">System Prompt</Label>
                <Textarea
                  id="systemPrompt"
                  rows={6}
                  value={config.systemPrompt}
                  onChange={(e) =>
                    setConfig({ ...config, systemPrompt: e.target.value })
                  }
                  placeholder="You are a helpful assistant that..."
                  className="font-mono text-sm"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tools Tab */}
        <TabsContent value="tools" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Available Tools</CardTitle>
            </CardHeader>
            <CardContent>
              {config.tools.length === 0 ? (
                <p className="text-sm text-muted-foreground py-8 text-center">
                  No tools configured. Add tools to extend your agent&apos;s
                  capabilities.
                </p>
              ) : (
                <div className="space-y-3">
                  {config.tools.map((tool) => (
                    <div
                      key={tool.id}
                      className="flex items-center justify-between rounded-lg border border-border p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                          <Wrench className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{tool.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {tool.description}
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={tool.enabled}
                        onCheckedChange={(checked) => {
                          setConfig({
                            ...config,
                            tools: config.tools.map((t) =>
                              t.id === tool.id
                                ? { ...t, enabled: checked }
                                : t
                            ),
                          });
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
              <Button variant="outline" className="mt-4 w-full" size="sm">
                + Add Tool
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Memory Tab */}
        <TabsContent value="memory" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Memory Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable Memory</Label>
                  <p className="text-xs text-muted-foreground">
                    Agents remember context across conversations.
                  </p>
                </div>
                <Switch
                  checked={config.memory.enabled}
                  onCheckedChange={(checked) =>
                    setConfig({
                      ...config,
                      memory: { ...config.memory, enabled: checked },
                    })
                  }
                />
              </div>

              {config.memory.enabled && (
                <>
                  <div className="space-y-2">
                    <Label>Provider</Label>
                    <Select
                      value={config.memory.provider}
                      onValueChange={(v: any) =>
                        setConfig({
                          ...config,
                          memory: { ...config.memory, provider: v },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="in-memory">In-Memory</SelectItem>
                        <SelectItem value="pinecone">Pinecone</SelectItem>
                        <SelectItem value="weaviate">Weaviate</SelectItem>
                        <SelectItem value="chroma">ChromaDB</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxMessages">Max Messages</Label>
                    <Input
                      id="maxMessages"
                      type="number"
                      value={config.memory.maxMessages}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          memory: {
                            ...config.memory,
                            maxMessages:
                              parseInt(e.target.value) || 0,
                          },
                        })
                      }
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Schedule Tab */}
        <TabsContent value="schedule" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Run Schedule</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable Schedule</Label>
                  <p className="text-xs text-muted-foreground">
                    Run this agent on a recurring schedule.
                  </p>
                </div>
                <Switch
                  checked={!!config.schedule}
                  onCheckedChange={(checked) =>
                    setConfig({
                      ...config,
                      schedule: checked
                        ? { cron: "0 * * * *", timezone: "UTC" }
                        : undefined,
                    })
                  }
                />
              </div>

              {config.schedule && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="cron">Cron Expression</Label>
                    <Input
                      id="cron"
                      value={config.schedule.cron}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          schedule: {
                            ...config.schedule!,
                            cron: e.target.value,
                          },
                        })
                      }
                      placeholder="0 * * * *"
                      className="font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Input
                      id="timezone"
                      value={config.schedule.timezone}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          schedule: {
                            ...config.schedule!,
                            timezone: e.target.value,
                          },
                        })
                      }
                      placeholder="UTC"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
