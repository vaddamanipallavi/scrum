import { redirect } from "next/navigation";
import { getTokenFromCookies, verifyAuthToken } from "@/lib/auth";

export default async function DashboardPage() {
  const token = await getTokenFromCookies();
  const payload = token ? verifyAuthToken(token) : null;

  if (!payload) {
    redirect("/login");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900">Dashboard</h1>
        <p className="text-sm text-zinc-600">
          Welcome back, {payload.email}. Your role is {payload.role}.
        </p>
      </div>
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-zinc-200 bg-white p-4">
          <p className="text-xs uppercase text-zinc-500">Residents</p>
          <p className="text-2xl font-semibold text-zinc-900">0</p>
          <p className="text-sm text-zinc-500">Connect to database</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4">
          <p className="text-xs uppercase text-zinc-500">Rooms</p>
          <p className="text-2xl font-semibold text-zinc-900">0</p>
          <p className="text-sm text-zinc-500">Set up rooms inventory</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4">
          <p className="text-xs uppercase text-zinc-500">Requests</p>
          <p className="text-2xl font-semibold text-zinc-900">0</p>
          <p className="text-sm text-zinc-500">Track pending actions</p>
        </div>
      </section>
    </div>
  );
}
