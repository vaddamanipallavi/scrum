"use client";

import { useEffect, useState } from "react";

type LeaveRequest = {
  id: string;
  fromDate: string;
  toDate: string;
  reason: string;
  status: string;
  createdAt: string;
  student: {
    rollNo: string;
    user: { name: string | null; email: string };
    room: { roomNumber: string } | null;
  };
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700",
  APPROVED: "bg-green-50 text-green-700",
  REJECTED: "bg-red-50 text-red-700",
  CANCELLED: "bg-zinc-100 text-zinc-600",
};

export default function WardenLeaveRequestsPage() {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const loadRequests = async () => {
    try {
      const res = await fetch("/api/warden/leave-requests");
      if (!res.ok) throw new Error("Failed to load leave requests");
      const data = await res.json();
      setRequests(data.leaveRequests);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleAction = async (id: string, status: "APPROVED" | "REJECTED") => {
    setUpdating(id);
    try {
      const res = await fetch("/api/warden/leave-requests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) throw new Error("Update failed");
      await loadRequests();
    } catch {
      setError("Failed to update leave request");
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900">Leave Requests</h1>
        <p className="text-sm text-zinc-600">
          Review and approve or reject student leave applications.
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-zinc-500">Loading leave requests...</p>
      ) : error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : requests.length === 0 ? (
        <div className="rounded-xl border border-zinc-200 bg-white p-8 text-center">
          <p className="text-sm text-zinc-500">No leave requests found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <div
              key={request.id}
              className="rounded-xl border border-zinc-200 bg-white p-5"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-base font-semibold text-zinc-900">
                      {new Date(request.fromDate).toLocaleDateString()} —{" "}
                      {new Date(request.toDate).toLocaleDateString()}
                    </p>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        STATUS_COLORS[request.status] ?? "bg-zinc-100 text-zinc-600"
                      }`}
                    >
                      {request.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-zinc-600">{request.reason}</p>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-zinc-500">
                    <span>
                      By: {request.student.user.name ?? request.student.user.email}
                    </span>
                    <span>•</span>
                    <span>Roll: {request.student.rollNo}</span>
                    {request.student.room && (
                      <>
                        <span>•</span>
                        <span>Room {request.student.room.roomNumber}</span>
                      </>
                    )}
                    <span>•</span>
                    <span>
                      Applied: {new Date(request.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                {request.status === "PENDING" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAction(request.id, "APPROVED")}
                      disabled={updating === request.id}
                      className="inline-flex h-9 items-center rounded-md bg-green-600 px-4 text-xs font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleAction(request.id, "REJECTED")}
                      disabled={updating === request.id}
                      className="inline-flex h-9 items-center rounded-md bg-red-600 px-4 text-xs font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
