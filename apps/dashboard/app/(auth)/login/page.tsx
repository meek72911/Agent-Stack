import type { Metadata } from "next";
import { LoginForm } from "@/components/shared/auth-form";

export const metadata: Metadata = { title: "Log In - AgentStack" };

/** Login page with email/password + OAuth */
export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Log in to your AgentStack account
          </p>
        </div>
        <LoginForm mode="login" />
      </div>
    </div>
  );
}
