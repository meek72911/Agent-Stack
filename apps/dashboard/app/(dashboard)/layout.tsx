import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { DashboardSidebar } from "@/components/shared/sidebar";
import { DashboardHeader } from "@/components/shared/dashboard-header";
import { CommandPalette } from "@/components/shared/command-palette";

/** Authenticated dashboard layout with sidebar + auth guard */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
      <CommandPalette />
    </div>
  );
}
