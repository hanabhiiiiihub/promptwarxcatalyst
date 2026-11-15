"use client";

import React, { useState } from "react";
import { ElderlyProfile, CareCircleMember } from "@/lib/types";
import { X, PhoneCall, AlertTriangle, ShieldAlert, Heart, Send, Check } from "lucide-react";

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ElderlyProfile;
  careCircle: CareCircleMember[];
  onTriggerEmergencyBroadcast: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  isOpen,
  onClose,
  profile,
  careCircle,
  onTriggerEmergencyBroadcast,
}) => {
  const [broadcastSent, setBroadcastSent] = useState(false);

  if (!isOpen) return null;

  const handleBroadcast = () => {
    onTriggerEmergencyBroadcast();
    setBroadcastSent(true);
    setTimeout(() => setBroadcastSent(false), 5000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-red-950/80 backdrop-blur-md animate-fadeIn"
    >
      <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border-4 border-red-600 shadow-2xl overflow-hidden">
        {/* Banner */}
        <div className="bg-red-600 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center animate-pulse">
              <AlertTriangle className="w-7 h-7 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-2xl font-black uppercase tracking-wider">Emergency Medical SOS</h2>
              <p className="text-xs text-red-100 font-bold">Priority Medical Profile & Contact Dispatch</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Critical Clinical Vitals Card */}
          <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-red-700 dark:text-red-300 font-bold uppercase tracking-wider text-[10px]">
                Patient Name
              </span>
              <p className="text-base font-extrabold text-slate-900 dark:text-slate-100 mt-0.5">
                {profile.name} (Age {profile.age})
              </p>
            </div>
            <div>
              <span className="text-red-700 dark:text-red-300 font-bold uppercase tracking-wider text-[10px]">
                Blood Group
              </span>
              <p className="text-2xl font-black text-red-600 mt-0.5">{profile.bloodType}</p>
            </div>
            <div className="col-span-2 pt-2 border-t border-red-200 dark:border-red-900">
              <span className="text-red-700 dark:text-red-300 font-bold uppercase tracking-wider text-[10px]">
                ⚠️ Known Drug Allergies
              </span>
              <p className="text-sm font-bold text-red-800 dark:text-red-200 mt-0.5">
                {profile.allergies.join(", ")}
              </p>
            </div>
            <div className="col-span-2">
              <span className="text-red-700 dark:text-red-300 font-bold uppercase tracking-wider text-[10px]">
                Chronic Conditions
              </span>
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
                {profile.chronicConditions.join(" • ")}
              </p>
            </div>
          </div>

          {/* Instant Call Contacts */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Instant One-Touch Emergency Calls
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href="tel:911"
                className="p-3.5 rounded-2xl bg-red-600 text-white font-extrabold flex items-center justify-center gap-2 shadow-md hover:bg-red-700 active:scale-95 transition text-base"
              >
                <PhoneCall className="w-5 h-5" /> Call 911 (EMS)
              </a>

              <a
                href={`tel:${profile.clinicPhone}`}
                className="p-3.5 rounded-2xl bg-blue-600 text-white font-bold flex items-center justify-center gap-2 shadow-md hover:bg-blue-700 active:scale-95 transition text-sm"
              >
                <PhoneCall className="w-4 h-4" /> Dr. Sarah Chen
              </a>

              {careCircle
                .filter((c) => c.isEmergencyContact)
                .map((contact) => (
                  <a
                    key={contact.id}
                    href={`tel:${contact.phone}`}
                    className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold flex items-center justify-between text-xs border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                  >
                    <span>
                      {contact.name} ({contact.relationship})
                    </span>
                    <PhoneCall className="w-4 h-4 text-emerald-600" />
                  </a>
                ))}
            </div>
          </div>

          {/* Automated Emergency Broadcast Alert */}
          <div className="pt-2">
            <button
              onClick={handleBroadcast}
              className={`w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${
                broadcastSent
                  ? "bg-emerald-600 text-white"
                  : "bg-red-700 hover:bg-red-800 text-white shadow-red-700/30"
              }`}
            >
              {broadcastSent ? (
                <>
                  <Check className="w-5 h-5 stroke-[3]" />
                  <span>Emergency Alert Dispatched to All Caregivers!</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Dispatch SOS Alert Email to Entire Care Circle</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
