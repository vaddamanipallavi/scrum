"use client";

import { useEffect, useState } from "react";

type Student = {
  id: string;
  rollNo: string;
  parentContact: string;
  user: { name: string | null; email: string };
  room: { roomNumber: string; blockId: string } | null;
};

export default function WardenStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/warden/students")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load students");
        return res.json();
      })
      .then((data) => setStudents(data.students))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900">Students</h1>
        <p className="text-sm text-zinc-600">
          All hostel residents and their room assignments.
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-zinc-500">Loading students...</p>
      ) : error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : students.length === 0 ? (
        <div className="rounded-xl border border-zinc-200 bg-white p-8 text-center">
          <p className="text-sm text-zinc-500">No students found.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-zinc-200 bg-zinc-50">
              <tr>
                <th className="px-4 py-3 font-medium text-zinc-600">Name</th>
                <th className="px-4 py-3 font-medium text-zinc-600">Email</th>
                <th className="px-4 py-3 font-medium text-zinc-600">Roll No</th>
                <th className="px-4 py-3 font-medium text-zinc-600">Room</th>
                <th className="px-4 py-3 font-medium text-zinc-600">Parent Contact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-zinc-50">
                  <td className="px-4 py-3 font-medium text-zinc-900">
                    {student.user.name ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-zinc-600">{student.user.email}</td>
                  <td className="px-4 py-3 text-zinc-600">{student.rollNo}</td>
                  <td className="px-4 py-3">
                    {student.room ? (
                      <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">
                        Room {student.room.roomNumber}
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-500">
                        Unassigned
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-zinc-600">
                    {student.parentContact || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
