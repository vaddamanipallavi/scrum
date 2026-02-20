"use client";

import { useEffect, useState } from "react";

type ProfileResponse = {
  student: {
    id: string;
    rollNo: string;
    parentContact: string;
    user: { id: string; email: string; name: string | null };
  };
};

export default function StudentProfilePage() {
  const [data, setData] = useState<ProfileResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const response = await fetch("/api/student/profile");
      if (!response.ok) {
        setError("Unable to load profile");
        return;
      }
      const payload = (await response.json()) as ProfileResponse;
      setData(payload);
    };

    load();
  }, []);

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  if (!data) {
    return <p className="text-sm text-zinc-500">Loading profile...</p>;
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900">My Profile</h1>
        <p className="text-sm text-zinc-600">Basic student information.</p>
      </div>
      <div className="rounded-xl border border-zinc-200 bg-white p-6">
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs uppercase text-zinc-500">Name</dt>
            <dd className="text-sm font-medium text-zinc-900">
              {data.student.user.name ?? "Not set"}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase text-zinc-500">Email</dt>
            <dd className="text-sm font-medium text-zinc-900">
              {data.student.user.email}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase text-zinc-500">Roll No</dt>
            <dd className="text-sm font-medium text-zinc-900">
              {data.student.rollNo}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase text-zinc-500">Parent Contact</dt>
            <dd className="text-sm font-medium text-zinc-900">
              {data.student.parentContact}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
