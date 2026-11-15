"use client";

import React, { useState } from "react";
import {
  Medication,
  AdherenceRecord,
  DoctorAppointment,
  ElderlyProfile,
} from "@/lib/types";
import {
  Plus,
  Edit2,
  Trash2,
  Calendar,
  AlertTriangle,
  Mail,
  Clock,
  CheckCircle2,
  XCircle,
  FileCheck,
  Package,
  Activity,
  HeartPulse,
} from "lucide-react";

interface CaretakerViewProps {
  profile: ElderlyProfile;
  medications: Medication[];
  adherenceToday: AdherenceRecord[];
  appointments: DoctorAppointment[];
  highContrast: boolean;
  onOpenAddMedication: () => void;
  onOpenEditMedication: (med: Medication) => void;
  onDeleteMedication: (medId: string) => void;
  onOpenAddAppointment: () => void;
  onDeleteAppointment: (apptId: string) => void;
  onUpdateAdherenceStatus: (
    recordId: string,
    status: "taken" | "skipped" | "snoozed",
    skipReason?: string
  ) => void;
  onSendProactiveEmail: (type: "missed_medication" | "appointment_reminder") => void;
}

export const CaretakerView: React.FC<CaretakerViewProps> = ({
  profile,
  medications,
  adherenceToday,
  appointments,
  highContrast,
  onOpenAddMedication,
  onOpenEditMedication,
  onDeleteMedication,
  onOpenAddAppointment,
  onDeleteAppointment,
  onUpdateAdherenceStatus,
  onSendProactiveEmail,
}) => {
  const [selectedSkipRecord, setSelectedSkipRecord] = useState<string | null>(null);
  const [skipReasonInput, setSkipReasonInput] = useState<string>("Felt nauseated after meal");

  // Refill alerts calculation
  const lowRefillMeds = medications.filter(
    (m) => m.active && m.pillsRemaining <= m.refillThreshold
  );

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-6">
      {/* Caregiver Overview Banner */}
      <div
        className={`p-6 sm:p-8 rounded-3xl transition-all border ${
          highContrast
            ? "bg-black border-yellow-400 text-yellow-300"
            : "bg-gradient-to-r from-teal-700 via-teal-800 to-slate-900 text-white shadow-xl"
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-600/40 border border-teal-400/30 text-xs font-bold uppercase tracking-wider text-teal-200">
              <Activity className="w-4 h-4" /> Caretaker & Clinical Portal
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Patient Care Management: {profile.name}
            </h1>
            <p className="text-teal-100 text-sm">
              Age {profile.age} • Blood Type: <strong>{profile.bloodType}</strong> • Primary Dr:{" "}
              {profile.primaryDoctor}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={onOpenAddMedication}
              className="px-4 py-2.5 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg transition"
            >
              <Plus className="w-4 h-4 stroke-[3]" /> Add Medication
            </button>
            <button
              onClick={onOpenAddAppointment}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-sm flex items-center gap-2 transition"
            >
              <Calendar className="w-4 h-4" /> Schedule Visit
            </button>
          </div>
        </div>
      </div>

      {/* Low Pill Refill Inventory Alerts */}
      {lowRefillMeds.length > 0 && (
        <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center flex-shrink-0">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-amber-900 dark:text-amber-200 text-sm">
                Pharmacy Refill Alert Required ({lowRefillMeds.length} items low)
              </h4>
              <p className="text-xs text-amber-700 dark:text-amber-300">
                {lowRefillMeds
                  .map((m) => `${m.name}: ${m.pillsRemaining} doses remaining`)
                  .join(" • ")}
              </p>
            </div>
          </div>
          <button
            onClick={() => onSendProactiveEmail("missed_medication")}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition flex items-center gap-2"
          >
            <Mail className="w-4 h-4" /> Notify Family
          </button>
        </div>
      )}

      {/* Today's Clinical Adherence Tracking */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Today&apos;s Adherence Tracking</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Real-time administration status for caregiver verification
            </p>
          </div>
          <button
            onClick={() => onSendProactiveEmail("missed_medication")}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <Mail className="w-3.5 h-3.5" /> Trigger Missed Dose Alert Email
          </button>
        </div>

        <div className="grid gap-3">
          {adherenceToday.map((record) => {
            const med = medications.find((m) => m.id === record.medicationId);
            if (!med) return null;

            return (
              <div
                key={record.id}
                className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-xs"
                    style={{ backgroundColor: med.color }}
                  >
                    {med.form.slice(0, 3).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-base">{med.name}</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                        {med.dosage}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                      <Clock className="w-3.5 h-3.5" /> Scheduled: {record.scheduledTime}
                      <span>•</span>
                      <span>{med.mealRelation.replace("_", " ")}</span>
                    </div>
                  </div>
                </div>

                {/* Status Badges & Quick Action Controls */}
                <div className="flex items-center gap-2 flex-wrap">
                  {record.status === "taken" && (
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Taken (
                      {record.takenAt || "Verified"})
                    </span>
                  )}

                  {record.status === "skipped" && (
                    <span className="px-3 py-1.5 rounded-xl bg-rose-100 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 text-xs font-bold flex items-center gap-1.5">
                      <XCircle className="w-4 h-4 text-rose-600" /> Skipped: {record.skipReason || "No reason specified"}
                    </span>
                  )}

                  {record.status === "pending" && (
                    <span className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-slate-500" /> Pending Confirmation
                    </span>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 ml-auto md:ml-2">
                    <button
                      onClick={() => onUpdateAdherenceStatus(record.id, "taken")}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition"
                    >
                      Administer
                    </button>
                    <button
                      onClick={() => setSelectedSkipRecord(record.id)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 hover:text-rose-600 text-slate-600 dark:text-slate-300 text-xs font-bold border border-slate-200 dark:border-slate-700 transition"
                    >
                      Hold/Skip
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Skip Reason Modal if triggered */}
      {selectedSkipRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <h4 className="font-bold text-base">Record Reason for Skipping Dose</h4>
            <p className="text-xs text-slate-500">
              Provide clinical justification for doctor & family review:
            </p>
            <select
              value={skipReasonInput}
              onChange={(e) => setSkipReasonInput(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-medium"
            >
              <option value="Felt nauseated after meal">Felt nauseated after meal</option>
              <option value="Doctor advised temporary hold">Doctor advised temporary hold</option>
              <option value="Patient asleep / Resting">Patient asleep / Resting</option>
              <option value="Low blood pressure reading">Low blood pressure reading</option>
              <option value="Fasting for upcoming blood test">Fasting for upcoming blood test</option>
            </select>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedSkipRecord(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onUpdateAdherenceStatus(selectedSkipRecord, "skipped", skipReasonInput);
                  setSelectedSkipRecord(null);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700"
              >
                Confirm Skip
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Medication Management Directory */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Full Medication Roster</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {medications.length} active medications configured
            </p>
          </div>
          <button
            onClick={onOpenAddMedication}
            className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Add New Rx
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {medications.map((med) => (
            <div
              key={med.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-4 h-4 rounded-full flex-shrink-0"
                      style={{ backgroundColor: med.color }}
                    />
                    <h3 className="font-bold text-base">{med.name}</h3>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onOpenEditMedication(med)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      title="Edit Medication"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteMedication(med.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      title="Delete Medication"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="mt-2 space-y-1 text-xs text-slate-600 dark:text-slate-400">
                  <p>
                    <strong>Dosage:</strong> {med.dosage} ({med.frequency})
                  </p>
                  <p>
                    <strong>Schedule:</strong> {med.scheduledTimes.join(", ")}
                  </p>
                  <p>
                    <strong>Meal rule:</strong> {med.mealRelation.replace("_", " ")}
                  </p>
                  <p className="line-clamp-2">
                    <strong>Instructions:</strong> {med.instructions}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold">
                <span
                  className={
                    med.pillsRemaining <= med.refillThreshold
                      ? "text-amber-600 dark:text-amber-400 font-bold"
                      : "text-slate-500"
                  }
                >
                  📦 {med.pillsRemaining} of {med.totalPillsInRefill} pills left
                </span>
                <span className="text-teal-600 dark:text-teal-400">{med.prescribedBy}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Doctor Appointments Management */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Upcoming Doctor Appointments</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Synchronized with family ride coordinators
            </p>
          </div>
          <button
            onClick={onOpenAddAppointment}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Schedule New Visit
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {appointments.map((appt) => (
            <div
              key={appt.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                    {appt.specialty}
                  </span>
                  <h3 className="font-bold text-base mt-0.5">{appt.doctorName}</h3>
                </div>
                <button
                  onClick={() => onDeleteAppointment(appt.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  title="Remove Appointment"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="text-xs space-y-1 text-slate-600 dark:text-slate-400">
                <p>
                  📅 <strong>{appt.date}</strong> at <strong>{appt.time}</strong>
                </p>
                <p>📍 {appt.clinic}</p>
                {appt.accompaniedBy && (
                  <p>
                    🚗 <strong>Escort:</strong> {appt.accompaniedBy}
                  </p>
                )}
                <p className="italic bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl text-slate-700 dark:text-slate-300">
                  {appt.notes}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
