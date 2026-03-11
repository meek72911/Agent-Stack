"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
    Check, Zap, Rocket, Shield, 
    Globe, Users, Clock, Database, BarChart3,
    ArrowRight, Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip";

const PLANS = [
    {
        name: "Free",
        priceMonthly: 0,
        priceYearly: 0,
        description: "Perfect for testing and personal side projects.",
        features: ["3 Workflows", "5 Agents", "100 runs/mo", "10MB uploads", "1 Member", "Basic Analytics"],
        icon: Shield,
        cta: "Current Plan",
        variant: "outline"
    },
    {
        name: "Pro",
        priceMonthly: 49,
        priceYearly: 490,
        description: "For creators and power users automating their business.",
        features: ["Unlimited Workflows", "Unlimited Agents", "5,000 runs/mo", "50MB uploads", "3 Members", "Full Execution Trace", "Priority Support"],
        icon: Zap,
        cta: "Upgrade to Pro",
        featured: true,
        variant: "default"
    },
    {
        name: "Team",
        priceMonthly: 149,
        priceYearly: 1490,
        description: "Collaborative features for studios and agencies.",
        features: ["Unlimited everything", "100MB uploads", "10 Members", "Client Workspaces", "Shared Context (Memory)", "Custom Branding", "dedicated Account Manager"],
        icon: Rocket,
        cta: "Upgrade to Team",
        variant: "outline"
    }
];

export function BillingOverview() {
    const [isYearly, setIsYearly] = useState(false);

    return (
        <div className="space-y-8 pb-10">
            {/* Current Usage */}
            <Card className="overflow-hidden">
                <div className="bg-primary/5 p-4 border-b">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <h3 className="text-sm font-semibold flex items-center gap-2">
                                <Shield className="h-4 w-4 text-primary" />
                                Current Plan: Free
                            </h3>
                            <p className="text-xs text-muted-foreground">Your billing cycle resets in 12 days (March 23, 2026)</p>
                        </div>
                        <Badge variant="outline" className="h-6">LIFETIME ACCESS</Badge>
                    </div>
                </div>
                <CardContent className="p-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                <span className="flex items-center gap-1.5"><Zap className="h-3 w-3" /> Executions</span>
                                <span>28 / 100 used</span>
                            </div>
                            <Progress value={28} className="h-2" />
                            <p className="text-[10px] text-muted-foreground">You have used 28% of your monthly execution limit.</p>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3 rounded-lg border bg-muted/20 p-3">
                                <Info className="h-4 w-4 text-primary mt-0.5" />
                                <div className="space-y-1">
                                    <p className="text-xs font-medium">Coming soon: Automated top-ups</p>
                                    <p className="text-[10px] text-muted-foreground leading-relaxed">
                                        Soon you will be able to buy extra execution packs without upgrading your entire plan.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Pricing Toggle */}
            <div className="flex flex-col items-center gap-4 py-4">
                <div className="flex items-center gap-3">
                    <span className={`text-sm ${!isYearly ? "font-bold text-foreground" : "text-muted-foreground"}`}>Monthly</span>
                    <Switch checked={isYearly} onCheckedChange={setIsYearly} />
                    <span className={`text-sm ${isYearly ? "font-bold text-foreground" : "text-muted-foreground"}`}>Yearly</span>
                    <Badge variant="secondary" className="ml-2 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        2 months free
                    </Badge>
                </div>
            </div>

            {/* Plan Cards */}
            <div className="grid gap-6 lg:grid-cols-3">
                {PLANS.map((plan, i) => (
                    <motion.div
                        key={plan.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <Card className={`relative h-full flex flex-col transition-all hover:shadow-xl ${
                            plan.featured ? "border-primary shadow-lg scale-105 z-10" : ""
                        }`}>
                            {plan.featured && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary-foreground">
                                    Most Popular
                                </div>
                            )}
                            <CardHeader>
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20 mb-2">
                                    <plan.icon className="h-5 w-5 text-primary" />
                                </div>
                                <CardTitle className="text-xl">{plan.name}</CardTitle>
                                <div className="mt-2 flex items-baseline gap-1">
                                    <span className="text-3xl font-bold">
                                        ${isYearly ? plan.priceYearly : plan.priceMonthly}
                                    </span>
                                    <span className="text-sm text-muted-foreground">
                                        /{isYearly ? "year" : "mo"}
                                    </span>
                                </div>
                                <CardDescription className="pt-2 text-xs leading-relaxed min-h-[40px]">
                                    {plan.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <div className="space-y-2.5">
                                    {plan.features.map((feature) => (
                                        <div key={feature} className="flex items-center gap-2 text-xs">
                                            <Check className="h-3.5 w-3.5 text-green-500" />
                                            <span>{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button 
                                    className="w-full gap-2 font-bold" 
                                    variant={plan.variant as any}
                                    disabled={plan.name === "Free"}
                                >
                                    {plan.cta}
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </CardFooter>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Detailed Feature Table */}
            <div className="overflow-hidden rounded-xl border bg-card">
                <div className="p-4 border-b bg-muted/30">
                    <h3 className="text-sm font-bold">Detailed Plan Comparison</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead>
                            <tr className="border-b bg-muted/10">
                                <th className="p-4 font-medium text-muted-foreground">Feature</th>
                                <th className="p-4 font-medium">Free</th>
                                <th className="p-4 font-medium">Pro</th>
                                <th className="p-4 font-medium">Team</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {[
                                { f: "Workflows", free: "3", pro: "Unlimited", team: "Unlimited" },
                                { f: "Agents", free: "5", pro: "Unlimited", team: "Unlimited" },
                                { f: "Runs / mo", free: "100", pro: "5,000", team: "25,000+" },
                                { f: "Upload Size", free: "10MB", pro: "50MB", team: "100MB+" },
                                { f: "Tracing", free: "Basic", pro: "Advanced (14d)", team: "Archive (90d)" },
                                { f: "Team Members", free: "1", pro: "3", team: "10 included" },
                                { f: "API Access", free: "Limited", pro: "Full", team: "High-throughput" },
                                { f: "Support", free: "Community", pro: "Priority", team: "Dedicated Slack" },
                            ].map((row) => (
                                <tr key={row.f} className="hover:bg-muted/30 transition-colors">
                                    <td className="p-4 font-medium">{row.f}</td>
                                    <td className="p-4 text-muted-foreground">{row.free}</td>
                                    <td className="p-4 font-semibold">{row.pro}</td>
                                    <td className="p-4 text-muted-foreground">{row.team}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
