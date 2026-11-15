"use client";

import React, { useState, useEffect } from "react";
import { Medication, MedicationForm, MealRelation } from "@/lib/types";
import { X, Pill, Save } from "lucide-react";

interface MedicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (med: Medication) => void;
  initialMed?: Medication | null;
}

const COLOR_OPTIONS = [
  { label: "Blue", value: "#3B82F6" },
  { label: "Green", value: "#10B981" },
  { label: "Rose", value: "#EC4899" },
  { label: "Amber", value: "#F59E0B" },
  { label: "Purple", value: "#8B5CF6" },
  { label: "Teal", value: "#14B8A6" },
];

export const MedicationModal: React.FC<MedicationModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialMed,
}) => {
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [form, setForm] = useState<MedicationForm>("tablet");
  const [color, setColor] = useState("#3B82F6");
  const [frequency, setFrequency] = useState("Daily");
  const [time1, setTime1] = useState("08:00 AM");
  const [time2, setTime2] = useState("");
  const [mealRelation, setMealRelation] = useState<MealRelation>("with_meal");
  const [instructions, setInstructions] = useState("");
  const [purpose, setPurpose] = useState("");
  const [prescribedBy, setPrescribedBy] = useState("Dr. Sarah Chen, MD");
  const [pillsRemaining, setPillsRemaining] = useState<number>(30);
  const [totalPillsInRefill, setTotalPillsInRefill] = useState<number>(60);
  const [refillThreshold, setRefillThreshold] = useState<number>(7);

  useEffect(() => {
    if (initialMed) {
      setName(initialMed.name);
      setDosage(initialMed.dosage);
      setForm(initialMed.form);
      setColor(initialMed.color);
      setFrequency(initialMed.frequency);
      setTime1(initialMed.scheduledTimes[0] || "08:00 AM");
      setTime2(initialMed.scheduledTimes[1] || "");
      setMealRelation(initialMed.mealRelation);
      setInstructions(initialMed.instructions);
      setPurpose(initialMed.purpose);
      setPrescribedBy(initialMed.prescribedBy);
      setPillsRemaining(initialMed.pillsRemaining);
      setTotalPillsInRefill(initialMed.totalPillsInRefill);
      setRefillThreshold(initialMed.refillThreshold);
    } else {
      setName("");
      setDosage("10 mg");
      setForm("tablet");
      setColor("#3B82F6");
      setFrequency("Daily");
      setTime1("08:00 AM");
      setTime2("");
      setMealRelation("with_meal");
      setInstructions("Take with water after breakfast.");
      setPurpose("General health maintenance");
      setPrescribedBy("Dr. Sarah Chen, MD");
      setPillsRemaining(30);
      setTotalPillsInRefill(60);
      setRefillThreshold(7);
    }
  }, [initialMed, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const scheduledTimes = [time1];
    if (time2.trim()) scheduledTimes.push(time2.trim());

    const updated: Medication = {
      id: initialMed?.id || `med-${Date.now()}`,
      name: name.trim(),
      dosage: dosage.trim() || "1 tablet",
      form,
      color,
      iconShape: "oval",
      scheduledTimes,
      frequency,
      mealRelation,
      instructions: instructions.trim() || "Take as directed by doctor.",
      purpose: purpose.trim() || "Prescribed therapy",
      prescribedBy: prescribedBy.trim() || "Primary Physician",
      pillsRemaining: Number(pillsRemaining) || 30,
      totalPillsInRefill: Number(totalPillsInRefill) || 60,
      refillThreshold: Number(refillThreshold) || 7,
      startDate: initialMed?.startDate || new Date().toISOString().split("T")[0],
      active: true,
    };

    onSave(updated);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
    >
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-7">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg">
                {initialMed ? "Edit Medication Schedule" : "Add New Medication"}
              </h3>
              <p className="text-xs text-slate-500">Configure prescription dosage & reminders</p>
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
          {/* Name & Dosage */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1">Medication Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Metformin HCl"
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-medium"
              />
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1">Dosage *</label>
              <input
                type="text"
                required
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                placeholder="e.g. 500 mg"
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-medium"
              />
            </div>
          </div>

          {/* Form & Color */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1">Pill Form</label>
              <select
                value={form}
                onChange={(e) => setForm(e.target.value as MedicationForm)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-medium"
              >
                <option value="tablet">Tablet</option>
                <option value="capsule">Capsule</option>
                <option value="liquid">Liquid / Syrup</option>
                <option value="drops">Eye/Ear Drops</option>
                <option value="inhaler">Inhaler</option>
                <option value="injection">Injection</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1">Visual Color Marker</label>
              <div className="flex gap-2 items-center pt-1">
                {COLOR_OPTIONS.map((c) => (
                  <button
                    type="button"
                    key={c.value}
                    onClick={() => setColor(c.value)}
                    className={`w-7 h-7 rounded-full transition-transform ${
                      color === c.value ? "scale-125 ring-2 ring-offset-2 ring-blue-500" : ""
                    }`}
                    style={{ backgroundColor: c.value }}
                    title={c.label}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Times & Meal Relation */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1">Primary Dose Time</label>
              <input
                type="text"
                value={time1}
                onChange={(e) => setTime1(e.target.value)}
                placeholder="08:00 AM"
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-medium"
              />
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1">Second Dose Time (Optional)</label>
              <input
                type="text"
                value={time2}
                onChange={(e) => setTime2(e.target.value)}
                placeholder="08:00 PM"
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-medium"
              />
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1">Meal Relation</label>
              <select
                value={mealRelation}
                onChange={(e) => setMealRelation(e.target.value as MealRelation)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-medium"
              >
                <option value="with_meal">With Meal</option>
                <option value="before_meal">Before Meal</option>
                <option value="after_meal">After Meal</option>
                <option value="empty_stomach">Empty Stomach</option>
                <option value="anytime">Anytime</option>
              </select>
            </div>
          </div>

          {/* Clinical Purpose & Prescribing Doctor */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1">Purpose / Condition</label>
              <input
                type="text"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="e.g. Blood pressure regulation"
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-medium"
              />
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1">Prescribed By</label>
              <input
                type="text"
                value={prescribedBy}
                onChange={(e) => setPrescribedBy(e.target.value)}
                placeholder="Dr. Sarah Chen, MD"
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-medium"
              />
            </div>
          </div>

          {/* Instructions */}
          <div>
            <label className="block text-slate-700 dark:text-slate-300 mb-1">Special Instructions for Senior</label>
            <textarea
              rows={2}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Take with a full glass of water. Do not crush."
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-medium"
            />
          </div>

          {/* Inventory Tracking */}
          <div className="grid grid-cols-3 gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
            <div>
              <label className="block text-slate-600 dark:text-slate-400 mb-1">Pills Remaining</label>
              <input
                type="number"
                min="0"
                value={pillsRemaining}
                onChange={(e) => setPillsRemaining(Number(e.target.value))}
                className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-bold"
              />
            </div>
            <div>
              <label className="block text-slate-600 dark:text-slate-400 mb-1">Total in Refill</label>
              <input
                type="number"
                min="1"
                value={totalPillsInRefill}
                onChange={(e) => setTotalPillsInRefill(Number(e.target.value))}
                className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-bold"
              />
            </div>
            <div>
              <label className="block text-slate-600 dark:text-slate-400 mb-1">Low Alert At</label>
              <input
                type="number"
                min="1"
                value={refillThreshold}
                onChange={(e) => setRefillThreshold(Number(e.target.value))}
                className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-bold"
              />
            </div>
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
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-2 shadow-md transition"
            >
              <Save className="w-4 h-4" /> Save Schedule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
