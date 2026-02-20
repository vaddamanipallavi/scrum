"use client";

import { useEffect, useState } from "react";

type Announcement = {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  createdBy: { name: string | null; email: string };
};

export default function WardenAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const loadAnnouncements = async () => {
    try {
      const res = await fetch("/api/warden/announcements");
      if (!res.ok) throw new Error("Failed to load announcements");
      const data = await res.json();
      setAnnouncements(data.announcements);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/warden/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), message: message.trim() }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Failed to create announcement");
      }

      setTitle("");
      setMessage("");
      setSubmitSuccess("Announcement posted successfully!");
      await loadAnnouncements();
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : "Failed to post");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900">Announcements</h1>
        <p className="text-sm text-zinc-600">
          Post notices for hostel residents and view past announcements.
        </p>
      </div>

      {/* Create Announcement Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6"
      >
        <h2 className="text-lg font-semibold text-zinc-900">New Announcement</h2>
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-700" htmlFor="ann-title">
            Title
          </label>
          <input
            id="ann-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="h-11 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm"
            placeholder="Hostel Maintenance Notice"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-700" htmlFor="ann-message">
            Message
          </label>
          <textarea
            id="ann-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={4}
            className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm"
            placeholder="Write your announcement here..."
          />
        </div>
        {submitError && <p className="text-sm text-red-600">{submitError}</p>}
        {submitSuccess && <p className="text-sm text-green-600">{submitSuccess}</p>}
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex h-11 items-center justify-center rounded-md bg-zinc-900 px-6 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-zinc-500"
        >
          {isSubmitting ? "Posting..." : "Post Announcement"}
        </button>
      </form>

      {/* Announcements List */}
      {loading ? (
        <p className="text-sm text-zinc-500">Loading announcements...</p>
      ) : error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : announcements.length === 0 ? (
        <div className="rounded-xl border border-zinc-200 bg-white p-8 text-center">
          <p className="text-sm text-zinc-500">No announcements yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((ann) => (
            <div
              key={ann.id}
              className="rounded-xl border border-zinc-200 bg-white p-5"
            >
              <h2 className="text-base font-semibold text-zinc-900">{ann.title}</h2>
              <p className="mt-2 text-sm text-zinc-600">{ann.message}</p>
              <div className="mt-3 flex gap-2 text-xs text-zinc-500">
                <span>
                  By: {ann.createdBy.name ?? ann.createdBy.email}
                </span>
                <span>•</span>
                <span>{new Date(ann.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
