// import "./globals.css";

import { Sidebar } from "@/features/common/layout/Sidebar";
import Topbar from "@/features/common/layout/Topbar";

export default function DashboardLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="min-h-full flex">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
