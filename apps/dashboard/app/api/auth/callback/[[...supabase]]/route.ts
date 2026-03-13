import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");
    const next = requestUrl.searchParams.get("next") ?? "/dashboard";

    if (code) {
        try {
            const supabase = createServerClient();
            const { data, error } = await supabase.auth.exchangeCodeForSession(code);

            if (error) {
                console.error("Auth callback exchange error:", error);
                return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(error.message)}`, request.url));
            }

            if (data.user) {
                // Check if new user — redirect to onboarding
                const isNew = !data.user.user_metadata?.onboarded;
                if (isNew) {
                    return NextResponse.redirect(new URL("/onboarding", request.url));
                }
            }
        } catch (err: any) {
            console.error("Auth callback crash:", err);
            return NextResponse.redirect(new URL(`/login?error=Internal Server Error during auth`, request.url));
        }
    }

    return NextResponse.redirect(new URL(next, request.url));
}
