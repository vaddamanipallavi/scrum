"use client";

import { useEffect, useState } from "react";

type Room = {
  id: string;
  roomNumber: string;
  capacity: number;
  occupied: number;
  block: { id: string; name: string };
  students: { id: string }[];
};

type UnassignedStudent = {
  id: string;
  rollNo: string;
  user: { name: string | null; email: string };
  room: null;
};

export default function WardenRoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [unassigned, setUnassigned] = useState<UnassignedStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [assignStudentId, setAssignStudentId] = useState("");
  const [assignRoomId, setAssignRoomId] = useState("");
  const [assigning, setAssigning] = useState(false);
  const [assignError, setAssignError] = useState<string | null>(null);
  const [assignSuccess, setAssignSuccess] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const [roomsRes, studentsRes] = await Promise.all([
        fetch("/api/warden/rooms"),
        fetch("/api/warden/students"),
      ]);
      if (!roomsRes.ok || !studentsRes.ok) throw new Error("Failed to load data");
      const roomsData = await roomsRes.json();
      const studentsData = await studentsRes.json();
      setRooms(roomsData.rooms);
      setUnassigned(
        studentsData.students.filter((s: { room: unknown }) => s.room === null)
      );
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error loading data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    setAssignError(null);
    setAssignSuccess(null);
    setAssigning(true);

    try {
      const res = await fetch("/api/warden/rooms/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: assignStudentId, roomId: assignRoomId }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Assignment failed");
      }
      setAssignSuccess("Student assigned to room successfully!");
      setAssignStudentId("");
      setAssignRoomId("");
      setLoading(true);
      await loadData();
    } catch (err: unknown) {
      setAssignError(err instanceof Error ? err.message : "Assignment failed");
    } finally {
      setAssigning(false);
    }
  };

  const availableRooms = rooms.filter((r) => r.occupied < r.capacity);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900">Room Management</h1>
        <p className="text-sm text-zinc-600">
          View room occupancy and assign students to rooms.
        </p>
      </div>

      {/* Room Assignment Form */}
      {unassigned.length > 0 && availableRooms.length > 0 && (
        <form
          onSubmit={handleAssign}
          className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6"
        >
          <h2 className="text-lg font-semibold text-zinc-900">Assign Student to Room</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700" htmlFor="student-select">
                Student
              </label>
              <select
                id="student-select"
                value={assignStudentId}
                onChange={(e) => setAssignStudentId(e.target.value)}
                required
                className="h-11 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm"
              >
                <option value="">Select student...</option>
                {unassigned.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.user.name ?? s.user.email} ({s.rollNo})
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700" htmlFor="room-select">
                Room
              </label>
              <select
                id="room-select"
                value={assignRoomId}
                onChange={(e) => setAssignRoomId(e.target.value)}
                required
                className="h-11 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm"
              >
                <option value="">Select room...</option>
                {availableRooms.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.block.name} — Room {r.roomNumber} ({r.occupied}/{r.capacity})
                  </option>
                ))}
              </select>
            </div>
          </div>
          {assignError && <p className="text-sm text-red-600">{assignError}</p>}
          {assignSuccess && <p className="text-sm text-green-600">{assignSuccess}</p>}
          <button
            type="submit"
            disabled={assigning}
            className="inline-flex h-11 items-center justify-center rounded-md bg-zinc-900 px-6 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-zinc-500"
          >
            {assigning ? "Assigning..." : "Assign Room"}
          </button>
        </form>
      )}

      {/* Room List */}
      {loading ? (
        <p className="text-sm text-zinc-500">Loading rooms...</p>
      ) : error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : rooms.length === 0 ? (
        <div className="rounded-xl border border-zinc-200 bg-white p-8 text-center">
          <p className="text-sm text-zinc-500">No rooms configured yet.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-zinc-200 bg-zinc-50">
              <tr>
                <th className="px-4 py-3 font-medium text-zinc-600">Block</th>
                <th className="px-4 py-3 font-medium text-zinc-600">Room</th>
                <th className="px-4 py-3 font-medium text-zinc-600">Capacity</th>
                <th className="px-4 py-3 font-medium text-zinc-600">Occupied</th>
                <th className="px-4 py-3 font-medium text-zinc-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {rooms.map((room) => (
                <tr key={room.id} className="hover:bg-zinc-50">
                  <td className="px-4 py-3 font-medium text-zinc-900">
                    {room.block.name}
                  </td>
                  <td className="px-4 py-3 text-zinc-600">{room.roomNumber}</td>
                  <td className="px-4 py-3 text-zinc-600">{room.capacity}</td>
                  <td className="px-4 py-3 text-zinc-600">{room.occupied}</td>
                  <td className="px-4 py-3">
                    {room.occupied >= room.capacity ? (
                      <span className="inline-flex items-center rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-700">
                        Full
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">
                        Available ({room.capacity - room.occupied} beds)
                      </span>
                    )}
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
