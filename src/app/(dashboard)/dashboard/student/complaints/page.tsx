"use client";

import { useEffect, useState } from "react";

type Complaint = {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
};

export default function StudentComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadComplaints = async () => {
    const response = await fetch("/api/student/complaints");
    if (!response.ok) {
      setError("Unable to load complaints");
      return;
    }
    const payload = (await response.json()) as { complaints: Complaint[] };
    setComplaints(payload.complaints);
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const response = await fetch("/api/student/complaints", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description }),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      setError(payload?.error ?? "Unable to submit complaint");
      setIsSubmitting(false);
      return;
    }

    setTitle("");
    setDescription("");
    await loadComplaints();
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900">Complaints</h1>
        <p className="text-sm text-zinc-600">
          Submit a complaint and track its status.
        </p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6"
      >
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="title">
            Title
          </label>
          <input
            id="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
            className="h-11 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm"
            placeholder="Water leakage"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            required
            rows={4}
            className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm"
            placeholder="Describe the issue..."
          />
        </div>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex h-11 items-center justify-center rounded-md bg-zinc-900 px-6 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-zinc-500"
        >
          {isSubmitting ? "Submitting..." : "Submit complaint"}
        </button>
      </form>
      <div className="space-y-3">
        {complaints.length === 0 ? (
          <p className="text-sm text-zinc-500">No complaints yet.</p>
        ) : (
          complaints.map((complaint) => (
            <div
              key={complaint.id}
              className="rounded-xl border border-zinc-200 bg-white p-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-zinc-900">
                  {complaint.title}
                </h2>
                <span className="text-xs uppercase text-zinc-500">
                  {complaint.status.replaceAll("_", " ")}
                </span>
              </div>
              <p className="mt-2 text-sm text-zinc-600">
                {complaint.description}
              </p>
              <p className="mt-2 text-xs text-zinc-400">
                {new Date(complaint.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
