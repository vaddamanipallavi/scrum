"use client";

import { useEffect, useState } from "react";

type Payment = {
  id: string;
  amount: string;
  status: string;
  paymentDate: string;
};

export default function StudentPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPayments = async () => {
    const response = await fetch("/api/student/payments");
    if (!response.ok) {
      setError("Unable to load payments");
      return;
    }
    const payload = (await response.json()) as { payments: Payment[] };
    setPayments(payload.payments);
  };

  useEffect(() => {
    loadPayments();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const numericAmount = Number(amount);
    const response = await fetch("/api/student/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: numericAmount }),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      setError(payload?.error ?? "Unable to submit payment");
      setIsSubmitting(false);
      return;
    }

    setAmount("");
    await loadPayments();
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900">Payments</h1>
        <p className="text-sm text-zinc-600">
          Pay hostel fees and track payment history.
        </p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6"
      >
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="amount">
            Amount
          </label>
          <input
            id="amount"
            type="number"
            min="1"
            step="0.01"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            required
            className="h-11 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm"
            placeholder="2500"
          />
        </div>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex h-11 items-center justify-center rounded-md bg-zinc-900 px-6 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-zinc-500"
        >
          {isSubmitting ? "Processing..." : "Pay now"}
        </button>
      </form>
      <div className="space-y-3">
        {payments.length === 0 ? (
          <p className="text-sm text-zinc-500">No payments yet.</p>
        ) : (
          payments.map((payment) => (
            <div
              key={payment.id}
              className="rounded-xl border border-zinc-200 bg-white p-4"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-zinc-900">
                  {Number(payment.amount).toFixed(2)}
                </p>
                <span className="text-xs uppercase text-zinc-500">
                  {payment.status.replaceAll("_", " ")}
                </span>
              </div>
              <p className="mt-2 text-xs text-zinc-400">
                {new Date(payment.paymentDate).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
