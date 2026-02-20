import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export type EmailPayload = {
  to: string;
  subject: string;
  html: string;
};

export async function sendEmail(payload: EmailPayload): Promise<boolean> {
  try {
    if (!process.env.SMTP_USER) {
      console.warn("Email service not configured");
      return false;
    }

    await transporter.sendMail({
      from: process.env.SMTP_FROM ?? process.env.SMTP_USER,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
    });

    return true;
  } catch (error) {
    console.error("Email send failed:", error);
    return false;
  }
}

export function generateLeaveApprovalEmail(
  studentName: string,
  status: "APPROVED" | "REJECTED"
): string {
  if (status === "APPROVED") {
    return `
      <email>
        <h2>Leave Request Approved</h2>
        <p>Dear ${studentName},</p>
        <p>Your leave request has been approved. Please ensure you have informed your warden of your absence dates.</p>
        <p>Best regards,<br>Hostel Management</p>
      </email>
    `;
  }

  return `
    <email>
      <h2>Leave Request Not Approved</h2>
      <p>Dear ${studentName},</p>
      <p>Unfortunately, your leave request could not be approved at this time. Please contact your warden for more information.</p>
      <p>Best regards,<br>Hostel Management</p>
    </email>
  `;
}
