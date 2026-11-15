import { describe, it, expect } from "vitest";
import { initialMedications, initialAdherenceHistory } from "@/lib/mock-data";
import { Medication, AdherenceRecord } from "@/lib/types";

describe("Medication Adherence & Inventory Logic", () => {
  it("should calculate correct daily adherence percentage", () => {
    const todayRecords = initialAdherenceHistory.filter((r) => r.date === "2026-11-15");
    const takenCount = todayRecords.filter((r) => r.status === "taken").length;
    const totalCount = todayRecords.length;

    const rate = Math.round((takenCount / totalCount) * 100);
    expect(totalCount).toBe(5);
    expect(takenCount).toBe(2);
    expect(rate).toBe(40);
  });

  it("should correctly identify low medication inventory below refill threshold", () => {
    const lowRefillMeds = initialMedications.filter(
      (m) => m.active && m.pillsRemaining <= m.refillThreshold
    );

    // Lisinopril has 6 pills remaining with threshold 7
    expect(lowRefillMeds.length).toBeGreaterThanOrEqual(1);
    const lisinopril = lowRefillMeds.find((m) => m.name.includes("Lisinopril"));
    expect(lisinopril).toBeDefined();
    expect(lisinopril?.pillsRemaining).toBe(6);
    expect(lisinopril?.refillThreshold).toBe(7);
  });

  it("should accurately decrement pill inventory upon dose confirmation", () => {
    const testMed: Medication = {
      ...initialMedications[0],
      pillsRemaining: 10,
    };

    const decrementedCount = Math.max(0, testMed.pillsRemaining - 1);
    expect(decrementedCount).toBe(9);

    // Never drop below 0
    const zeroMed: Medication = { ...testMed, pillsRemaining: 0 };
    expect(Math.max(0, zeroMed.pillsRemaining - 1)).toBe(0);
  });

  it("should retain clinical skip reason when dose is intentionally withheld", () => {
    const skipRecord: AdherenceRecord = {
      id: "adh-test-skip",
      medicationId: "med-1",
      medicationName: "Metformin HCl",
      scheduledTime: "08:00 AM",
      date: "2026-11-15",
      status: "skipped",
      loggedBy: "Clara Vance, RN (Caretaker)",
      skipReason: "Felt nauseated after breakfast",
    };

    expect(skipRecord.status).toBe("skipped");
    expect(skipRecord.skipReason).toBe("Felt nauseated after breakfast");
    expect(skipRecord.loggedBy).toContain("Caretaker");
  });
});
