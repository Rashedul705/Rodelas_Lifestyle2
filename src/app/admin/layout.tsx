import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
        <AdminSidebar />
        <main className="flex-1 bg-muted/30">{children}</main>
    </SidebarProvider>
  );
}
