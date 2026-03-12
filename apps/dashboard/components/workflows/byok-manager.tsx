"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Plus, Key, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

interface ApiKey {
  id: string;
  name: string;
  provider: string;
  created_at: string;
  last_used: string | null;
}

export function ByokManager() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [showKey, setShowKey] = useState(false);
  const [newKey, setNewKey] = useState({
    name: "",
    provider: "openai",
    plain_key: "",
  });

  useEffect(() => {
    fetchKeys();
  }, []);

  const fetchKeys = async () => {
    try {
      const res = await fetch("/api/v1/byok");
      const data = await res.json();
      setKeys(data.keys || []);
    } catch (error) {
      console.error("Failed to fetch keys:", error);
    } finally {
      setLoading(false);
    }
  };

  const createKey = async () => {
    if (!newKey.name || !newKey.plain_key) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const res = await fetch("/api/v1/byok", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newKey),
      });

      if (res.ok) {
        toast.success("API Key created successfully");
        setNewKey({ name: "", provider: "openai", plain_key: "" });
        fetchKeys();
      } else {
        toast.error("Failed to create key");
      }
    } catch (error) {
      toast.error("Failed to create key");
    }
  };

  const deleteKey = async (id: string) => {
    try {
      const res = await fetch(`/api/v1/byok/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Key deleted");
        fetchKeys();
      }
    } catch (error) {
      toast.error("Failed to delete key");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" /> API Key Management
          </CardTitle>
          <CardDescription>
            Manage your encrypted API keys for AI providers (AES-256)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add New Key */}
          <div className="grid grid-cols-3 gap-4 items-end">
            <div>
              <Label>Name</Label>
              <Input
                placeholder="My OpenAI Key"
                value={newKey.name}
                onChange={(e) => setNewKey({ ...newKey, name: e.target.value })}
              />
            </div>
            <div>
              <Label>Provider</Label>
              <Select
                value={newKey.provider}
                onValueChange={(v) => setNewKey({ ...newKey, provider: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="openai">OpenAI</SelectItem>
                  <SelectItem value="anthropic">Anthropic</SelectItem>
                  <SelectItem value="claude">Claude</SelectItem>
                  <SelectItem value="gemini">Gemini</SelectItem>
                  <SelectItem value="mistral">Mistral</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>API Key</Label>
              <div className="flex gap-2">
                <Input
                  type={showKey ? "text" : "password"}
                  placeholder="sk-..."
                  value={newKey.plain_key}
                  onChange={(e) => setNewKey({ ...newKey, plain_key: e.target.value })}
                />
                <Button variant="outline" size="icon" onClick={() => setShowKey(!showKey)}>
                  {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>
          <Button onClick={createKey} className="w-full">
            <Plus className="h-4 w-4 mr-2" /> Add Encrypted Key
          </Button>

          {/* Existing Keys */}
          <div className="space-y-2 mt-6">
            <h4 className="font-medium">Your Keys</h4>
            {keys.length === 0 ? (
              <p className="text-sm text-muted-foreground">No API keys added yet.</p>
            ) : (
              keys.map((key) => (
                <div key={key.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{key.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {key.provider} • Created {new Date(key.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Button variant="destructive" size="sm" onClick={() => deleteKey(key.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
