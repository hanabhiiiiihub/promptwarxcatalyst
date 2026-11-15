export type UserRole = "senior" | "caretaker" | "family";

export interface CareCircleMember {
  id: string;
  name: string;
  role: UserRole;
  relationship: string;
  phone: string;
  email: string;
  isEmergencyContact: boolean;
  avatarColor: string;
}

export type MedicationForm = "tablet" | "capsule" | "liquid" | "injection" | "inhaler" | "drops";

export type MealRelation = "before_meal" | "with_meal" | "after_meal" | "empty_stomach" | "anytime";

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  form: MedicationForm;
  color: string;
  iconShape: "round" | "oval" | "capsule" | "bottle" | "drop";
  scheduledTimes: string[];
  frequency: string;
  mealRelation: MealRelation;
  instructions: string;
  purpose: string;
  prescribedBy: string;
  pillsRemaining: number;
  totalPillsInRefill: number;
  refillThreshold: number;
  startDate: string;
  active: boolean;
}

export type AdherenceStatus = "taken" | "pending" | "skipped" | "snoozed";

export interface AdherenceRecord {
  id: string;
  medicationId: string;
  medicationName: string;
  scheduledTime: string;
  date: string;
  status: AdherenceStatus;
  takenAt?: string;
  loggedBy: string;
  skipReason?: string;
  notes?: string;
}

export interface DoctorAppointment {
  id: string;
  doctorName: string;
  specialty: string;
  clinic: string;
  address: string;
  date: string;
  time: string;
  accompaniedBy: string;
  notes: string;
  status: "upcoming" | "completed" | "cancelled";
  preparationChecklist: string[];
}

export interface HealthcareRoutine {
  id: string;
  title: string;
  category: "vitals" | "exercise" | "hydration" | "wellness";
  scheduledTime: string;
  frequency: string;
  completed: boolean;
  completedAt?: string;
  targetMetric?: string;
  notes?: string;
}

export interface ElderlyProfile {
  id: string;
  name: string;
  preferredName: string;
  age: number;
  dateOfBirth: string;
  bloodType: string;
  allergies: string[];
  chronicConditions: string[];
  primaryDoctor: string;
  clinicPhone: string;
  passcodes: {
    senior: string;
    caretaker: string;
    family: string;
  };
  emailAlertPreferences: {
    emailAddress: string;
    notifyOnMissedDose: boolean;
    notifyOnUpcomingDose: boolean;
    notifyOnUpcomingAppointment: boolean;
    notifyDailyDigest: boolean;
  };
}

export interface EmailLog {
  id: string;
  recipient: string;
  subject: string;
  alertType: "missed_medication" | "upcoming_dose" | "appointment_reminder" | "daily_digest";
  bodyHtml: string;
  sentAt: string;
  status: "delivered" | "simulated" | "failed";
}

export interface DrugInteraction {
  severity: "low" | "moderate" | "high" | "critical";
  drugsInvolved: string[];
  effect: string;
  recommendation: string;
}

export interface InteractionReport {
  timestamp: string;
  overallSafetyScore: "safe" | "caution" | "warning";
  summary: string;
  interactions: DrugInteraction[];
  foodWarnings: string[];
  source: "gemini" | "rule-based-engine";
}
