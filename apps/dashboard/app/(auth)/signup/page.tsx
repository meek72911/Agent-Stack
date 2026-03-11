import type { Metadata } from "next";
import { LoginForm } from "@/components/shared/auth-form";

export const metadata: Metadata = { title: "Sign Up - AgentStack" };

/** Signup page with email/password + OAuth */
export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Get your AI product team running in 60 seconds
          </p>
        </div>
        <LoginForm mode="signup" />
      </div>
    </div>
  );
}
