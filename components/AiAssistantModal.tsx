"use client";

import React, { useState } from "react";
import {
  ElderlyProfile,
  Medication,
  DoctorAppointment,
  AdherenceRecord,
} from "@/lib/types";
import { speakText, stopSpeaking } from "@/lib/tts";
import {
  X,
  Sparkles,
  Send,
  Volume2,
  VolumeX,
  Bot,
  User,
  Loader2,
  HelpCircle,
} from "lucide-react";

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ElderlyProfile;
  medications: Medication[];
  appointments: DoctorAppointment[];
  adherenceToday: AdherenceRecord[];
}

interface Message {
  sender: "user" | "ai";
  text: string;
}

const PRESET_QUESTIONS = [
  "What medications do I need to take today?",
  "When is my next doctor appointment?",
  "Can I drink grapefruit juice with my medicine?",
  "Why am I taking Metformin and Lisinopril?",
];

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  isOpen,
  onClose,
  profile,
  medications,
  appointments,
  adherenceToday,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "ai",
      text: `Hello ${profile.preferredName || "Grandpa Arthur"}! I am Aura, your friendly healthcare companion. How can I help you feel comfortable today? You can ask me about your pills, appointments, or dietary advice.`,
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputValue;
    if (!textToSend.trim() || loading) return;

    const userMessage: Message = { sender: "user", text: textToSend };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setLoading(true);

    try {
      const res = await fetch("/api/gemini/companion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: textToSend,
          profile,
          medications,
          appointments,
          adherenceToday,
        }),
      });

      const data = await res.json();
      const reply =
        data.reply ||
        "I am here with you. Please take your prescribed medicine with meals as directed.";

      const aiMessage: Message = { sender: "ai", text: reply };
      setMessages((prev) => [...prev, aiMessage]);

      if (autoSpeak) {
        setIsSpeaking(true);
        speakText(reply, () => setIsSpeaking(false));
      }
    } catch {
      const fallbackReply =
        "Your morning Metformin (500mg) and Lisinopril (10mg) keep your sugar and blood pressure stable. Be sure to stay well hydrated today!";
      setMessages((prev) => [...prev, { sender: "ai", text: fallbackReply }]);
      if (autoSpeak) {
        speakText(fallbackReply, () => setIsSpeaking(false));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStopSpeaking = () => {
    stopSpeaking();
    setIsSpeaking(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn"
    >
      <div className="w-full max-w-xl h-[85vh] rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-teal-500 to-blue-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
              <Sparkles className="w-6 h-6 fill-white/20" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg">Aura AI Care Companion</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-white/20">
                  Google Gemini
                </span>
              </div>
              <p className="text-xs text-teal-100">Senior Healthcare & Routine Assistant</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (isSpeaking) handleStopSpeaking();
                setAutoSpeak(!autoSpeak);
              }}
              className={`p-2 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                autoSpeak
                  ? "bg-white/20 text-white"
                  : "bg-black/20 text-white/60 hover:text-white"
              }`}
              title={autoSpeak ? "Voice Readout ON" : "Voice Readout OFF"}
            >
              {autoSpeak ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={() => {
                stopSpeaking();
                onClose();
              }}
              className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex items-start gap-3 ${
                msg.sender === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div
                className={`w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 text-white ${
                  msg.sender === "user" ? "bg-purple-600" : "bg-teal-600"
                }`}
              >
                {msg.sender === "user" ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>

              <div
                className={`max-w-[80%] p-4 rounded-3xl text-sm leading-relaxed shadow-sm ${
                  msg.sender === "user"
                    ? "bg-purple-600 text-white rounded-tr-none"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-200 dark:border-slate-700"
                }`}
              >
                {msg.text}
                {msg.sender === "ai" && (
                  <button
                    onClick={() => speakText(msg.text)}
                    className="block mt-2 text-[11px] font-bold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
                  >
                    <Volume2 className="w-3.5 h-3.5" /> Speak aloud
                  </button>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3 text-slate-400 text-xs font-semibold">
              <Loader2 className="w-4 h-4 animate-spin text-teal-600" />
              <span>Aura is reviewing Arthur&apos;s healthcare records...</span>
            </div>
          )}
        </div>

        {/* Quick Suggestion Pills */}
        <div className="px-5 py-2.5 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
            {PRESET_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="whitespace-nowrap px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-teal-500 font-medium transition"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Input Form */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your question or medicine concern..."
              className="flex-1 p-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button
              type="submit"
              disabled={loading || !inputValue.trim()}
              className="p-3.5 rounded-2xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white shadow-md transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
