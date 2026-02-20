import html2pdf from "html2pdf.js";

export type ReportData = {
  title: string;
  timestamp: Date;
  content: string;
};

export function generatePDFReport(data: ReportData): void {
  const element = document.createElement("div");
  element.innerHTML = `
    <div style="padding: 20px; font-family: Arial, sans-serif;">
      <h1>${data.title}</h1>
      <p><small>Generated: ${data.timestamp.toLocaleString()}</small></p>
      <hr>
      ${data.content}
    </div>
  `;

  const options = {
    margin: 10,
    filename: `${data.title.replace(/\s+/g, "_")}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { orientation: "portrait", unit: "mm", format: "a4" },
  };

  html2pdf().set(options).from(element).save();
}

export function generatePaymentReportHTML(payments: {
  amount: string;
  status: string;
  paymentDate: string;
}[]): string {
  const rows = payments
    .map(
      (payment) => `
    <tr>
      <td style="border: 1px solid #ddd; padding: 8px;">${payment.paymentDate}</td>
      <td style="border: 1px solid #ddd; padding: 8px;">${payment.amount}</td>
      <td style="border: 1px solid #ddd; padding: 8px;">${payment.status}</td>
    </tr>
  `
    )
    .join("");

  return `
    <table style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr style="background-color: #f0f0f0;">
          <th style="border: 1px solid #ddd; padding: 8px;">Date</th>
          <th style="border: 1px solid #ddd; padding: 8px;">Amount</th>
          <th style="border: 1px solid #ddd; padding: 8px;">Status</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;
}
