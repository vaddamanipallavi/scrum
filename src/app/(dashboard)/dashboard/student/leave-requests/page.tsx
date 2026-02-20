"use client";

import { useEffect, useState } from "react";

type LeaveRequest = {
  id: string;
  fromDate: string;
  toDate: string;
  reason: string;
  status: string;
  createdAt: string;
};

export default function StudentLeaveRequestsPage() {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRequests = async () => {
    const response = await fetch("/api/student/leave-requests");
    if (!response.ok) {
      setError("Unable to load leave requests");
      return;
    }
    const payload = (await response.json()) as { leaveRequests: LeaveRequest[] };
    setRequests(payload.leaveRequests);
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const response = await fetch("/api/student/leave-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fromDate, toDate, reason }),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      setError(payload?.error ?? "Unable to submit leave request");
      setIsSubmitting(false);
      return;
    }

    setFromDate("");
    setToDate("");
    setReason("");
    await loadRequests();
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900">Leave Requests</h1>
        <p className="text-sm text-zinc-600">
          Apply for leave and view approval status.
        </p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="fromDate">
              From
            </label>
            <input
              id="fromDate"
              type="date"
              value={fromDate}
              onChange={(event) => setFromDate(event.target.value)}
              required
              className="h-11 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="toDate">
              To
            </label>
            <input
              id="toDate"
              type="date"
              value={toDate}
              onChange={(event) => setToDate(event.target.value)}
              required
              className="h-11 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="reason">
            Reason
          </label>
          <textarea
            id="reason"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            required
            rows={3}
            className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm"
          />
        </div>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex h-11 items-center justify-center rounded-md bg-zinc-900 px-6 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-zinc-500"
        >
          {isSubmitting ? "Submitting..." : "Apply for leave"}
        </button>
      </form>
      <div className="space-y-3">
        {requests.length === 0 ? (
          <p className="text-sm text-zinc-500">No leave requests yet.</p>
        ) : (
          requests.map((request) => (
            <div
              key={request.id}
              className="rounded-xl border border-zinc-200 bg-white p-4"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-zinc-900">
                  {new Date(request.fromDate).toLocaleDateString()} -{" "}
                  {new Date(request.toDate).toLocaleDateString()}
                </p>
                <span className="text-xs uppercase text-zinc-500">
                  {request.status.replaceAll("_", " ")}
                </span>
              </div>
              <p className="mt-2 text-sm text-zinc-600">{request.reason}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
