"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, Settings, LogOut, User, ChevronDown, Layers, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@/hooks/use-user";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export function DashboardHeader() {
    const router = useRouter();
    const { user } = useUser();
    const supabase = createClient();

    const initials =
        user?.user_metadata?.full_name
            ?.split(" ")
            .map((n: string) => n[0])
            .join("")
            .toUpperCase() ??
        user?.email?.[0]?.toUpperCase() ??
        "U";

    async function handleLogout() {
        const { error } = await supabase.auth.signOut();
        if (error) {
            toast.error("Failed to sign out");
        } else {
            router.push("/login");
            router.refresh();
        }
    }

    return (
        <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:px-6">
            {/* Search */}
            <div className="relative hidden flex-1 max-w-md sm:flex">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <Input
                    placeholder="Search agents, workflows..."
                    className="h-9 pl-9 bg-muted/50"
                />
            </div>

            <div className="ml-auto flex items-center gap-2">
                {/* Notifications */}
                <Button variant="ghost" size="icon" className="relative h-9 w-9">
                    <Bell className="h-4 w-4" />
                    <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                        3
                    </span>
                </Button>

                {/* User Menu */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="flex h-9 items-center gap-2 px-2">
                            <Avatar className="h-7 w-7">
                                <AvatarImage src={user?.user_metadata?.avatar_url} />
                                <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                            </Avatar>
                            <span className="hidden text-sm font-medium lg:inline-block">
                                {user?.user_metadata?.full_name ?? user?.email?.split("@")[0] ?? "User"}
                            </span>
                            <ChevronDown className="h-3 w-3 text-muted-foreground" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <div className="px-2 py-1.5">
                            <p className="text-sm font-medium">{user?.user_metadata?.full_name ?? "User"}</p>
                            <p className="text-xs text-muted-foreground">{user?.email}</p>
                        </div>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href="/settings" className="flex items-center gap-2">
                                <Settings className="h-4 w-4" /> Settings
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={handleLogout}
                            className="text-destructive focus:text-destructive"
                        >
                            <LogOut className="mr-2 h-4 w-4" /> Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
