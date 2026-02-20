import { NextResponse } from "next/server";
import { getStudentContext } from "@/lib/student-auth";

export async function GET() {
  const context = await getStudentContext();
  if (!context) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { student } = context;

  return NextResponse.json({
    student: {
      id: student.id,
      rollNo: student.rollNo,
      parentContact: student.parentContact,
      user: {
        id: student.user.id,
        email: student.user.email,
        name: student.user.name,
      },
    },
  });
}
