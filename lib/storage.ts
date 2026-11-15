import {
  ElderlyProfile,
  Medication,
  DoctorAppointment,
  CareCircleMember,
  AdherenceRecord,
  EmailLog,
} from "./types";
import {
  initialElderlyProfile,
  initialCareCircle,
  initialMedications,
  initialAppointments,
  initialAdherenceHistory,
  initialEmailLogs,
} from "./mock-data";

const STORAGE_KEYS = {
  PROFILE: "silvercare_profile_v1",
  MEMBERS: "silvercare_members_v1",
  MEDICATIONS: "silvercare_medications_v1",
  APPOINTMENTS: "silvercare_appointments_v1",
  ADHERENCE: "silvercare_adherence_v1",
  EMAILS: "silvercare_emails_v1",
  ACTIVE_ROLE: "silvercare_active_role_v1",
  FONT_SCALE: "silvercare_font_scale_v1",
  HIGH_CONTRAST: "silvercare_high_contrast_v1",
};

export const StorageService = {
  getProfile(): ElderlyProfile {
    if (typeof window === "undefined") return initialElderlyProfile;
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return stored ? JSON.parse(stored) : initialElderlyProfile;
    } catch {
      return initialElderlyProfile;
    }
  },

  saveProfile(profile: ElderlyProfile): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  },

  getMembers(): CareCircleMember[] {
    if (typeof window === "undefined") return initialCareCircle;
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.MEMBERS);
      return stored ? JSON.parse(stored) : initialCareCircle;
    } catch {
      return initialCareCircle;
    }
  },

  getMedications(): Medication[] {
    if (typeof window === "undefined") return initialMedications;
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.MEDICATIONS);
      return stored ? JSON.parse(stored) : initialMedications;
    } catch {
      return initialMedications;
    }
  },

  saveMedications(meds: Medication[]): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEYS.MEDICATIONS, JSON.stringify(meds));
  },

  getAppointments(): DoctorAppointment[] {
    if (typeof window === "undefined") return initialAppointments;
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
      return stored ? JSON.parse(stored) : initialAppointments;
    } catch {
      return initialAppointments;
    }
  },

  saveAppointments(appts: DoctorAppointment[]): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appts));
  },

  getAdherenceHistory(): AdherenceRecord[] {
    if (typeof window === "undefined") return initialAdherenceHistory;
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ADHERENCE);
      return stored ? JSON.parse(stored) : initialAdherenceHistory;
    } catch {
      return initialAdherenceHistory;
    }
  },

  saveAdherenceHistory(records: AdherenceRecord[]): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEYS.ADHERENCE, JSON.stringify(records));
  },

  getEmailLogs(): EmailLog[] {
    if (typeof window === "undefined") return initialEmailLogs;
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.EMAILS);
      return stored ? JSON.parse(stored) : initialEmailLogs;
    } catch {
      return initialEmailLogs;
    }
  },

  saveEmailLogs(emails: EmailLog[]): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEYS.EMAILS, JSON.stringify(emails));
  },

  resetToDefault(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(STORAGE_KEYS.PROFILE);
    localStorage.removeItem(STORAGE_KEYS.MEMBERS);
    localStorage.removeItem(STORAGE_KEYS.MEDICATIONS);
    localStorage.removeItem(STORAGE_KEYS.APPOINTMENTS);
    localStorage.removeItem(STORAGE_KEYS.ADHERENCE);
    localStorage.removeItem(STORAGE_KEYS.EMAILS);
  },
};
