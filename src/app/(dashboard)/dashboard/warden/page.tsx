"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Stats = {
  students: number;
  complaints: number;
  leaves: number;
};

const SECTIONS = [
  { title: "Students", href: "/dashboard/warden/students", description: "View and manage hostel residents.", icon: "👥" },
  { title: "Rooms", href: "/dashboard/warden/rooms", description: "Room allocation and availability.", icon: "🏠" },
  { title: "Complaints", href: "/dashboard/warden/complaints", description: "Review and resolve student complaints.", icon: "📋" },
  { title: "Leave Requests", href: "/dashboard/warden/leave-requests", description: "Approve or reject leave applications.", icon: "📅" },
  { title: "Announcements", href: "/dashboard/warden/announcements", description: "Post notices for hostel residents.", icon: "📢" },
];

export default function WardenDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/warden/stats")
      .then((res) => res.json())
      .then((data) => setStats(data.stats))
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900">Warden Dashboard</h1>
        <p className="text-sm text-zinc-600">
          Manage students, rooms, complaints, and leave requests.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-zinc-200 bg-white p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Total Students</p>
          <p className="mt-2 text-3xl font-bold text-zinc-900">
            {stats?.students ?? "—"}
          </p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Open Complaints</p>
          <p className="mt-2 text-3xl font-bold text-amber-600">
            {stats?.complaints ?? "—"}
          </p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Leave Requests</p>
          <p className="mt-2 text-3xl font-bold text-blue-600">
            {stats?.leaves ?? "—"}
          </p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {SECTIONS.map((section) => (
          <Link
            key={section.title}
            href={section.href}
            className="group rounded-xl border border-zinc-200 bg-white p-5 transition hover:border-zinc-300 hover:shadow-sm"
          >
            <div className="text-2xl">{section.icon}</div>
            <h2 className="mt-3 text-lg font-semibold text-zinc-900 group-hover:text-zinc-700">
              {section.title}
            </h2>
            <p className="mt-1 text-sm text-zinc-600">{section.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
