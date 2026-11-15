"use client";

import React, { useState } from "react";
import { EmailLog } from "@/lib/types";
import {
  X,
  Bell,
  Mail,
  Send,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Eye,
  Trash2,
  Sparkles,
} from "lucide-react";

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  emailLogs: EmailLog[];
  onTriggerEmail: (type: "missed_medication" | "appointment_reminder" | "daily_digest") => void;
  onClearLogs: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  emailLogs,
  onTriggerEmail,
  onClearLogs,
}) => {
  const [selectedEmail, setSelectedEmail] = useState<EmailLog | null>(null);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn"
    >
      <div className="w-full max-w-2xl max-h-[85vh] rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Proactive Email Alerts & Notifications</h3>
              <p className="text-xs text-blue-100">
                Automated caretaker & family email dispatch monitor
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Bar: Trigger Test Dispatches */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between flex-wrap gap-2">
          <span className="text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-500" /> Dispatch Email Test:
          </span>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => onTriggerEmail("missed_medication")}
              className="px-2.5 py-1.5 rounded-xl bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 font-bold text-xs hover:bg-red-200 transition"
            >
              🚨 Missed Dose Alert
            </button>
            <button
              onClick={() => onTriggerEmail("appointment_reminder")}
              className="px-2.5 py-1.5 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold text-xs hover:bg-blue-200 transition"
            >
              🩺 Appt Reminder
            </button>
            <button
              onClick={() => onTriggerEmail("daily_digest")}
              className="px-2.5 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold text-xs hover:bg-emerald-200 transition"
            >
              📊 Daily Digest
            </button>
          </div>
        </div>

        {/* Email Logs List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {emailLogs.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs font-semibold">
              No emails sent yet. Use the buttons above to trigger email notifications.
            </div>
          ) : (
            emailLogs.map((log) => (
              <div
                key={log.id}
                onClick={() => setSelectedEmail(log)}
                className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-400 cursor-pointer shadow-sm transition space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        log.alertType === "missed_medication"
                          ? "bg-red-500"
                          : log.alertType === "appointment_reminder"
                          ? "bg-blue-500"
                          : "bg-emerald-500"
                      }`}
                    />
                    <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 line-clamp-1">
                      {log.subject}
                    </h4>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Delivered
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>To: {log.recipient}</span>
                  <span>{log.sentAt}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Selected Email HTML Preview Modal */}
        {selectedEmail && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400">
                    Email Preview
                  </span>
                  <h4 className="font-bold text-sm text-slate-900">{selectedEmail.subject}</h4>
                </div>
                <button
                  onClick={() => setSelectedEmail(null)}
                  className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div
                className="max-h-[60vh] overflow-y-auto text-xs"
                dangerouslySetInnerHTML={{ __html: selectedEmail.bodyHtml }}
              />

              <div className="pt-2 text-right">
                <button
                  onClick={() => setSelectedEmail(null)}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-between items-center text-xs">
          <span className="text-slate-500">{emailLogs.length} notifications logged</span>
          <button
            onClick={onClearLogs}
            className="text-red-600 dark:text-red-400 font-bold hover:underline flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear All Logs
          </button>
        </div>
      </div>
    </div>
  );
};
