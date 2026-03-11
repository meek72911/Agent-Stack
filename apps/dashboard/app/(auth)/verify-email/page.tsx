import type { Metadata } from "next";
import { Mail, ArrowRight, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = { title: "Verify Email - AgentStack" };

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm text-center space-y-8">
        <div className="flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                <Mail className="h-6 w-6 text-primary" />
            </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Check your email</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We&apos;ve sent a verification link to your email address. 
            Please click the link to confirm your account and get started.
          </p>
        </div>

        <div className="rounded-xl border bg-muted/30 p-4 text-left flex items-start gap-4">
            <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center shrink-0">
                <span className="text-[10px] font-bold text-green-600">TIP</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
                If you don&apos;t see the email, check your spam folder or wait 2-3 minutes.
            </p>
        </div>

        <div className="pt-2 flex flex-col gap-3">
            <Button asChild className="w-full gap-2">
                <Link href="/login">
                    Back to login
                    <ArrowRight className="h-4 w-4" />
                </Link>
            </Button>
            <p className="text-xs text-muted-foreground">
                Didn&apos;t receive it? <button className="font-medium text-primary hover:underline">Resend email</button>
            </p>
        </div>
      </div>
    </div>
  );
}
