"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authApi } from "@/features/auth/apis/auth.api";
import {
  LayoutDashboard,
  FileText,
  ClipboardList,
  BarChart3,
  Rocket,
  Settings,
  LogOut,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Resumes", href: "/resumes", icon: FileText },
  { label: "Job Descriptions", href: "/job-descriptions", icon: ClipboardList },
  { label: "Analysis", href: "/analysis", icon: BarChart3 },
  { label: "Preparation Plan", href: "/preparation-plan", icon: Rocket },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter()

  const handleLogout = () => {
    authApi.logoutUser()
    router.replace("/")
  }

  return (
    <aside className="flex h-full w-56 flex-none flex-col bg-ink p-3.5 text-white">
      {/* Brand */}
      <div className="mb-7 flex items-center gap-2 px-2">
        <svg viewBox="0 0 32 32" fill="none" className="h-[26px] w-[26px]">
          <rect width="32" height="32" rx="9" fill="#fff" fillOpacity=".12" />
          <path
            d="M9 21V13.5L16 9l7 4.5V21"
            stroke="#fff"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <circle cx="20" cy="12" r="1.4" fill="#fff" />
        </svg>
        <span className="font-sora text-base font-semibold">CareerAI</span>
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-0.5">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || pathname?.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13.5px] transition-colors ${
                active
                  ? "bg-indigo text-white"
                  : "text-white/60 hover:bg-white/5 hover:text-white/90"
              }`}
            >
              <Icon className="h-4 w-4 flex-none" strokeWidth={1.8} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="flex flex-col gap-0.5 border-t border-white/10 pt-2.5">
        {/* <Link
          href="/dashboard/settings"
          className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13.5px] text-white/60 transition-colors hover:bg-white/5 hover:text-white/90"
        >
          <Settings className="h-4 w-4 flex-none" strokeWidth={1.8} />
          Settings
        </Link> */}
        <button
          onClick={() => handleLogout()}
          className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13.5px] text-white/60 transition-colors hover:bg-white/5 hover:text-white/90"
        >
          <LogOut className="h-4 w-4 flex-none" strokeWidth={1.8} />
          Logout
        </button>
      </div>
    </aside>
  );
}