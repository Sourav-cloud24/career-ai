"use client";

import { Bell } from "lucide-react";

type TopbarProps = {
  user?: {
    name: string;
    initials?: string;
  };
};

const Topbar = ({ user = { name: "John Doe" } }: TopbarProps) => {
  const initials =
    user.initials ??
    user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  return (
    <div className="flex w-full items-center justify-end gap-4 border-b border-line px-7 py-4">
      <button
        type="button"
        aria-label="Notifications"
        className="relative text-muted hover:text-ink transition-colors"
      >
        <Bell className="h-[18px] w-[18px]" strokeWidth={1.6} />
      </button>

      <button
        type="button"
        className="flex items-center gap-2 text-[13.5px] text-ink"
      >
        <span className="flex h-6.5 w-6.5 items-center justify-center rounded-full bg-violet text-[11px] font-semibold text-white">
          {initials}
        </span>
        {user.name}
      </button>
    </div>
  );
};

export default Topbar;