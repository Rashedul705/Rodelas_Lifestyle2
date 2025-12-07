
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import React from "react";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen w-full bg-muted/40">
      <AdminSidebar />
      <div className="flex flex-col flex-1">
        <header className="flex h-16 items-center border-b bg-background px-6 shrink-0">
            {/* Header content can go here if needed, or it can be removed */}
        </header>
        <main className="flex-1 overflow-y-auto">
            {children}
        </main>
      </div>
    </div>
  );
}
