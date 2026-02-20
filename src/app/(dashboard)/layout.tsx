import { redirect } from "next/navigation";
import DashboardShell from "@/components/DashboardShell";
import { getTokenFromCookies, verifyAuthToken } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const token = await getTokenFromCookies();
  const payload = token ? verifyAuthToken(token) : null;

  if (!payload) {
    redirect("/login");
  }

  return (
    <DashboardShell role={payload.role} userEmail={payload.email}>
      {children}
    </DashboardShell>
  );
}
