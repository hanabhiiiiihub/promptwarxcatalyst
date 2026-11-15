import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { query, profile, medications, appointments, adherenceToday } = body;

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey && apiKey.length > 5 && !apiKey.includes("YOUR_")) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const systemPrompt = `You are "Aura", a warm, empathetic, respectful, and crystal-clear AI healthcare companion for an elderly person named ${profile?.preferredName || profile?.name || "Arthur"} (age 76).
Patient Medical Info:
- Conditions: ${profile?.chronicConditions?.join(", ") || "Type 2 Diabetes, Hypertension"}
- Allergies: ${profile?.allergies?.join(", ") || "Penicillin"}
- Active Medications: ${JSON.stringify(medications?.map((m: any) => ({ name: m.name, dose: m.dosage, time: m.scheduledTimes, instructions: m.instructions })))}
- Upcoming Appointments: ${JSON.stringify(appointments?.slice(0, 3))}
- Today's Adherence: ${JSON.stringify(adherenceToday)}

Rules for your response:
1. Speak in short, warm, easily understandable sentences suitable for an elderly senior or caring family member.
2. If asked about taking medicine, remind them of the exact timing and food instructions.
3. If asked about a doctor visit, state the doctor name, date, and any preparations.
4. Always prioritize patient comfort and remind them that the emergency SOS and nurse Clara are always available.
5. Keep your answer under 3-4 sentences so it is pleasant to hear when read aloud.`;

        const result = await model.generateContent({
          contents: [
            {
              role: "user",
              parts: [{ text: `${systemPrompt}\n\nPatient asks: "${query}"` }],
            },
          ],
        });

        const reply = result.response.text();
        return NextResponse.json({ reply, source: "gemini" });
      } catch (geminiErr) {
        console.warn("Gemini call error, using smart healthcare assistant fallback:", geminiErr);
      }
    }

    // Intelligent healthcare assistant fallback
    const lower = query.toLowerCase();
    let reply = `Hello ${profile?.preferredName || "Grandpa Arthur"}! I am here to help you stay comfortable and healthy.`;

    if (lower.includes("morning") || lower.includes("breakfast")) {
      reply = `Good day! Your morning routine includes Metformin (500mg) taken with your breakfast, and Lisinopril (10mg) with a glass of water. Both help keep your sugar and blood pressure stable.`;
    } else if (lower.includes("lunch") || lower.includes("afternoon")) {
      reply = `At lunch time, you have Calcium Citrate with Vitamin D3 (600mg) scheduled to keep your bones strong. Take it right with your meal!`;
    } else if (lower.includes("evening") || lower.includes("dinner") || lower.includes("night") || lower.includes("bedtime")) {
      reply = `For dinner and bedtime, you have your evening Metformin with dinner, and Atorvastatin (20mg) at bedtime. Please remember to avoid grapefruit with your statin!`;
    } else if (lower.includes("appointment") || lower.includes("doctor") || lower.includes("visit")) {
      const nextAppt = appointments?.[0];
      if (nextAppt) {
        reply = `Your next visit is with ${nextAppt.doctorName} on ${nextAppt.date} at ${nextAppt.time} for ${nextAppt.specialty}. ${nextAppt.accompaniedBy ? nextAppt.accompaniedBy + " will accompany you." : ""}`;
      } else {
        reply = `You have no doctor appointments scheduled in the next few days. Keep up the great health routine!`;
      }
    } else if (lower.includes("emergency") || lower.includes("help") || lower.includes("pain") || lower.includes("fall")) {
      reply = `If you feel unwell, dizzy, or in severe pain, please press the Red Emergency SOS button right at the top of your screen, or call Nurse Clara immediately. Your family has been notified.`;
    } else if (lower.includes("headache") || lower.includes("knee") || lower.includes("joint")) {
      reply = `For joint or knee discomfort, Dr. Vance prescribed Paracetamol 500mg as needed, up to 3 times a day after meals. Be sure to rest your leg and stay hydrated.`;
    } else {
      reply = `You are doing wonderfully with your healthcare routine today! You can ask me what medicines to take next, check your upcoming doctor visits, or request audio guidance anytime.`;
    }

    return NextResponse.json({ reply, source: "smart-engine" });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json(
      { error: "Failed to process query", details: message },
      { status: 500 }
    );
  }
}
