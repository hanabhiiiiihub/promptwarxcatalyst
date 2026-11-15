"use client";

import React from "react";
import {
  Medication,
  AdherenceRecord,
  DoctorAppointment,
  ElderlyProfile,
  CareCircleMember,
} from "@/lib/types";
import {
  Heart,
  Users,
  Bell,
  CheckCircle,
  Calendar,
  Send,
  Shield,
  Activity,
  Smile,
  Clock,
  Car,
  MailCheck,
} from "lucide-react";

interface FamilyViewProps {
  profile: ElderlyProfile;
  medications: Medication[];
  adherenceHistory: AdherenceRecord[];
  appointments: DoctorAppointment[];
  careCircle: CareCircleMember[];
  highContrast: boolean;
  onSendEncouragement: () => void;
  onUpdateRideVolunteer: (apptId: string, volunteerName: string) => void;
  onToggleNotificationPref: (key: keyof ElderlyProfile["emailAlertPreferences"]) => void;
}

export const FamilyView: React.FC<FamilyViewProps> = ({
  profile,
  medications,
  adherenceHistory,
  appointments,
  careCircle,
  highContrast,
  onSendEncouragement,
  onUpdateRideVolunteer,
  onToggleNotificationPref,
}) => {
  // Compute weekly adherence
  const totalLogs = adherenceHistory.length;
  const takenLogs = adherenceHistory.filter((a) => a.status === "taken").length;
  const weeklyRate = totalLogs > 0 ? Math.round((takenLogs / totalLogs) * 100) : 100;

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-6">
      {/* Family Peace-of-Mind Banner */}
      <div
        className={`p-6 sm:p-8 rounded-3xl transition-all border ${
          highContrast
            ? "bg-black border-yellow-400 text-yellow-300"
            : "bg-gradient-to-r from-purple-800 via-indigo-900 to-slate-900 text-white shadow-xl"
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-600/40 border border-purple-400/30 text-xs font-bold uppercase tracking-wider text-purple-200">
              <Heart className="w-4 h-4 fill-purple-300 text-purple-300" /> Family Circle Portal
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Peace of Mind for the Pendelton Family
            </h1>
            <p className="text-purple-100 text-sm max-w-xl">
              Stay connected with {profile.preferredName || profile.name}&apos;s daily routine, track
              medication compliance, coordinate doctor transportation, and receive automated email
              alerts.
            </p>
          </div>

          {/* Quick Adherence Stat Box */}
          <div className="flex items-center gap-4 bg-white/10 dark:bg-black/30 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20">
            <div>
              <div className="text-3xl font-black text-emerald-400">{weeklyRate}%</div>
              <div className="text-xs uppercase font-bold tracking-wider opacity-80">
                Weekly Adherence
              </div>
            </div>
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Live Timeline & Doctor Ride Coordination */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Care Activity Feed (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight">Recent Care Circle Activity</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Chronological timeline of doses logged by Arthur and Nurse Clara
              </p>
            </div>
            <button
              onClick={onSendEncouragement}
              className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition flex items-center gap-2 shadow-sm"
            >
              <Send className="w-3.5 h-3.5" /> Send Reminder & Note
            </button>
          </div>

          <div className="space-y-3">
            {adherenceHistory.slice(0, 6).map((log) => (
              <div
                key={log.id}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      log.status === "taken"
                        ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600"
                        : log.status === "skipped"
                        ? "bg-rose-100 dark:bg-rose-950/60 text-rose-600"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                    }`}
                  >
                    {log.status === "taken" ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Clock className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                      {log.medicationName}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Scheduled: {log.scheduledTime} ({log.date}) • Logged by:{" "}
                      <strong>{log.loggedBy}</strong>
                      {log.takenAt && ` at ${log.takenAt}`}
                    </p>
                    {log.skipReason && (
                      <p className="text-xs text-rose-600 dark:text-rose-400 font-semibold mt-0.5">
                        Reason: {log.skipReason}
                      </p>
                    )}
                  </div>
                </div>

                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-bold capitalize ${
                    log.status === "taken"
                      ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300"
                      : log.status === "skipped"
                      ? "bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {log.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Automated Email Alerts & Care Circle */}
        <div className="space-y-6">
          {/* Automated Email Alert Preferences */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <MailCheck className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h3 className="font-bold text-base">Proactive Email Alerts</h3>
            </div>
            <p className="text-xs text-slate-500">
              Configured recipient: <strong>{profile.emailAlertPreferences.emailAddress}</strong>
            </p>

            <div className="space-y-3 pt-2 text-xs font-semibold">
              <label className="flex items-center justify-between cursor-pointer">
                <span>🚨 Missed Dose Alerts</span>
                <input
                  type="checkbox"
                  checked={profile.emailAlertPreferences.notifyOnMissedDose}
                  onChange={() => onToggleNotificationPref("notifyOnMissedDose")}
                  className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span>🩺 Upcoming Doctor Visit Notice</span>
                <input
                  type="checkbox"
                  checked={profile.emailAlertPreferences.notifyOnUpcomingAppointment}
                  onChange={() => onToggleNotificationPref("notifyOnUpcomingAppointment")}
                  className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span>📊 Daily Adherence Digest</span>
                <input
                  type="checkbox"
                  checked={profile.emailAlertPreferences.notifyDailyDigest}
                  onChange={() => onToggleNotificationPref("notifyDailyDigest")}
                  className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
                />
              </label>
            </div>
          </div>

          {/* Care Circle Members */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="font-bold text-base">Care Circle Members</h3>
            </div>

            <div className="space-y-3">
              {careCircle.map((member) => (
                <div key={member.id} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-7 h-7 rounded-full text-white font-bold flex items-center justify-center text-[11px] ${member.avatarColor}`}
                    >
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold">{member.name}</p>
                      <p className="text-slate-500 dark:text-slate-400">{member.relationship}</p>
                    </div>
                  </div>
                  <span className="capitalize text-[11px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 font-semibold">
                    {member.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Appointment Transportation & Ride Coordination */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Doctor Ride & Escort Coordination</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Ensure Arthur never travels alone to clinical appointments
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {appointments.map((appt) => (
            <div
              key={appt.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-sm">{appt.doctorName}</h4>
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold">
                    {appt.specialty}
                  </p>
                </div>
                <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600">
                  <Car className="w-4 h-4" />
                </div>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                📅 {appt.date} at {appt.time} <br />
                📍 {appt.clinic}
              </p>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500">Escort:</span>
                <select
                  value={appt.accompaniedBy}
                  onChange={(e) => onUpdateRideVolunteer(appt.id, e.target.value)}
                  className="p-1 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold bg-slate-50 dark:bg-slate-800"
                >
                  <option value="David Pendelton (Son)">David (Son)</option>
                  <option value="Clara Vance, RN (Caregiver)">Clara (Nurse)</option>
                  <option value="Emily Pendelton (Daughter)">Emily (Daughter)</option>
                  <option value="Medical Cab Transport">Medical Transport</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
