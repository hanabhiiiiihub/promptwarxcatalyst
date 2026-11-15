import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SilverCare AI — Elderly Care & Medication Management Platform",
  description:
    "An interconnected healthcare management platform designed for elderly individuals, caretakers, and family members. Powered by Google Gemini AI.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
        {children}
      </body>
    </html>
  );
}
