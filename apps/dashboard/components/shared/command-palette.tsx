"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
    Search, Command as CommandIcon, Rocket, 
    Settings, Users, Zap, GitBranch, Bot,
    Plus, CreditCard, Key, BarChart3
} from "lucide-react";
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command";

export function CommandPalette() {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const runCommand = (action: () => void) => {
        setOpen(false);
        action();
    };

    return (
        <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput placeholder="Type a command or search..." />
            <CommandList className="max-h-[400px]">
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Quick Actions">
                    <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/workflows/builder"))}>
                        <Plus className="mr-2 h-4 w-4" />
                        <span>Run New Workflow</span>
                        <CommandShortcut>⌘N</CommandShortcut>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/settings/keys"))}>
                        <Key className="mr-2 h-4 w-4" />
                        <span>Add API Key</span>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/analytics"))}>
                        <BarChart3 className="mr-2 h-4 w-4" />
                        <span>View Usage</span>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/settings/team"))}>
                        <Users className="mr-2 h-4 w-4" />
                        <span>Invite Team Member</span>
                    </CommandItem>
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="Navigation">
                    <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/overview"))}>
                        <Rocket className="mr-2 h-4 w-4" />
                        <span>Dashboard Home</span>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/templates"))}>
                        <Zap className="mr-2 h-4 w-4" />
                        <span>Browse Templates</span>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/agents"))}>
                        <Bot className="mr-2 h-4 w-4" />
                        <span>My Agents</span>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/workflows"))}>
                        <GitBranch className="mr-2 h-4 w-4" />
                        <span>Workflows</span>
                    </CommandItem>
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="Settings">
                    <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/settings"))}>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>General Settings</span>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/settings/billing"))}>
                        <CreditCard className="mr-2 h-4 w-4" />
                        <span>Billing & Subscription</span>
                    </CommandItem>
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    );
}
