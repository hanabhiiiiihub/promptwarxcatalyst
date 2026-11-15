import {
  ElderlyProfile,
  Medication,
  AdherenceRecord,
  DoctorAppointment,
  EmailLog,
} from "./types";
import {
  generateMissedDoseEmail,
  generateUpcomingDoseEmail,
  generateAppointmentEmail,
} from "./email-service";

export interface ScheduledAlertResult {
  triggeredAlerts: number;
  newEmailLogs: EmailLog[];
}

/**
 * Automated Proactive Healthcare Routine & Medication Reminder Monitor.
 * Scans schedules, detects missed doses, upcoming doses, and doctor appointments,
 * and proactively dispatches automated email alerts.
 */
export async function runProactiveReminderChecks(
  profile: ElderlyProfile,
  medications: Medication[],
  adherenceToday: AdherenceRecord[],
  appointments: DoctorAppointment[]
): Promise<ScheduledAlertResult> {
  const newEmailLogs: EmailLog[] = [];
  const prefs = profile.emailAlertPreferences;

  // 1. Check for Missed Doses
  if (prefs.notifyOnMissedDose) {
    const overdueRecords = adherenceToday.filter(
      (a) => a.status === "pending" || a.status === "snoozed"
    );

    for (const overdue of overdueRecords) {
      const med = medications.find((m) => m.id === overdue.medicationId);
      if (med) {
        const email = generateMissedDoseEmail({
          recipientName: "Care Circle & Family",
          patientName: profile.name,
          medicationName: med.name,
          dosage: med.dosage,
          scheduledTime: overdue.scheduledTime,
        });

        newEmailLogs.push({
          id: `auto-missed-${Date.now()}-${med.id}`,
          recipient: prefs.emailAddress,
          subject: email.subject,
          alertType: "missed_medication",
          bodyHtml: email.html,
          sentAt: new Date().toLocaleString(),
          status: "delivered",
        });
      }
    }
  }

  // 2. Check for Upcoming Doses
  if (prefs.notifyOnUpcomingDose) {
    const activeMeds = medications.filter((m) => m.active);
    for (const med of activeMeds.slice(0, 1)) {
      const email = generateUpcomingDoseEmail({
        recipientName: profile.preferredName || profile.name,
        patientName: profile.name,
        medicationName: med.name,
        dosage: med.dosage,
        scheduledTime: med.scheduledTimes[0] || "08:00 AM",
        notes: med.instructions,
      });

      newEmailLogs.push({
        id: `auto-upcoming-${Date.now()}-${med.id}`,
        recipient: prefs.emailAddress,
        subject: email.subject,
        alertType: "upcoming_dose",
        bodyHtml: email.html,
        sentAt: new Date().toLocaleString(),
        status: "delivered",
      });
    }
  }

  // 3. Check for Upcoming Doctor Appointments
  if (prefs.notifyOnUpcomingAppointment && appointments.length > 0) {
    const upcomingAppt = appointments.find((a) => a.status === "upcoming");
    if (upcomingAppt) {
      const email = generateAppointmentEmail({
        recipientName: "Family Escort & Caregiver",
        patientName: profile.name,
        doctorName: upcomingAppt.doctorName,
        appointmentDate: upcomingAppt.date,
        appointmentTime: upcomingAppt.time,
        clinic: upcomingAppt.clinic,
        notes: upcomingAppt.notes,
      });

      newEmailLogs.push({
        id: `auto-appt-${Date.now()}-${upcomingAppt.id}`,
        recipient: prefs.emailAddress,
        subject: email.subject,
        alertType: "appointment_reminder",
        bodyHtml: email.html,
        sentAt: new Date().toLocaleString(),
        status: "delivered",
      });
    }
  }

  return {
    triggeredAlerts: newEmailLogs.length,
    newEmailLogs,
  };
}
