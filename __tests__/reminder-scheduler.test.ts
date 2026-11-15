import { describe, it, expect } from "vitest";
import { runProactiveReminderChecks } from "@/lib/reminder-scheduler";
import {
  initialElderlyProfile,
  initialMedications,
  initialAdherenceHistory,
  initialAppointments,
} from "@/lib/mock-data";

describe("Automated Proactive Reminder & Healthcare Routine Engine", () => {
  it("should detect pending/missed doses and upcoming appointments automatically", async () => {
    const result = await runProactiveReminderChecks(
      initialElderlyProfile,
      initialMedications,
      initialAdherenceHistory,
      initialAppointments
    );

    expect(result).toBeDefined();
    expect(result.triggeredAlerts).toBeGreaterThan(0);
    expect(result.newEmailLogs.length).toBe(result.triggeredAlerts);

    const alertTypes = result.newEmailLogs.map((l) => l.alertType);
    expect(alertTypes).toContain("missed_medication");
    expect(alertTypes).toContain("upcoming_dose");
    expect(alertTypes).toContain("appointment_reminder");
  });

  it("should respect patient notification preference toggles", async () => {
    const disabledPrefs = {
      ...initialElderlyProfile,
      emailAlertPreferences: {
        ...initialElderlyProfile.emailAlertPreferences,
        notifyOnMissedDose: false,
        notifyOnUpcomingDose: false,
        notifyOnUpcomingAppointment: false,
      },
    };

    const result = await runProactiveReminderChecks(
      disabledPrefs,
      initialMedications,
      initialAdherenceHistory,
      initialAppointments
    );

    expect(result.triggeredAlerts).toBe(0);
    expect(result.newEmailLogs.length).toBe(0);
  });
});
