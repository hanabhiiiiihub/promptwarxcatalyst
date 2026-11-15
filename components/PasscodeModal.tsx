"use client";

import React, { useState } from "react";
import { UserRole, ElderlyProfile } from "@/lib/types";
import { X, Lock, Check, ShieldCheck, KeyRound, Sparkles } from "lucide-react";

interface PasscodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: UserRole;
  profile: ElderlyProfile;
  onSelectRole: (role: UserRole) => void;
  highContrast: boolean;
}

export const PasscodeModal: React.FC<PasscodeModalProps> = ({
  isOpen,
  onClose,
  currentRole,
  profile,
  onSelectRole,
  highContrast,
}) => {
  const [selectedTargetRole, setSelectedTargetRole] = useState<UserRole>(currentRole);
  const [pin, setPin] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");

  if (!isOpen) return null;

  const handleKeyPress = (num: string) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      setErrorMsg("");

      // Auto verify when 4 digits entered
      if (newPin.length === 4) {
        verifyPin(newPin, selectedTargetRole);
      }
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
    setErrorMsg("");
  };

  const handleClear = () => {
    setPin("");
    setErrorMsg("");
  };

  const verifyPin = (enteredPin: string, role: UserRole) => {
    const requiredPin = profile.passcodes[role];
    if (enteredPin === requiredPin) {
      setSuccessMsg(`Access Granted: Switched to ${role.toUpperCase()} mode!`);
      setTimeout(() => {
        onSelectRole(role);
        setPin("");
        setSuccessMsg("");
        setErrorMsg("");
        onClose();
      }, 500);
    } else {
      setErrorMsg("Incorrect passcode. Please try again or check the demo credentials.");
      setPin("");
    }
  };

  const quickSwitch = (role: UserRole) => {
    setSelectedTargetRole(role);
    setPin(profile.passcodes[role]);
    verifyPin(profile.passcodes[role], role);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn"
    >
      <div
        className={`w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl transition-all border ${
          highContrast
            ? "bg-black border-yellow-400 text-yellow-300"
            : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Secure Passcode Access</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Role-Based Ecosystem Protection</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Tabs */}
        <div className="grid grid-cols-3 gap-2 my-5">
          {(["senior", "caretaker", "family"] as UserRole[]).map((role) => (
            <button
              key={role}
              onClick={() => {
                setSelectedTargetRole(role);
                setPin("");
                setErrorMsg("");
              }}
              className={`py-2.5 px-3 rounded-2xl text-xs font-bold capitalize transition-all border ${
                selectedTargetRole === role
                  ? highContrast
                    ? "bg-yellow-400 text-black border-yellow-400"
                    : "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-transparent hover:border-slate-300 dark:hover:border-slate-700"
              }`}
            >
              {role === "senior" ? "👴 Senior" : role === "caretaker" ? "🩺 Caregiver" : "👨‍👩‍👧 Family"}
            </button>
          ))}
        </div>

        {/* PIN Indicators */}
        <div className="text-center my-4">
          <p className="text-sm font-medium mb-3 text-slate-600 dark:text-slate-300">
            Enter 4-digit PIN for{" "}
            <span className="font-bold text-blue-600 dark:text-blue-400 capitalize">
              {selectedTargetRole}
            </span>
          </p>
          <div className="flex justify-center gap-4">
            {[0, 1, 2, 3].map((idx) => (
              <div
                key={idx}
                className={`w-4 h-4 rounded-full transition-all duration-200 border-2 ${
                  pin.length > idx
                    ? highContrast
                      ? "bg-yellow-400 border-yellow-400 scale-125"
                      : "bg-blue-600 border-blue-600 scale-125"
                    : "border-slate-400 dark:border-slate-600 bg-transparent"
                }`}
              />
            ))}
          </div>

          {errorMsg && (
            <p className="text-xs font-bold text-red-600 dark:text-red-400 mt-3 animate-bounce">
              {errorMsg}
            </p>
          )}

          {successMsg && (
            <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-3 flex items-center justify-center gap-1">
              <Check className="w-4 h-4" /> {successMsg}
            </p>
          )}
        </div>

        {/* Numerical Touch Keypad */}
        <div className="grid grid-cols-3 gap-2.5 max-w-xs mx-auto mb-5">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9", "C", "0", "⌫"].map((btn) => (
            <button
              key={btn}
              onClick={() => {
                if (btn === "C") handleClear();
                else if (btn === "⌫") handleBackspace();
                else handleKeyPress(btn);
              }}
              className={`h-14 rounded-2xl text-xl font-bold transition-all active:scale-95 flex items-center justify-center border ${
                btn === "C" || btn === "⌫"
                  ? "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200"
                  : highContrast
                  ? "bg-black border-yellow-400 text-yellow-300 hover:bg-yellow-400 hover:text-black"
                  : "bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 border-slate-200 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-slate-700"
              }`}
            >
              {btn}
            </button>
          ))}
        </div>

        {/* Quick Demo Access Bar */}
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Demo Quick Access:
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => quickSwitch("senior")}
              className="px-2 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-[11px] font-bold border border-blue-200 dark:border-blue-900 hover:bg-blue-100 transition"
            >
              Senior (1234)
            </button>
            <button
              onClick={() => quickSwitch("caretaker")}
              className="px-2 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 text-[11px] font-bold border border-teal-200 dark:border-teal-900 hover:bg-teal-100 transition"
            >
              Nurse (2468)
            </button>
            <button
              onClick={() => quickSwitch("family")}
              className="px-2 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 text-[11px] font-bold border border-purple-200 dark:border-purple-900 hover:bg-purple-100 transition"
            >
              Family (9999)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
