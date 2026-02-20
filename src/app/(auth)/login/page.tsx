import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-zinc-900">Hostel Portal</h1>
          <p className="text-sm text-zinc-600">
            Sign in to manage rooms, residents, and requests.
          </p>
        </div>
        <div className="mt-6">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
