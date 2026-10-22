// import "./globals.css";

import { Sidebar } from "@/features/common/layout/Sidebar";
import Topbar from "@/features/common/layout/Topbar";

export default function DashboardLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex h-dvh overflow-hidden">
      <Sidebar />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="min-h-0 min-w-0 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
