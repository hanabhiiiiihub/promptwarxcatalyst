import { NextResponse } from "next/server";
import { EmailLog } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { recipient, subject, alertType, bodyHtml } = body;

    if (!recipient || !subject || !bodyHtml) {
      return NextResponse.json(
        { error: "recipient, subject, and bodyHtml are required" },
        { status: 400 }
      );
    }

    // Prepare EmailLog object
    const emailLog: EmailLog = {
      id: `email-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      recipient,
      subject,
      alertType: alertType || "missed_medication",
      bodyHtml,
      sentAt: new Date().toLocaleString(),
      status: "delivered", // Simulated immediate delivery with interactive inspection
    };

    return NextResponse.json({
      success: true,
      message: `Email alert successfully dispatched to ${recipient}`,
      log: emailLog,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json(
      { error: "Failed to dispatch email alert", details: message },
      { status: 500 }
    );
  }
}
