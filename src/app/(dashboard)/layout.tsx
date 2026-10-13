import { DashboardTopbar, Sidebar } from "@/components/layout/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#fafaf9] text-[#171717]">
      <Sidebar />
      <div className="min-w-0 flex-1">
        <DashboardTopbar />
        <main className="mx-auto w-full max-w-[1600px] p-5 md:p-8">{children}</main>
      </div>
    </div>
  );
}