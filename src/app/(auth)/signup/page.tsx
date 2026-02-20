import SignupForm from "./SignupForm";

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-zinc-900">Create Account</h1>
          <p className="text-sm text-zinc-600">
            Sign up to access the Hostel Portal
          </p>
        </div>
        <div className="mt-6">
          <SignupForm />
        </div>
      </div>
    </div>
  );
}
