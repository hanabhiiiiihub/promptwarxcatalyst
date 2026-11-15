"use client";

import React, { useState } from "react";
import { DoctorAppointment } from "@/lib/types";
import { X, Calendar, Save } from "lucide-react";

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (appt: DoctorAppointment) => void;
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [doctorName, setDoctorName] = useState("");
  const [specialty, setSpecialty] = useState("General Medicine");
  const [clinic, setClinic] = useState("");
  const [address, setAddress] = useState("");
  const [date, setDate] = useState("2026-11-25");
  const [time, setTime] = useState("10:00 AM");
  const [accompaniedBy, setAccompaniedBy] = useState("David Pendelton (Son)");
  const [notes, setNotes] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctorName.trim() || !clinic.trim()) return;

    const newAppt: DoctorAppointment = {
      id: `appt-${Date.now()}`,
      doctorName: doctorName.trim(),
      specialty: specialty.trim(),
      clinic: clinic.trim(),
      address: address.trim() || clinic.trim(),
      date,
      time,
      accompaniedBy,
      notes: notes.trim() || "Regular clinical checkup",
      status: "upcoming",
      preparationChecklist: [
        "Bring photo ID and Medicare card",
        "Bring current medications list",
      ],
    };

    onSave(newAppt);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
    >
      <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-7">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Schedule Doctor Visit</h3>
              <p className="text-xs text-slate-500">Upcoming clinical appointment for Arthur</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-5 text-xs font-semibold">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 mb-1">Doctor Name *</label>
            <input
              type="text"
              required
              value={doctorName}
              onChange={(e) => setDoctorName(e.target.value)}
              placeholder="e.g. Dr. Robert Miller, MD"
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1">Specialty</label>
              <input
                type="text"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                placeholder="Cardiology / Neurology"
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-medium"
              />
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1">Accompanied By</label>
              <select
                value={accompaniedBy}
                onChange={(e) => setAccompaniedBy(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-medium"
              >
                <option value="David Pendelton (Son)">David (Son)</option>
                <option value="Clara Vance, RN (Caregiver)">Clara (Nurse)</option>
                <option value="Emily Pendelton (Daughter)">Emily (Daughter)</option>
                <option value="Medical Transport">Medical Transport</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1">Date *</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-medium"
              />
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1">Time *</label>
              <input
                type="text"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="10:30 AM"
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 mb-1">Clinic / Hospital *</label>
            <input
              type="text"
              required
              value={clinic}
              onChange={(e) => setClinic(e.target.value)}
              placeholder="Metro Health Center Suite 300"
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-medium"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 mb-1">Preparation & Clinical Notes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Fasting required. Bring recent blood sugar log."
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-medium"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 font-bold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold flex items-center gap-2 shadow-md transition"
            >
              <Save className="w-4 h-4" /> Save Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
