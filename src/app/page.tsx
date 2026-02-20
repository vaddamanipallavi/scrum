import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <main className="mx-auto flex max-w-5xl flex-col gap-12 px-4 py-16">
        <header className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Hostel Management System
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
            Keep every hostel operation in one calm workspace.
          </h1>
          <p className="max-w-2xl text-base text-zinc-600">
            Track residents, assign rooms, and coordinate requests with role-based
            access for students, wardens, and administrators.
          </p>
        </header>
        <section className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-zinc-900">Students</h2>
            <p className="mt-2 text-sm text-zinc-600">
              Submit requests, check allocations, and stay notified.
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-zinc-900">Wardens</h2>
            <p className="mt-2 text-sm text-zinc-600">
              Manage approvals, inspections, and resident updates.
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-zinc-900">Admins</h2>
            <p className="mt-2 text-sm text-zinc-600">
              Oversee capacity, roles, and system configuration.
            </p>
          </div>
        </section>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/login"
            className="flex h-12 items-center justify-center rounded-md bg-zinc-900 px-6 text-sm font-semibold text-white"
          >
            Sign in
          </Link>
          <Link
            href="/dashboard"
            className="flex h-12 items-center justify-center rounded-md border border-zinc-200 bg-white px-6 text-sm font-semibold text-zinc-900"
          >
            View dashboard
          </Link>
        </div>
      </main>
    </div>
  );
}
