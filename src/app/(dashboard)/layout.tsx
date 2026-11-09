import { redirect } from "next/navigation";
import { DashboardTopbar, Sidebar } from "@/components/layout/sidebar";
import { getSupabasePublicConfig } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

async function requireDashboardAccess() {
  if (!getSupabasePublicConfig()) {
    redirect("/login?error=auth-config");
  }

  let authenticated = false;
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.getUser();
    authenticated = !error && Boolean(data.user);
  } catch {
    redirect("/login?error=auth-unavailable");
  }

  if (!authenticated) redirect("/login");

  // No approved PostgreSQL profile/role schema exists yet. Never infer a
  // privileged role from browser state or editable Auth metadata.
  redirect("/acceso-pendiente");
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireDashboardAccess();

  return (
    <div className="min-h-screen bg-[#fafaf9] text-[#171717]">
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="min-w-0 flex-1">
          <DashboardTopbar />
          <main className="mx-auto w-full max-w-[1600px] p-5 md:p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}