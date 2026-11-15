"use client";

import React from "react";
import {
  ElderlyProfile,
  Medication,
  AdherenceRecord,
  DoctorAppointment,
} from "@/lib/types";
import { X, Printer, FileText, CheckCircle, AlertCircle } from "lucide-react";

interface DoctorReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ElderlyProfile;
  medications: Medication[];
  adherenceHistory: AdherenceRecord[];
  appointments: DoctorAppointment[];
}

export const DoctorReportModal: React.FC<DoctorReportModalProps> = ({
  isOpen,
  onClose,
  profile,
  medications,
  adherenceHistory,
  appointments,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const activeMeds = medications.filter((m) => m.active);
  const totalTaken = adherenceHistory.filter((a) => a.status === "taken").length;
  const adherenceRate =
    adherenceHistory.length > 0
      ? Math.round((totalTaken / adherenceHistory.length) * 100)
      : 100;

  const skippedRecords = adherenceHistory.filter((a) => a.status === "skipped");

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn"
    >
      <div className="w-full max-w-3xl max-h-[90vh] rounded-3xl bg-white text-slate-900 border border-slate-200 shadow-2xl flex flex-col overflow-hidden">
        {/* Header Actions */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-base">Doctor Visit Clinical Summary</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
            >
              <Printer className="w-4 h-4" /> Print / Save as PDF
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 print:p-0 print:overflow-visible text-xs font-sans">
          {/* Document Header */}
          <div className="border-b-2 border-slate-900 pb-4 flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-950 uppercase">
                Clinical Health & Medication Summary
              </h1>
              <p className="text-slate-600 font-semibold mt-0.5">
                SilverCare Healthcare Ecosystem • Patient Self & Caretaker Log
              </p>
            </div>
            <div className="text-right text-[11px] text-slate-500 font-medium">
              <p>Generated: {new Date().toLocaleDateString()}</p>
              <p>Primary MD: {profile.primaryDoctor}</p>
            </div>
          </div>

          {/* Patient Demographics */}
          <div className="grid grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500">Patient</span>
              <p className="font-bold text-sm text-slate-900">{profile.name}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500">Age / DOB</span>
              <p className="font-bold text-sm text-slate-900">
                {profile.age} yrs ({profile.dateOfBirth})
              </p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500">Blood Group</span>
              <p className="font-bold text-sm text-red-600">{profile.bloodType}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500">Adherence Rate</span>
              <p className="font-bold text-sm text-emerald-600">{adherenceRate}%</p>
            </div>
            <div className="col-span-2 pt-2 border-t border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-500">Chronic Diagnoses</span>
              <p className="font-semibold text-slate-800">{profile.chronicConditions.join(", ")}</p>
            </div>
            <div className="col-span-2 pt-2 border-t border-slate-200">
              <span className="text-[10px] uppercase font-bold text-red-600">⚠️ Known Allergies</span>
              <p className="font-bold text-red-700">{profile.allergies.join(", ")}</p>
            </div>
          </div>

          {/* Active Medications Table */}
          <div className="space-y-2">
            <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
              Active Prescriptions ({activeMeds.length})
            </h3>
            <table className="w-full text-left border-collapse border border-slate-200 text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-700">
                  <th className="p-2 border border-slate-200">Medication</th>
                  <th className="p-2 border border-slate-200">Dosage</th>
                  <th className="p-2 border border-slate-200">Frequency & Timing</th>
                  <th className="p-2 border border-slate-200">Meal Rule</th>
                  <th className="p-2 border border-slate-200">Prescriber</th>
                  <th className="p-2 border border-slate-200">Inventory</th>
                </tr>
              </thead>
              <tbody>
                {activeMeds.map((med) => (
                  <tr key={med.id} className="border-b border-slate-200">
                    <td className="p-2 font-bold text-slate-900 border border-slate-200">
                      {med.name}
                    </td>
                    <td className="p-2 border border-slate-200">{med.dosage}</td>
                    <td className="p-2 border border-slate-200">
                      {med.frequency} ({med.scheduledTimes.join(", ")})
                    </td>
                    <td className="p-2 border border-slate-200 capitalize">
                      {med.mealRelation.replace("_", " ")}
                    </td>
                    <td className="p-2 border border-slate-200">{med.prescribedBy}</td>
                    <td className="p-2 border border-slate-200">
                      {med.pillsRemaining} doses remaining
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Recent Dose Exceptions / Skipped Records */}
          <div className="space-y-2">
            <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
              Adherence Observations & Skip Reasons
            </h3>
            {skippedRecords.length === 0 ? (
              <p className="text-slate-500 italic">No missed or skipped doses recorded in this cycle.</p>
            ) : (
              <div className="space-y-1.5">
                {skippedRecords.map((s) => (
                  <div
                    key={s.id}
                    className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-900"
                  >
                    <strong>{s.medicationName}</strong> on {s.date} at {s.scheduledTime} —{" "}
                    <em>Skip Reason: {s.skipReason}</em> (Logged by {s.loggedBy})
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Schedule */}
          <div className="space-y-2">
            <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
              Scheduled Specialist Appointments
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {appointments.slice(0, 2).map((a) => (
                <div key={a.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                  <p className="font-bold text-slate-900">{a.doctorName}</p>
                  <p className="text-slate-600">
                    {a.specialty} • {a.date} at {a.time}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1 italic">{a.notes}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Signature Block */}
          <div className="pt-8 border-t border-slate-300 grid grid-cols-2 gap-8 text-[11px] text-slate-500">
            <div>
              <div className="border-b border-slate-400 w-48 mb-1" />
              <p>Primary Physician Signature / Date</p>
            </div>
            <div>
              <div className="border-b border-slate-400 w-48 mb-1" />
              <p>Family Guardian / Caregiver Verification</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
