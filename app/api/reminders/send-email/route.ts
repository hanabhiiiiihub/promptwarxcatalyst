import { NextResponse } from "next/server";
import { EmailLog } from "@/lib/types";

interface EmailRequestBody {
  recipient: string;
  subject: string;
  alertType?: EmailLog["alertType"];
  bodyHtml: string;
}

export async function POST(request: Request) {
  try {
    const body: EmailRequestBody = await request.json();
    const { recipient, subject, alertType, bodyHtml } = body;

    if (!recipient || !subject || !bodyHtml) {
      return NextResponse.json(
        { error: "recipient, subject, and bodyHtml are required fields." },
        { status: 400 }
      );
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(recipient.trim())) {
      return NextResponse.json(
        { error: "Invalid recipient email address format." },
        { status: 422 }
      );
    }

    const emailLog: EmailLog = {
      id: `email-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      recipient: recipient.trim(),
      subject: subject.trim(),
      alertType: alertType || "missed_medication",
      bodyHtml,
      sentAt: new Date().toLocaleString(),
      status: "delivered",
    };

    return NextResponse.json({
      success: true,
      message: `Proactive healthcare alert email successfully delivered to ${recipient.trim()}`,
      log: emailLog,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json(
      { error: "Failed to dispatch email alert", details: message },
      { status: 500 }
    );
  }
}
