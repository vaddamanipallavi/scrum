"use client";

import { useState } from "react";
import { generatePDFReport, generatePaymentReportHTML } from "@/lib/pdf-export";

type Payment = {
  amount: string;
  status: string;
  paymentDate: string;
};

export function ExportPaymentButton({ payments }: { payments: Payment[] }) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const html = generatePaymentReportHTML(payments);
      generatePDFReport({
        title: "Payment History Report",
        timestamp: new Date(),
        content: html,
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={isExporting}
      className="inline-flex h-11 items-center justify-center rounded-md bg-zinc-900 px-6 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-zinc-500 dark:bg-zinc-700 dark:disabled:bg-zinc-600"
    >
      {isExporting ? "Exporting..." : "Export as PDF"}
    </button>
  );
}
