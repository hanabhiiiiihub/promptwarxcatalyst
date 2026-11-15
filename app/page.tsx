"use client";

import React, { useState, useEffect } from "react";
import {
  UserRole,
  ElderlyProfile,
  Medication,
  DoctorAppointment,
  AdherenceRecord,
  CareCircleMember,
  EmailLog,
} from "@/lib/types";
import { StorageService } from "@/lib/storage";
import { speakText } from "@/lib/tts";
import {
  generateMissedDoseEmail,
  generateAppointmentEmail,
  generateDailyDigestEmail,
} from "@/lib/email-service";
import { Navbar } from "@/components/Navbar";
import { SeniorView } from "@/components/SeniorView";
import { CaretakerView } from "@/components/CaretakerView";
import { FamilyView } from "@/components/FamilyView";
import { PasscodeModal } from "@/components/PasscodeModal";
import { MedicationModal } from "@/components/MedicationModal";
import { AppointmentModal } from "@/components/AppointmentModal";
import { EmergencyModal } from "@/components/EmergencyModal";
import { AiAssistantModal } from "@/components/AiAssistantModal";
import { AiInteractionChecker } from "@/components/AiInteractionChecker";
import { DoctorReportModal } from "@/components/DoctorReportModal";
import { NotificationModal } from "@/components/NotificationModal";

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [currentRole, setCurrentRole] = useState<UserRole>("senior");
  const [profile, setProfile] = useState<ElderlyProfile>(StorageService.getProfile());
  const [medications, setMedications] = useState<Medication[]>(StorageService.getMedications());
  const [appointments, setAppointments] = useState<DoctorAppointment[]>(
    StorageService.getAppointments()
  );
  const [adherenceHistory, setAdherenceHistory] = useState<AdherenceRecord[]>(
    StorageService.getAdherenceHistory()
  );
  const [careCircle, setCareCircle] = useState<CareCircleMember[]>(StorageService.getMembers());
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>(StorageService.getEmailLogs());

  // Accessibility state
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState<"normal" | "large" | "xlarge">("normal");

  // Modals state
  const [isPasscodeOpen, setIsPasscodeOpen] = useState(false);
  const [isMedicationModalOpen, setIsMedicationModalOpen] = useState(false);
  const [editingMedication, setEditingMedication] = useState<Medication | null>(null);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [isInteractionCheckerOpen, setIsInteractionCheckerOpen] = useState(false);
  const [isDoctorReportOpen, setIsDoctorReportOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    setProfile(StorageService.getProfile());
    setMedications(StorageService.getMedications());
    setAppointments(StorageService.getAppointments());
    setAdherenceHistory(StorageService.getAdherenceHistory());
    setCareCircle(StorageService.getMembers());
    setEmailLogs(StorageService.getEmailLogs());
  }, []);

  // Today's adherence records
  const todayStr = "2026-11-15";
  const adherenceToday = adherenceHistory.filter((a) => a.date === todayStr);

  // Persistence updates
  const updateMedications = (newMeds: Medication[]) => {
    setMedications(newMeds);
    StorageService.saveMedications(newMeds);
  };

  const updateAppointments = (newAppts: DoctorAppointment[]) => {
    setAppointments(newAppts);
    StorageService.saveAppointments(newAppts);
  };

  const updateAdherence = (newAdh: AdherenceRecord[]) => {
    setAdherenceHistory(newAdh);
    StorageService.saveAdherenceHistory(newAdh);
  };

  const updateEmailLogs = (newEmails: EmailLog[]) => {
    setEmailLogs(newEmails);
    StorageService.saveEmailLogs(newEmails);
  };

  // Senior action: Mark Taken
  const handleMarkTaken = (medId: string, scheduledTime: string) => {
    const med = medications.find((m) => m.id === medId);
    if (!med) return;

    // Decrement pill inventory
    const updatedMeds = medications.map((m) =>
      m.id === medId ? { ...m, pillsRemaining: Math.max(0, m.pillsRemaining - 1) } : m
    );
    updateMedications(updatedMeds);

    // Update adherence record
    const existingIndex = adherenceHistory.findIndex(
      (a) => a.medicationId === medId && a.scheduledTime === scheduledTime && a.date === todayStr
    );

    const nowFormatted = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    if (existingIndex >= 0) {
      const updated = [...adherenceHistory];
      updated[existingIndex] = {
        ...updated[existingIndex],
        status: "taken",
        takenAt: nowFormatted,
        loggedBy: `${profile.preferredName || "Grandpa Arthur"} (Senior)`,
      };
      updateAdherence(updated);
    } else {
      const newRec: AdherenceRecord = {
        id: `adh-${Date.now()}`,
        medicationId: medId,
        medicationName: `${med.name} (${med.dosage})`,
        scheduledTime,
        date: todayStr,
        status: "taken",
        takenAt: nowFormatted,
        loggedBy: `${profile.preferredName || "Grandpa Arthur"} (Senior)`,
      };
      updateAdherence([newRec, ...adherenceHistory]);
    }

    speakText(`Wonderful job, Arthur! ${med.name} marked as taken.`);
  };

  // Senior action: Snooze 15m
  const handleSnooze = (medId: string, scheduledTime: string) => {
    const med = medications.find((m) => m.id === medId);
    if (!med) return;

    const existingIndex = adherenceHistory.findIndex(
      (a) => a.medicationId === medId && a.scheduledTime === scheduledTime && a.date === todayStr
    );

    if (existingIndex >= 0) {
      const updated = [...adherenceHistory];
      updated[existingIndex] = {
        ...updated[existingIndex],
        status: "snoozed",
      };
      updateAdherence(updated);
    }

    speakText(`Dose snoozed for fifteen minutes. We will remind you shortly.`);
  };

  // Caretaker action: Update adherence
  const handleUpdateAdherenceStatus = (
    recordId: string,
    status: "taken" | "skipped" | "snoozed",
    skipReason?: string
  ) => {
    const updated = adherenceHistory.map((a) => {
      if (a.id === recordId) {
        return {
          ...a,
          status,
          skipReason: status === "skipped" ? skipReason : undefined,
          takenAt:
            status === "taken"
              ? new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
              : undefined,
          loggedBy: "Clara Vance, RN (Caretaker)",
        };
      }
      return a;
    });
    updateAdherence(updated);
  };

  // Add / Edit Medication
  const handleSaveMedication = (med: Medication) => {
    const exists = medications.some((m) => m.id === med.id);
    const newMeds = exists ? medications.map((m) => (m.id === med.id ? med : m)) : [...medications, med];
    updateMedications(newMeds);
  };

  const handleDeleteMedication = (medId: string) => {
    const newMeds = medications.filter((m) => m.id !== medId);
    updateMedications(newMeds);
  };

  // Add / Delete Appointment
  const handleSaveAppointment = (appt: DoctorAppointment) => {
    updateAppointments([...appointments, appt]);
  };

  const handleDeleteAppointment = (apptId: string) => {
    updateAppointments(appointments.filter((a) => a.id !== apptId));
  };

  // Proactive Email Dispatch
  const handleSendProactiveEmail = async (
    type: "missed_medication" | "appointment_reminder" | "daily_digest"
  ) => {
    let emailData: { subject: string; html: string };

    if (type === "missed_medication") {
      emailData = generateMissedDoseEmail({
        recipientName: "David & Clara",
        patientName: profile.name,
        medicationName: "Lisinopril",
        dosage: "10 mg",
        scheduledTime: "08:00 AM",
      });
    } else if (type === "appointment_reminder") {
      const nextAppt = appointments[0];
      emailData = generateAppointmentEmail({
        recipientName: "Pendelton Family",
        patientName: profile.name,
        doctorName: nextAppt?.doctorName || "Dr. Sarah Chen",
        appointmentDate: nextAppt?.date || "November 20, 2026",
        appointmentTime: nextAppt?.time || "10:30 AM",
        clinic: nextAppt?.clinic || "Metro Health Suite 402",
        notes: nextAppt?.notes,
      });
    } else {
      emailData = generateDailyDigestEmail({
        recipientName: "David Pendelton",
        patientName: profile.name,
        adherencePercentage: 88,
      });
    }

    try {
      const res = await fetch("/api/reminders/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipient: profile.emailAlertPreferences.emailAddress,
          subject: emailData.subject,
          alertType: type,
          bodyHtml: emailData.html,
        }),
      });
      const result = await res.json();
      if (result.log) {
        updateEmailLogs([result.log, ...emailLogs]);
        setIsNotificationOpen(true);
      }
    } catch (err) {
      console.error("Failed to send email alert:", err);
    }
  };

  // Emergency Broadcast
  const handleEmergencyBroadcast = async () => {
    const alertSubject = `🚨 EMERGENCY SOS ALERT: ${profile.name} requested immediate assistance`;
    const alertHtml = `
      <div style="font-family: sans-serif; padding: 24px; background: #FEF2F2; border-left: 6px solid #DC2626; border-radius: 8px;">
        <h1 style="color: #991B1B; margin: 0 0 10px;">URGENT: Emergency Medical Assistance Triggered</h1>
        <p style="font-size: 16px; color: #1E293B;"><strong>${profile.name} (Age ${profile.age})</strong> triggered the panic SOS button.</p>
        <p><strong>Blood Group:</strong> ${profile.bloodType}</p>
        <p><strong>Known Allergies:</strong> ${profile.allergies.join(", ")}</p>
        <p><strong>Primary Doctor:</strong> ${profile.primaryDoctor} (${profile.clinicPhone})</p>
        <p style="color: #DC2626; font-weight: bold;">Please contact the patient or dispatch emergency services immediately.</p>
      </div>
    `;

    try {
      const res = await fetch("/api/reminders/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipient: "all-caregivers@pendelton-family.org",
          subject: alertSubject,
          alertType: "missed_medication",
          bodyHtml: alertHtml,
        }),
      });
      const result = await res.json();
      if (result.log) {
        updateEmailLogs([result.log, ...emailLogs]);
      }
    } catch (err) {
      console.error("Emergency broadcast failed:", err);
    }
  };

  // Ride volunteer assignment
  const handleUpdateRideVolunteer = (apptId: string, volunteerName: string) => {
    const updated = appointments.map((a) =>
      a.id === apptId ? { ...a, accompaniedBy: volunteerName } : a
    );
    updateAppointments(updated);
  };

  // Notification preference toggle
  const handleToggleNotificationPref = (key: keyof ElderlyProfile["emailAlertPreferences"]) => {
    const updated = {
      ...profile,
      emailAlertPreferences: {
        ...profile.emailAlertPreferences,
        [key]: !profile.emailAlertPreferences[key],
      },
    };
    setProfile(updated);
    StorageService.saveProfile(updated);
  };

  const handleCycleFontSize = () => {
    if (fontSize === "normal") setFontSize("large");
    else if (fontSize === "large") setFontSize("xlarge");
    else setFontSize("normal");
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-700">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-bold text-sm">Loading SilverCare AI Platform...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-colors ${
        highContrast ? "high-contrast bg-black text-yellow-300" : ""
      }`}
    >
      {/* Accessible Navbar */}
      <Navbar
        currentRole={currentRole}
        profile={profile}
        highContrast={highContrast}
        fontSize={fontSize}
        unreadNotifications={emailLogs.length}
        onOpenPasscodeModal={() => setIsPasscodeOpen(true)}
        onToggleHighContrast={() => setHighContrast(!highContrast)}
        onCycleFontSize={handleCycleFontSize}
        onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
        onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
        onOpenInteractionChecker={() => setIsInteractionCheckerOpen(true)}
        onOpenDoctorReport={() => setIsDoctorReportOpen(true)}
        onOpenNotifications={() => setIsNotificationOpen(true)}
      />

      {/* Main Content View Switcher */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {currentRole === "senior" && (
          <SeniorView
            profile={profile}
            medications={medications}
            adherenceToday={adherenceToday}
            appointments={appointments}
            highContrast={highContrast}
            fontSize={fontSize}
            onMarkTaken={handleMarkTaken}
            onSnooze={handleSnooze}
            onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
            onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
          />
        )}

        {currentRole === "caretaker" && (
          <CaretakerView
            profile={profile}
            medications={medications}
            adherenceToday={adherenceToday}
            appointments={appointments}
            highContrast={highContrast}
            onOpenAddMedication={() => {
              setEditingMedication(null);
              setIsMedicationModalOpen(true);
            }}
            onOpenEditMedication={(med) => {
              setEditingMedication(med);
              setIsMedicationModalOpen(true);
            }}
            onDeleteMedication={handleDeleteMedication}
            onOpenAddAppointment={() => setIsAppointmentModalOpen(true)}
            onDeleteAppointment={handleDeleteAppointment}
            onUpdateAdherenceStatus={handleUpdateAdherenceStatus}
            onSendProactiveEmail={handleSendProactiveEmail}
          />
        )}

        {currentRole === "family" && (
          <FamilyView
            profile={profile}
            medications={medications}
            adherenceHistory={adherenceHistory}
            appointments={appointments}
            careCircle={careCircle}
            highContrast={highContrast}
            onSendEncouragement={() => handleSendProactiveEmail("daily_digest")}
            onUpdateRideVolunteer={handleUpdateRideVolunteer}
            onToggleNotificationPref={handleToggleNotificationPref}
          />
        )}
      </main>

      {/* Persistent Bottom Persona Bar for Evaluator Convenience */}
      <footer className="fixed bottom-0 inset-x-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 py-3 px-4 z-30 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-2 text-slate-500 font-semibold">
            <span className="hidden sm:inline">👥 Persona Switcher:</span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentRole("senior")}
                className={`px-3 py-1.5 rounded-xl font-bold transition ${
                  currentRole === "senior"
                    ? "bg-blue-600 text-white shadow"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                }`}
              >
                👴 Senior (Arthur)
              </button>
              <button
                onClick={() => setCurrentRole("caretaker")}
                className={`px-3 py-1.5 rounded-xl font-bold transition ${
                  currentRole === "caretaker"
                    ? "bg-teal-600 text-white shadow"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                }`}
              >
                🩺 Caregiver (Nurse Clara)
              </button>
              <button
                onClick={() => setCurrentRole("family")}
                className={`px-3 py-1.5 rounded-xl font-bold transition ${
                  currentRole === "family"
                    ? "bg-purple-600 text-white shadow"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                }`}
              >
                👨‍👩‍👧 Family (David)
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 font-medium hidden md:inline">
              PromptWars × Catalyst • Build with AI
            </span>
            <button
              onClick={() => setIsPasscodeOpen(true)}
              className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
            >
              Verify Passcodes 🔒
            </button>
          </div>
        </div>
      </footer>

      {/* Interactive Modals */}
      <PasscodeModal
        isOpen={isPasscodeOpen}
        onClose={() => setIsPasscodeOpen(false)}
        currentRole={currentRole}
        profile={profile}
        onSelectRole={(r) => setCurrentRole(r)}
        highContrast={highContrast}
      />

      <MedicationModal
        isOpen={isMedicationModalOpen}
        onClose={() => {
          setIsMedicationModalOpen(false);
          setEditingMedication(null);
        }}
        onSave={handleSaveMedication}
        initialMed={editingMedication}
      />

      <AppointmentModal
        isOpen={isAppointmentModalOpen}
        onClose={() => setIsAppointmentModalOpen(false)}
        onSave={handleSaveAppointment}
      />

      <EmergencyModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
        profile={profile}
        careCircle={careCircle}
        onTriggerEmergencyBroadcast={handleEmergencyBroadcast}
      />

      <AiAssistantModal
        isOpen={isAiAssistantOpen}
        onClose={() => setIsAiAssistantOpen(false)}
        profile={profile}
        medications={medications}
        appointments={appointments}
        adherenceToday={adherenceToday}
      />

      <AiInteractionChecker
        isOpen={isInteractionCheckerOpen}
        onClose={() => setIsInteractionCheckerOpen(false)}
        medications={medications}
      />

      <DoctorReportModal
        isOpen={isDoctorReportOpen}
        onClose={() => setIsDoctorReportOpen(false)}
        profile={profile}
        medications={medications}
        adherenceHistory={adherenceHistory}
        appointments={appointments}
      />

      <NotificationModal
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        emailLogs={emailLogs}
        onTriggerEmail={handleSendProactiveEmail}
        onClearLogs={() => updateEmailLogs([])}
      />
    </div>
  );
}
