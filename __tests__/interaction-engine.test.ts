import { describe, it, expect } from "vitest";
import { analyzeInteractions } from "@/lib/interaction-engine";
import { initialMedications } from "@/lib/mock-data";

describe("AI & Clinical Interaction Safety Engine", () => {
  it("should evaluate active medications and return a valid interaction report", async () => {
    const report = await analyzeInteractions(initialMedications);

    expect(report).toBeDefined();
    expect(report.overallSafetyScore).toMatch(/safe|caution|warning/);
    expect(report.summary).toBeDefined();
    expect(report.summary.length).toBeGreaterThan(10);
    expect(Array.isArray(report.interactions)).toBe(true);
    expect(Array.isArray(report.foodWarnings)).toBe(true);
  });

  it("should flag grapefruit interaction warning for statins (Atorvastatin)", async () => {
    const report = await analyzeInteractions(initialMedications);

    const hasGrapefruitWarning = report.foodWarnings.some((w) =>
      w.toLowerCase().includes("grapefruit")
    );
    expect(hasGrapefruitWarning).toBe(true);
  });

  it("should flag potassium dietary advice for ACE inhibitors (Lisinopril)", async () => {
    const report = await analyzeInteractions(initialMedications);

    const hasPotassiumWarning = report.foodWarnings.some((w) =>
      w.toLowerCase().includes("potassium")
    );
    expect(hasPotassiumWarning).toBe(true);
  });
});
