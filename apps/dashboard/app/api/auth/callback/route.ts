import { NextRequest, NextResponse } from "next/server";
import { createServerClient as createSupabase } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * OAuth callback handler — Supabase redirects here after Google/GitHub auth.
 * Exchanges the auth code for a session and redirects to onboarding or dashboard.
 */
export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");
    const next = requestUrl.searchParams.get("next") ?? "/dashboard";

    if (code) {
        const cookieStore = cookies();
        const supabase = createSupabase(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) { return cookieStore.get(name)?.value; },
                    set(name: string, value: string, options: Record<string, unknown>) {
                        try { cookieStore.set({ name, value, ...options as any }); } catch { }
                    },
                    remove(name: string, options: Record<string, unknown>) {
                        try { cookieStore.set({ name, value: "", ...options as any }); } catch { }
                    },
                },
            }
        );

        const { data, error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error && data.user) {
            // Check if new user — redirect to onboarding
            const isNew = !data.user.user_metadata?.onboarded;
            if (isNew) {
                return NextResponse.redirect(new URL("/onboarding", requestUrl.origin));
            }
        }
    }

    return NextResponse.redirect(new URL(next, requestUrl.origin));
}
