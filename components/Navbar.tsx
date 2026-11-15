"use client";

import React from "react";
import {
  UserRole,
  ElderlyProfile,
} from "@/lib/types";
import {
  Heart,
  Shield,
  Bell,
  Sparkles,
  AlertTriangle,
  FileText,
  Eye,
  Type,
  Lock,
} from "lucide-react";

interface NavbarProps {
  currentRole: UserRole;
  profile: ElderlyProfile;
  highContrast: boolean;
  fontSize: "normal" | "large" | "xlarge";
  unreadNotifications: number;
  onOpenPasscodeModal: () => void;
  onToggleHighContrast: () => void;
  onCycleFontSize: () => void;
  onOpenEmergencyModal: () => void;
  onOpenAiAssistant: () => void;
  onOpenInteractionChecker: () => void;
  onOpenDoctorReport: () => void;
  onOpenNotifications: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  profile,
  highContrast,
  fontSize,
  unreadNotifications,
  onOpenPasscodeModal,
  onToggleHighContrast,
  onCycleFontSize,
  onOpenEmergencyModal,
  onOpenAiAssistant,
  onOpenInteractionChecker,
  onOpenDoctorReport,
  onOpenNotifications,
}) => {
  const roleBadges: Record<UserRole, { label: string; bg: string; text: string }> = {
    senior: {
      label: "Senior Mode",
      bg: "bg-blue-100 dark:bg-blue-900/60",
      text: "text-blue-800 dark:text-blue-200",
    },
    caretaker: {
      label: "Caregiver & Nurse",
      bg: "bg-teal-100 dark:bg-teal-900/60",
      text: "text-teal-800 dark:text-teal-200",
    },
    family: {
      label: "Family Guardian",
      bg: "bg-purple-100 dark:bg-purple-900/60",
      text: "text-purple-800 dark:text-purple-200",
    },
  };

  return (
    <header
      className={`sticky top-0 z-40 transition-colors border-b ${
        highContrast
          ? "bg-black border-yellow-400 text-yellow-300"
          : "bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Platform Info */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-teal-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Heart className="w-7 h-7 fill-white/20 stroke-white stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent dark:from-blue-400 dark:to-teal-300">
                  SilverCare AI
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800">
                  PromptWars × Catalyst
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Caring for <strong className="text-slate-700 dark:text-slate-200">{profile.preferredName || profile.name}</strong>
              </p>
            </div>
          </div>

          {/* Quick Actions & Role Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Accessibility: Font Scaler */}
            <button
              onClick={onCycleFontSize}
              title={`Current font size: ${fontSize}. Click to enlarge.`}
              aria-label="Adjust font size"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold border transition-all ${
                highContrast
                  ? "border-yellow-400 hover:bg-yellow-400 hover:text-black"
                  : "border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
              }`}
            >
              <Type className="w-4 h-4" />
              <span className="hidden md:inline uppercase text-xs">{fontSize}</span>
            </button>

            {/* Accessibility: High Contrast Toggle */}
            <button
              onClick={onToggleHighContrast}
              title={highContrast ? "Disable High Contrast" : "Enable High Contrast (WCAG AAA)"}
              aria-label="Toggle High Contrast"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold border transition-all ${
                highContrast
                  ? "bg-yellow-400 text-black border-yellow-400 font-bold"
                  : "border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
              }`}
            >
              <Eye className="w-4 h-4" />
              <span className="hidden md:inline text-xs font-bold">Contrast</span>
            </button>

            {/* AI Companion Trigger */}
            <button
              onClick={onOpenAiAssistant}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-teal-500 to-blue-600 text-white shadow-sm hover:opacity-95 transition-all"
              title="Open Gemini AI Voice & Care Assistant"
            >
              <Sparkles className="w-4 h-4 fill-white/20" />
              <span className="hidden sm:inline font-bold">Ask Aura AI</span>
            </button>

            {/* AI Drug Safety Checker */}
            <button
              onClick={onOpenInteractionChecker}
              className={`hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold border transition-all ${
                highContrast
                  ? "border-yellow-400 text-yellow-300 hover:bg-yellow-400 hover:text-black"
                  : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
              title="Analyze Drug-to-Drug and Food Interactions"
            >
              <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs font-bold">Drug Safety</span>
            </button>

            {/* Doctor Report Modal */}
            <button
              onClick={onOpenDoctorReport}
              className={`hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold border transition-all ${
                highContrast
                  ? "border-yellow-400 text-yellow-300 hover:bg-yellow-400 hover:text-black"
                  : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
              title="Printable Doctor Visit Clinical Summary"
            >
              <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-bold">Doctor Report</span>
            </button>

            {/* Notification & Email Alerts Center */}
            <button
              onClick={onOpenNotifications}
              className={`relative p-2.5 rounded-xl border transition-all ${
                highContrast
                  ? "border-yellow-400 text-yellow-300 hover:bg-yellow-400 hover:text-black"
                  : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
              title="Email Reminders & Notification Logs"
              aria-label="View notifications and email alerts"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-600 text-white text-[11px] font-bold flex items-center justify-center animate-pulse">
                  {unreadNotifications}
                </span>
              )}
            </button>

            {/* Role Switcher Pill with Lock */}
            <button
              onClick={onOpenPasscodeModal}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border transition-all text-sm font-bold shadow-sm ${
                highContrast
                  ? "border-yellow-400 bg-yellow-400 text-black"
                  : `${roleBadges[currentRole].bg} ${roleBadges[currentRole].text} border-transparent hover:ring-2 hover:ring-blue-400`
              }`}
              title="Switch Role via Passcode"
            >
              <Lock className="w-4 h-4 opacity-75" />
              <span>{roleBadges[currentRole].label}</span>
            </button>

            {/* Emergency SOS Panic Button */}
            <button
              onClick={onOpenEmergencyModal}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-extrabold bg-red-600 text-white shadow-lg shadow-red-500/30 hover:bg-red-700 active:scale-95 transition-all animate-pulse"
              title="Emergency SOS Assistance"
              aria-label="Emergency SOS Assistance"
            >
              <AlertTriangle className="w-4 h-4 fill-white" />
              <span className="tracking-wide">SOS</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
