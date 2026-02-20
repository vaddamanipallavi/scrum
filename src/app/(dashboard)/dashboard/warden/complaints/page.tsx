"use client";

import { useEffect, useState } from "react";

type Complaint = {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  student: {
    rollNo: string;
    user: { name: string | null; email: string };
    room: { roomNumber: string } | null;
  };
};

const STATUS_OPTIONS = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"];

const STATUS_COLORS: Record<string, string> = {
  OPEN: "bg-amber-50 text-amber-700",
  IN_PROGRESS: "bg-blue-50 text-blue-700",
  RESOLVED: "bg-green-50 text-green-700",
  CLOSED: "bg-zinc-100 text-zinc-600",
};

export default function WardenComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const loadComplaints = async () => {
    try {
      const res = await fetch("/api/warden/complaints");
      if (!res.ok) throw new Error("Failed to load complaints");
      const data = await res.json();
      setComplaints(data.complaints);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdating(id);
    try {
      const res = await fetch("/api/warden/complaints", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (!res.ok) throw new Error("Update failed");
      await loadComplaints();
    } catch {
      setError("Failed to update complaint status");
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900">Complaints</h1>
        <p className="text-sm text-zinc-600">
          Review student complaints and update their status.
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-zinc-500">Loading complaints...</p>
      ) : error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : complaints.length === 0 ? (
        <div className="rounded-xl border border-zinc-200 bg-white p-8 text-center">
          <p className="text-sm text-zinc-500">No complaints found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {complaints.map((complaint) => (
            <div
              key={complaint.id}
              className="rounded-xl border border-zinc-200 bg-white p-5"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <h2 className="text-base font-semibold text-zinc-900">
                    {complaint.title}
                  </h2>
                  <p className="mt-1 text-sm text-zinc-600">
                    {complaint.description}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-zinc-500">
                    <span>
                      By: {complaint.student.user.name ?? complaint.student.user.email}
                    </span>
                    <span>•</span>
                    <span>Roll: {complaint.student.rollNo}</span>
                    {complaint.student.room && (
                      <>
                        <span>•</span>
                        <span>Room {complaint.student.room.roomNumber}</span>
                      </>
                    )}
                    <span>•</span>
                    <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      STATUS_COLORS[complaint.status] ?? "bg-zinc-100 text-zinc-600"
                    }`}
                  >
                    {complaint.status.replaceAll("_", " ")}
                  </span>
                  <select
                    value={complaint.status}
                    onChange={(e) =>
                      handleStatusChange(complaint.id, e.target.value)
                    }
                    disabled={updating === complaint.id}
                    className="rounded-md border border-zinc-200 bg-white px-2 py-1.5 text-xs disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s.replaceAll("_", " ")}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
