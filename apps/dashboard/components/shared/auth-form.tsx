"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, Github, Chrome, Layers } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

interface LoginFormProps {
    mode: "login" | "signup";
}

export function LoginForm({ mode }: LoginFormProps) {
    const router = useRouter();
    const supabase = createClient();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [oauthLoading, setOauthLoading] = useState<"google" | "github" | null>(null);

    const isLogin = mode === "login";

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
                toast.success("Welcome back!");
                router.push("/dashboard");
                router.refresh();
            } else {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: { emailRedirectTo: `${window.location.origin}/api/auth/callback` },
                });
                if (error) throw error;
                toast.success("Account created!");
                router.push("/verify-email");
            }
        } catch (err: any) {
            toast.error(err.message ?? "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    async function handleOAuth(provider: "google" | "github") {
        setOauthLoading(provider);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider,
                options: { redirectTo: `${window.location.origin}/api/auth/callback` },
            });
            if (error) throw error;
        } catch (err: any) {
            toast.error(err.message ?? "OAuth sign-in failed");
            setOauthLoading(null);
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
        >
            {/* Logo */}
            <div className="flex justify-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                    <Layers className="h-6 w-6 text-primary-foreground" />
                </div>
            </div>

            {/* OAuth Buttons */}
            <div className="grid grid-cols-2 gap-3">
                <Button
                    variant="outline"
                    onClick={() => handleOAuth("google")}
                    disabled={!!oauthLoading || isLoading}
                    className="gap-2"
                >
                    {oauthLoading === "google" ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Chrome className="h-4 w-4" />
                    )}
                    Google
                </Button>
                <Button
                    variant="outline"
                    onClick={() => handleOAuth("github")}
                    disabled={!!oauthLoading || isLoading}
                    className="gap-2"
                >
                    {oauthLoading === "github" ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Github className="h-4 w-4" />
                    )}
                    GitHub
                </Button>
            </div>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">or continue with email</span>
                </div>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="you@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder={isLogin ? "Your password" : "8+ characters"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={8}
                            disabled={isLoading}
                            className="pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                    {isLogin && (
                        <div className="text-right">
                            <Link href="/forgot-password" className="text-xs text-muted-foreground hover:text-foreground">
                                Forgot password?
                            </Link>
                        </div>
                    )}
                </div>

                <Button type="submit" className="w-full" disabled={isLoading || !!oauthLoading}>
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {isLogin ? "Signing in..." : "Creating account..."}
                        </>
                    ) : isLogin ? (
                        "Sign in"
                    ) : (
                        "Create account"
                    )}
                </Button>
            </form>

            {/* Toggle Link */}
            <p className="text-center text-sm text-muted-foreground">
                {isLogin ? (
                    <>
                        Don&apos;t have an account?{" "}
                        <Link href="/signup" className="font-medium text-primary hover:underline">
                            Sign up
                        </Link>
                    </>
                ) : (
                    <>
                        Already have an account?{" "}
                        <Link href="/login" className="font-medium text-primary hover:underline">
                            Sign in
                        </Link>
                    </>
                )}
            </p>
        </motion.div>
    );
}
