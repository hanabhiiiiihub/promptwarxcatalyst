import { NextResponse } from "next/server";
import { analyzeInteractions } from "@/lib/interaction-engine";
import { Medication } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const medications: Medication[] = body.medications || [];

    if (!Array.isArray(medications) || medications.length === 0) {
      return NextResponse.json(
        { error: "No medications provided for analysis." },
        { status: 400 }
      );
    }

    const report = await analyzeInteractions(medications);
    return NextResponse.json(report);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json(
      { error: "Failed to analyze interactions", details: message },
      { status: 500 }
    );
  }
}
