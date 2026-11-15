"use client";

import React, { useState, useCallback } from "react";
import {
  Medication,
  AdherenceRecord,
  DoctorAppointment,
  ElderlyProfile,
  HealthcareRoutine,
} from "@/lib/types";
import { speakText } from "@/lib/tts";
import {
  Check,
  Clock,
  Volume2,
  Calendar,
  Sparkles,
  PhoneCall,
  Smile,
  ShieldCheck,
  Activity,
  Droplets,
} from "lucide-react";

interface SeniorViewProps {
  profile: ElderlyProfile;
  medications: Medication[];
  adherenceToday: AdherenceRecord[];
  appointments: DoctorAppointment[];
  routines: HealthcareRoutine[];
  highContrast: boolean;
  fontSize: "normal" | "large" | "xlarge";
  onMarkTaken: (medId: string, time: string) => void;
  onSnooze: (medId: string, time: string) => void;
  onToggleRoutine: (routineId: string) => void;
  onOpenAiAssistant: () => void;
  onOpenEmergencyModal: () => void;
}

export const SeniorView: React.FC<SeniorViewProps> = React.memo(
  ({
    profile,
    medications,
    adherenceToday,
    appointments,
    routines,
    highContrast,
    fontSize,
    onMarkTaken,
    onSnooze,
    onToggleRoutine,
    onOpenAiAssistant,
    onOpenEmergencyModal,
  }) => {
    const [activeSpeechCard, setActiveSpeechCard] = useState<string | null>(null);

    const takenCount = adherenceToday.filter((a) => a.status === "taken").length;
    const totalToday = adherenceToday.length;
    const progressPercent = totalToday > 0 ? Math.round((takenCount / totalToday) * 100) : 100;

    const nextAppointment = appointments.find((a) => a.status === "upcoming");

    const fontClass =
      fontSize === "xlarge"
        ? "text-xl sm:text-2xl"
        : fontSize === "large"
        ? "text-lg sm:text-xl"
        : "text-base sm:text-lg";

    const handleReadDose = useCallback(
      (med: Medication, time: string, status: string) => {
        setActiveSpeechCard(med.id);
        const speech = `Medication: ${med.name}, dosage: ${med.dosage}. Scheduled for ${time}. ${med.instructions}. Current status is: ${status}.`;
        speakText(speech, () => setActiveSpeechCard(null));
      },
      []
    );

    const handleReadAppointment = useCallback(() => {
      if (!nextAppointment) return;
      const speech = `Your next doctor visit is with ${nextAppointment.doctorName} on ${nextAppointment.date} at ${nextAppointment.time}. Located at ${nextAppointment.clinic}. ${nextAppointment.accompaniedBy ? "You will be accompanied by " + nextAppointment.accompaniedBy : ""}.`;
      speakText(speech);
    }, [nextAppointment]);

    return (
      <div className={`space-y-8 max-w-4xl mx-auto py-6 ${fontClass}`}>
        {/* Warm Greeting & Adherence Banner */}
        <div
          className={`p-6 sm:p-8 rounded-3xl transition-all border ${
            highContrast
              ? "bg-black border-yellow-400 text-yellow-300"
              : "bg-gradient-to-br from-blue-500 via-teal-600 to-indigo-700 text-white shadow-xl shadow-blue-500/10"
          }`}
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-bold uppercase tracking-wider">
                <Smile className="w-4 h-4" /> Good Day, {profile.preferredName || "Grandpa Arthur"}
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Today&apos;s Health Routine
              </h1>
              <p className="text-base sm:text-lg text-white/90">
                {takenCount} of {totalToday} scheduled medications taken today.
              </p>
            </div>

            {/* Adherence Ring & Percentage */}
            <div className="flex items-center gap-4 bg-white/10 dark:bg-black/40 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20">
              <div className="text-right">
                <div className="text-3xl sm:text-4xl font-black">{progressPercent}%</div>
                <div className="text-xs uppercase font-bold tracking-wider opacity-80">
                  Completed
                </div>
              </div>
              <div className="w-12 h-12 rounded-full border-4 border-white/30 border-t-white flex items-center justify-center">
                <Check className="w-6 h-6 stroke-[3]" />
              </div>
            </div>
          </div>
        </div>

        {/* Today's Medications List */}
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
              <span>💊</span> Today&apos;s Medications
            </h2>
            <span className="text-sm font-semibold opacity-75">Tap large green button when taken</span>
          </div>

          <div className="grid gap-5">
            {adherenceToday.map((record) => {
              const med = medications.find((m) => m.id === record.medicationId);
              if (!med) return null;

              const isTaken = record.status === "taken";
              const isSnoozed = record.status === "snoozed";

              return (
                <div
                  key={record.id}
                  className={`p-6 sm:p-7 rounded-3xl transition-all border-2 ${
                    isTaken
                      ? highContrast
                        ? "bg-black border-green-500 text-green-300"
                        : "bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800"
                      : isSnoozed
                      ? "bg-amber-50/70 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800"
                      : highContrast
                      ? "bg-black border-yellow-400 text-yellow-300"
                      : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-lg shadow-slate-200/50 dark:shadow-none"
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex items-start gap-4">
                      <div
                        className="w-16 h-16 rounded-2xl flex-shrink-0 flex items-center justify-center text-white font-extrabold shadow-md"
                        style={{ backgroundColor: med.color || "#3B82F6" }}
                      >
                        <span className="text-xs uppercase">{med.form.slice(0, 3)}</span>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="text-2xl font-black tracking-tight">{med.name}</h3>
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
                            {med.dosage}
                          </span>
                          <span className="flex items-center gap-1 text-sm font-bold text-blue-600 dark:text-blue-400">
                            <Clock className="w-4 h-4" /> {record.scheduledTime}
                          </span>
                        </div>

                        <p className="text-base font-medium opacity-90 leading-relaxed">
                          {med.instructions}
                        </p>

                        <div className="flex items-center gap-3 pt-1 text-sm opacity-75">
                          <span>Purpose: {med.purpose}</span>
                          {isTaken && (
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                              <ShieldCheck className="w-4 h-4" /> Taken at {record.takenAt || "Morning"}
                            </span>
                          )}
                          {isSnoozed && (
                            <span className="text-amber-600 dark:text-amber-400 font-bold">
                              ⏰ Snoozed (15m reminder active)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
                      <button
                        onClick={() => handleReadDose(med, record.scheduledTime, record.status)}
                        className={`p-4 rounded-2xl border-2 flex items-center justify-center transition-all ${
                          activeSpeechCard === med.id
                            ? "bg-blue-600 text-white border-blue-600 animate-pulse"
                            : "hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-300 dark:border-slate-700"
                        }`}
                        title="Read details out loud"
                        aria-label="Read details out loud"
                      >
                        <Volume2 className="w-6 h-6" />
                      </button>

                      <button
                        onClick={() => onMarkTaken(med.id, record.scheduledTime)}
                        disabled={isTaken}
                        className={`flex-1 sm:flex-none px-6 py-4 rounded-2xl font-extrabold text-lg flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 ${
                          isTaken
                            ? "bg-emerald-600 text-white cursor-default opacity-90"
                            : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/25"
                        }`}
                      >
                        <Check className="w-6 h-6 stroke-[3]" />
                        <span>{isTaken ? "Already Taken ✓" : "I Took This"}</span>
                      </button>

                      {!isTaken && (
                        <button
                          onClick={() => onSnooze(med.id, record.scheduledTime)}
                          className="px-5 py-4 rounded-2xl font-bold text-base bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-200 border-2 border-amber-300 dark:border-amber-700 hover:bg-amber-200 transition-all active:scale-95"
                        >
                          Snooze 15m
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Daily Healthcare & Vitals Routines */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
              <Activity className="w-6 h-6 text-teal-600" /> Daily Healthcare Routines
            </h2>
            <span className="text-sm font-semibold opacity-75">Vitals, Hydration & Wellness</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {routines.map((routine) => (
              <div
                key={routine.id}
                onClick={() => onToggleRoutine(routine.id)}
                className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-start justify-between gap-3 ${
                  routine.completed
                    ? "bg-teal-50 dark:bg-teal-950/20 border-teal-400 dark:border-teal-800"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-teal-400"
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase">
                      {routine.scheduledTime}
                    </span>
                    {routine.category === "hydration" && <Droplets className="w-4 h-4 text-blue-500" />}
                  </div>
                  <h4 className="text-lg font-black mt-0.5">{routine.title}</h4>
                  <p className="text-xs font-semibold opacity-80 mt-1">{routine.targetMetric}</p>
                  {routine.notes && (
                    <p className="text-xs italic opacity-70 mt-0.5">{routine.notes}</p>
                  )}
                </div>

                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 border-2 ${
                    routine.completed
                      ? "bg-teal-600 border-teal-600 text-white"
                      : "border-slate-300 dark:border-slate-700"
                  }`}
                >
                  {routine.completed && <Check className="w-5 h-5 stroke-[3]" />}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Doctor Visit Reminder */}
        {nextAppointment && (
          <div
            className={`p-6 sm:p-7 rounded-3xl transition-all border-2 ${
              highContrast
                ? "bg-black border-yellow-400 text-yellow-300"
                : "bg-white dark:bg-slate-900 border-blue-200 dark:border-blue-900/60 shadow-lg"
            }`}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm uppercase">
                  <Calendar className="w-4 h-4" /> Next Doctor Appointment
                </div>
                <h3 className="text-2xl font-black">{nextAppointment.doctorName}</h3>
                <p className="text-base font-semibold opacity-90">
                  {nextAppointment.specialty} • {nextAppointment.clinic}
                </p>
                <p className="text-sm opacity-75">
                  📅 <strong>{nextAppointment.date}</strong> at <strong>{nextAppointment.time}</strong>
                  {nextAppointment.accompaniedBy && ` (Accompanied by ${nextAppointment.accompaniedBy})`}
                </p>
              </div>

              <button
                onClick={handleReadAppointment}
                className="px-5 py-3 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800 hover:bg-blue-100 flex items-center gap-2"
              >
                <Volume2 className="w-5 h-5" /> Read Details
              </button>
            </div>
          </div>
        )}

        {/* Big Friendly Assistance Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
          <button
            onClick={onOpenAiAssistant}
            className="p-6 rounded-3xl bg-gradient-to-r from-teal-500 to-blue-600 text-white font-extrabold text-xl flex items-center justify-center gap-3 shadow-lg shadow-teal-500/20 hover:opacity-95 active:scale-95 transition-all"
          >
            <Sparkles className="w-7 h-7" />
            <span>Ask Aura AI Assistant</span>
          </button>

          <button
            onClick={onOpenEmergencyModal}
            className="p-6 rounded-3xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xl flex items-center justify-center gap-3 shadow-lg shadow-red-500/25 active:scale-95 transition-all"
          >
            <PhoneCall className="w-7 h-7" />
            <span>Emergency Call & SOS</span>
          </button>
        </div>
      </div>
    );
  }
);

SeniorView.displayName = "SeniorView";
