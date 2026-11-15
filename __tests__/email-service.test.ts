import { describe, it, expect } from "vitest";
import {
  generateMissedDoseEmail,
  generateUpcomingDoseEmail,
  generateAppointmentEmail,
  generateDailyDigestEmail,
} from "@/lib/email-service";

describe("Proactive Email Reminders & Notifications", () => {
  it("should generate a high-priority missed dose alert with clinical details", () => {
    const email = generateMissedDoseEmail({
      recipientName: "David Pendelton",
      patientName: "Arthur Pendelton",
      medicationName: "Lisinopril",
      dosage: "10 mg",
      scheduledTime: "08:00 AM",
    });

    expect(email.subject).toContain("Alert: Missed Medication");
    expect(email.subject).toContain("Lisinopril");
    expect(email.html).toContain("David Pendelton");
    expect(email.html).toContain("Arthur Pendelton");
    expect(email.html).toContain("10 mg");
    expect(email.html).toContain("08:00 AM");
    expect(email.html).toContain("Overdue");
  });

  it("should generate an advance notice for upcoming medication doses", () => {
    const email = generateUpcomingDoseEmail({
      recipientName: "Arthur Pendelton",
      patientName: "Arthur Pendelton",
      medicationName: "Metformin HCl",
      dosage: "500 mg",
      scheduledTime: "08:00 PM",
      notes: "Take with dinner",
    });

    expect(email.subject).toContain("Upcoming Medication Dose");
    expect(email.subject).toContain("Metformin HCl");
    expect(email.html).toContain("Arthur Pendelton");
    expect(email.html).toContain("08:00 PM");
    expect(email.html).toContain("Take with dinner");
  });

  it("should generate a detailed doctor appointment reminder", () => {
    const email = generateAppointmentEmail({
      recipientName: "Pendelton Family",
      patientName: "Arthur Pendelton",
      doctorName: "Dr. Sarah Chen, MD",
      appointmentDate: "2026-11-20",
      appointmentTime: "10:30 AM",
      clinic: "Metro Health Cardiology Suite 402",
      notes: "Fasting required for blood sugar testing",
    });

    expect(email.subject).toContain("Dr. Sarah Chen");
    expect(email.html).toContain("Metro Health Cardiology");
    expect(email.html).toContain("Fasting required");
    expect(email.html).toContain("2026-11-20 at 10:30 AM");
  });

  it("should generate an adherence daily digest email", () => {
    const email = generateDailyDigestEmail({
      recipientName: "David Pendelton",
      patientName: "Arthur Pendelton",
      adherencePercentage: 92,
    });

    expect(email.subject).toContain("92% Medication Adherence");
    expect(email.html).toContain("92%");
    expect(email.html).toContain("Daily Adherence & Wellness Digest");
  });
});
