"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Bot, CheckCircle2, Circle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAgents } from "@/hooks/use-agents";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import type { Agent } from "@/types/agent";

const CATEGORIES = ["All", "Marketing", "Engineering", "Research", "Sales", "Operations", "Product"];

export function AgentFilters({ onSearch, onCategory }: { onSearch?: (q: string) => void; onCategory?: (c: string) => void }) {
    const [search, setSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");

    function handleSearch(val: string) {
        setSearch(val);
        onSearch?.(val);
    }

    function handleCategory(cat: string) {
        setActiveCategory(cat);
        onCategory?.(cat === "All" ? "" : cat);
    }

    return (
        <div className="space-y-3">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <Input
                    placeholder="Search agents..."
                    className="pl-9"
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                />
            </div>
            <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                    <Button
                        key={cat}
                        variant={activeCategory === cat ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleCategory(cat)}
                        className="h-7 text-xs"
                    >
                        {cat}
                    </Button>
                ))}
            </div>
        </div>
    );
}

function AgentCardSkeleton() {
    return (
        <Card>
            <CardHeader className="pb-2">
                <Skeleton className="h-8 w-8 rounded-lg" />
                <Skeleton className="h-4 w-1/2 mt-2" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-3 w-full mb-1" />
                <Skeleton className="h-3 w-3/4" />
                <Skeleton className="h-8 w-full mt-4" />
            </CardContent>
        </Card>
    );
}

function AgentCard({ agent }: { agent: Agent }) {
    const [isActivating, setIsActivating] = useState(false);
    const [isActive, setIsActive] = useState(agent.is_active ?? false);
    const supabase = createClient();

    async function toggleActivation() {
        setIsActivating(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;
            const endpoint = isActive ? "deactivate" : "activate";
            const res = await fetch(`/api/v1/agents/${agent.id}/${endpoint}`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Toggle failed");
            setIsActive(!isActive);
            toast.success(isActive ? "Agent deactivated" : "Agent activated");
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setIsActivating(false);
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
        >
            <Card className="h-full hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <Bot className="h-5 w-5" />
                        </div>
                        {isActive ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : (
                            <Circle className="h-4 w-4 text-muted-foreground/40" />
                        )}
                    </div>
                    <div className="mt-2">
                        <p className="font-semibold text-sm leading-tight">{agent.name}</p>
                        {agent.category && (
                            <Badge variant="outline" className="mt-1 text-xs">{agent.category}</Badge>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                    <p className="text-xs text-muted-foreground line-clamp-3">
                        {agent.description ?? agent.role}
                    </p>
                    <Button
                        variant={isActive ? "outline" : "default"}
                        size="sm"
                        className="w-full"
                        onClick={toggleActivation}
                        disabled={isActivating}
                    >
                        {isActivating ? "..." : isActive ? "Deactivate" : "Activate"}
                    </Button>
                </CardContent>
            </Card>
        </motion.div>
    );
}

export function AgentGrid() {
    const [category, setCategory] = useState("");
    const [search, setSearch] = useState("");
    const { agents, isLoading, error } = useAgents(category || undefined);

    const filtered = search
        ? agents.filter((a) =>
            a.name.toLowerCase().includes(search.toLowerCase()) ||
            (a.description ?? "").toLowerCase().includes(search.toLowerCase())
        )
        : agents;

    if (isLoading) {
        return (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 12 }).map((_, i) => <AgentCardSkeleton key={i} />)}
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-6 text-center">
                <p className="text-sm font-medium text-destructive">Failed to load agents</p>
            </div>
        );
    }

    return (
        <>
            <AgentFilters onSearch={setSearch} onCategory={setCategory} />
            <p className="text-sm text-muted-foreground mt-4 mb-2">{filtered.length} agents</p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filtered.map((agent) => (
                    <AgentCard key={agent.id} agent={agent} />
                ))}
            </div>
        </>
    );
}
