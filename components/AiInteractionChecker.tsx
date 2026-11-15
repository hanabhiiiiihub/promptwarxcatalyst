"use client";

import React, { useState, useEffect } from "react";
import { Medication, InteractionReport } from "@/lib/types";
import {
  X,
  Shield,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  Utensils,
  Pill,
} from "lucide-react";

interface AiInteractionCheckerProps {
  isOpen: boolean;
  onClose: () => void;
  medications: Medication[];
}

export const AiInteractionChecker: React.FC<AiInteractionCheckerProps> = ({
  isOpen,
  onClose,
  medications,
}) => {
  const [report, setReport] = useState<InteractionReport | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchAnalysis = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/gemini/interactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ medications }),
      });
      const data = await res.json();
      setReport(data);
    } catch (err) {
      console.error("Error fetching drug interactions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && !report) {
      fetchAnalysis();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn"
    >
      <div className="w-full max-w-2xl max-h-[88vh] rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
              <Shield className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg">AI Drug Interaction & Food Safety</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-white/20">
                  Google Gemini + Clinical Rules
                </span>
              </div>
              <p className="text-xs text-emerald-100">
                Screening {medications.filter((m) => m.active).length} active senior prescriptions
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchAnalysis}
              disabled={loading}
              className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition"
              title="Re-run safety analysis"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-12 h-12 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin mx-auto" />
              <p className="font-bold text-sm text-slate-700 dark:text-slate-300">
                Running pharmacological interaction matrix...
              </p>
              <p className="text-xs text-slate-400">
                Cross-referencing CYP enzymes, contraindications, and senior bioavailability
              </p>
            </div>
          ) : report ? (
            <>
              {/* Overall Safety Rating Card */}
              <div
                className={`p-5 rounded-3xl border-2 flex items-start gap-4 ${
                  report.overallSafetyScore === "safe"
                    ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800"
                    : report.overallSafetyScore === "caution"
                    ? "bg-amber-50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800"
                    : "bg-rose-50 dark:bg-rose-950/20 border-rose-300 dark:border-rose-800"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                    report.overallSafetyScore === "safe"
                      ? "bg-emerald-500 text-white"
                      : report.overallSafetyScore === "caution"
                      ? "bg-amber-500 text-white"
                      : "bg-rose-500 text-white"
                  }`}
                >
                  {report.overallSafetyScore === "safe" ? (
                    <ShieldCheck className="w-7 h-7" />
                  ) : (
                    <AlertTriangle className="w-7 h-7" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-base capitalize">
                      Overall Clinical Safety: {report.overallSafetyScore}
                    </h4>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-white/70 dark:bg-black/40">
                      Engine: {report.source}
                    </span>
                  </div>
                  <p className="text-sm font-medium mt-1 leading-relaxed opacity-90">
                    {report.summary}
                  </p>
                </div>
              </div>

              {/* Drug-Drug Interactions */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <Pill className="w-4 h-4 text-blue-500" /> Detected Drug Interactions (
                  {report.interactions.length})
                </h4>

                {report.interactions.length === 0 ? (
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
                    No adverse drug-drug interactions detected between active prescriptions.
                  </div>
                ) : (
                  report.interactions.map((interaction, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                          {interaction.drugsInvolved.join(" + ")}
                        </span>
                        <span
                          className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                            interaction.severity === "high" || interaction.severity === "critical"
                              ? "bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300"
                              : "bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300"
                          }`}
                        >
                          {interaction.severity} severity
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        <strong>Clinical Effect:</strong> {interaction.effect}
                      </p>
                      <p className="text-xs text-teal-700 dark:text-teal-400 font-semibold bg-teal-50 dark:bg-teal-950/40 p-2 rounded-xl">
                        💡 <strong>Recommendation:</strong> {interaction.recommendation}
                      </p>
                    </div>
                  ))
                )}
              </div>

              {/* Food & Beverage Cautions */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-amber-500" /> Dietary & Food Warnings (
                  {report.foodWarnings.length})
                </h4>

                {report.foodWarnings.map((warning, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 text-xs font-medium text-amber-900 dark:text-amber-200 flex items-start gap-2.5"
                  >
                    <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span>{warning}</span>
                  </div>
                ))}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};
