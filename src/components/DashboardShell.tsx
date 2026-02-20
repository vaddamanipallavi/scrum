"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { NotificationBell } from "@/components/NotificationBell";
import type { RoleValue } from "@/lib/auth-constants";

type DashboardShellProps = {
  children: React.ReactNode;
  role: RoleValue;
  userEmail: string;
};

type NavItem = {
  label: string;
  href: string;
  roles: RoleValue[];
};

const NAV_ITEMS: NavItem[] = [
  { label: "Overview", href: "/dashboard", roles: ["STUDENT", "WARDEN", "ADMIN"] },
  { label: "Student Home", href: "/dashboard/student", roles: ["STUDENT"] },
  { label: "Profile", href: "/dashboard/student/profile", roles: ["STUDENT"] },
  { label: "Room", href: "/dashboard/student/room", roles: ["STUDENT"] },
  { label: "Complaints", href: "/dashboard/student/complaints", roles: ["STUDENT"] },
  { label: "Leave Requests", href: "/dashboard/student/leave-requests", roles: ["STUDENT"] },
  { label: "Payments", href: "/dashboard/student/payments", roles: ["STUDENT"] },
  { label: "Announcements", href: "/dashboard/student/announcements", roles: ["STUDENT"] },
  { label: "Warden Home", href: "/dashboard/warden", roles: ["WARDEN", "ADMIN"] },
  { label: "Students", href: "/dashboard/warden/students", roles: ["WARDEN", "ADMIN"] },
  { label: "Rooms", href: "/dashboard/warden/rooms", roles: ["WARDEN", "ADMIN"] },
  { label: "Complaints", href: "/dashboard/warden/complaints", roles: ["WARDEN", "ADMIN"] },
  { label: "Leave Requests", href: "/dashboard/warden/leave-requests", roles: ["WARDEN", "ADMIN"] },
  { label: "Announcements", href: "/dashboard/warden/announcements", roles: ["WARDEN", "ADMIN"] },
  { label: "Admin Controls", href: "/dashboard/admin", roles: ["ADMIN"] },
  { label: "Analytics", href: "/dashboard/admin/analytics", roles: ["ADMIN"] },
  { label: "System Settings", href: "/dashboard/admin", roles: ["ADMIN"] },
];

export default function DashboardShell({
  children,
  role,
  userEmail,
}: DashboardShellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuItems = useMemo(
    () => NAV_ITEMS.filter((item) => item.roles.includes(role)),
    [role]
  );

  return (
    <div className="min-h-screen bg-zinc-50">
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-zinc-200 bg-white px-4 py-6 transition-transform duration-200 md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <Link href="/" className="text-sm font-semibold text-zinc-900">
            Hostel Management
          </Link>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="rounded-md p-2 text-zinc-500 hover:text-zinc-900 md:hidden"
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>
        <div className="mt-6 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-600">
          Role: <span className="font-semibold text-zinc-900">{role}</span>
        </div>
        <nav className="mt-6 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="block rounded-md px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100"
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {isOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/30 md:hidden"
          onClick={() => setIsOpen(false)}
          aria-label="Close menu overlay"
        />
      ) : null}

      <div className="min-h-screen md:pl-64">
        <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/95 backdrop-blur">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="rounded-md border border-zinc-200 px-2 py-1 text-sm text-zinc-600 md:hidden"
                aria-label="Open menu"
              >
                Menu
              </button>
              <span className="text-sm font-semibold text-zinc-900">
                Dashboard
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="hidden text-sm text-zinc-600 dark:text-zinc-400 md:block">
                {userEmail}
              </span>
              <NotificationBell />
              <ThemeToggle />
              <Link href="/login" className="text-sm text-zinc-600 dark:text-zinc-400">
                Switch account
              </Link>
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-10">{children}</main>
      </div>
    </div>
  );
}
