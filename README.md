# 🌟 SilverCare AI — Elderly Care & Medication Management Platform

> **Built for PromptWars × Catalyst | Google for Developers & Build with AI**  
> *A smart, interconnected healthcare management platform designed to help elderly individuals manage their daily medications, medical appointments, and healthcare routines while keeping family members and caretakers informed.*

---

## 📖 Overview & Problem Statement

As seniors age, managing complex polypharmacy routines, adhering to strict medication schedules, and coordinating medical appointments becomes a critical daily challenge. Family members and caregivers often carry the anxiety of unverified doses, missed appointments, or harmful drug interactions.

**SilverCare AI** creates a unified, collaborative ecosystem bridging **Seniors**, **Caregivers/Nurses**, and **Family Guardians** with:
- **Secure Passcode-Protected Multi-Persona Access** tailored to each user's cognitive and operational needs.
- **Proactive Multichannel Email Reminders** for missed medications, upcoming appointments, and daily wellness digests.
- **Google Gemini AI Healthcare Companion ("Aura")** providing speech-enabled medication advice and clinical interaction checks.
- **Elderly-First Accessibility (WCAG AAA)**: Text-to-speech audio readout, large touch targets (60px+), scalable typography, and obsidian high-contrast mode.
- **Clinical Safety Engine**: Automated drug-drug conflict and dietary hazard detection (e.g., grapefruit enzyme inhibitors with statins).
- **Exportable Clinical Doctor Summary**: One-click printable clinical adherence report for doctor consultations.

---

## 👥 Three-Tier Care Ecosystem & Passcode Access

SilverCare AI secures patient data with dedicated passcodes for each member of the care circle:

| Persona | Passcode | Primary Capabilities & UI Experience |
| :--- | :--- | :--- |
| **👴 Senior (Arthur Pendelton)** | `1234` | Simplified touch-first UI, huge "✓ I Took This" & "⏰ Snooze" buttons, Web Speech audio readout, countdown to doctor visits, one-touch Emergency SOS. |
| **🩺 Caretaker (Nurse Clara)** | `2468` | Clinical dashboard, medication schedule manager (add/edit/delete), prescription inventory & low-refill alerts, skip reason logger, manual dose administration. |
| **👨‍👩‍👧 Family (David & Emily)** | `9999` | Peace-of-mind dashboard, live care activity timeline, 7-day adherence analytics, appointment ride/escort coordinator, automated email notification preferences. |

> 💡 *Quick Switcher:* A convenient persona selector is available at the bottom of the interface for rapid judging and evaluation.

---

## 🚀 Key Features & Innovations

### 1. 💊 Smart Medication Scheduling & Adherence Tracking
- Visual pill representations (form, color-coded indicators, dosage, meal relation rules).
- Multi-time daily scheduling (morning, afternoon, evening, bedtime).
- Refill inventory tracking with low-stock warnings (alerts when supply is below threshold).
- Clinical skip reason logging (e.g., nausea, physician-directed hold, fasting).

### 2. 📧 Proactive Email Alerts & Notification Engine
- **Automated Missed Dose Alerts**: Instantly dispatches high-priority HTML emails to caregivers and family if a dose is overdue.
- **24-Hour Doctor Appointment Reminders**: Alerts family drivers with clinic location and fasting instructions.
- **Daily Caregiver Wellness Digests**: Summarizes adherence percentage and vitals over the past 24 hours.
- **Interactive Notification Center**: Full in-app preview of delivered emails and simulated delivery logs.

### 3. 🧠 Google Gemini AI Integration
- **Aura AI Care Companion** (`/api/gemini/companion`): Voice & chat assistant answering patient questions in warm, reassuring, concise language with auto-readout.
- **Drug & Food Interaction Matrix** (`/api/gemini/interactions`): Evaluates all active prescriptions for adverse contraindications, CYP3A4 inhibitors, and dietary cautions (e.g., Atorvastatin + Grapefruit, Lisinopril + Potassium).

### 4. ♿ Elderly-Centric Accessibility (WCAG 2.1 AAA)
- **Web Speech API Read-Aloud**: Audio narration for every medicine card, dosage, and appointment.
- **High-Contrast Obsidian Mode**: Yellow-on-black color scheme designed for cataract, macular degeneration, and glaucoma patients.
- **Font Scaler**: Dynamic typography toggle (`Normal`, `Large`, `Extra Large`).
- **Emergency SOS Panic Modal**: Displays blood group (`O+`), known allergies (`Penicillin, Sulfa`), emergency physician details, and triggers instant alerts.

### 5. 🩺 Clinical Summary for Doctor Visits
- Generates a formatted medical report ready for print or PDF export (`window.print()`).
- Summarizes active medications, adherence percentage, documented skip reasons, and specialist consult notes.

---

## 🛠️ Tech Stack & Architecture

- **Frontend & Fullstack**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS, Lucide React Icons
- **AI & ML**: Google Gemini Generative AI SDK (`@google/generative-ai`)
- **Speech & Audio**: Browser Web Speech API (`SpeechSynthesis`)
- **Testing**: Vitest test framework (14 automated unit & integration tests)
- **Cloud Deployment**: Containerized with multi-stage Dockerfile for **Google Cloud Run**

---

## 🧪 Automated Test Suite

SilverCare AI includes test coverage across passcode security, adherence calculations, drug interaction analysis, and email generation:

```bash
# Run the test suite
npm run test
```

**Test Suites:**
- `__tests__/passcode-security.test.ts`: Validates role authorization, unique PIN verification, and privilege escalation prevention.
- `__tests__/adherence-logic.test.ts`: Verifies adherence rate calculations, inventory decrement logic, and low-refill alerts.
- `__tests__/interaction-engine.test.ts`: Confirms drug-drug interaction detection and food warning filters.
- `__tests__/email-service.test.ts`: Validates responsive HTML email generation and required clinical fields.

---

## 📦 Getting Started & Local Development

### Prerequisites
- Node.js `v18+` or `v20+` (tested on Node `v23.11.0`)
- npm `v9+`

### Installation
```bash
# 1. Install dependencies
npm install

# 2. Configure environment (Optional: for live Gemini API calls)
cp .env.example .env.local
# Add your GEMINI_API_KEY in .env.local

# 3. Start local development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## ☁️ Google Cloud Run Deployment

SilverCare AI includes a production-ready, multi-stage `Dockerfile` configured to listen on `$PORT` (Cloud Run specification):

```bash
# 1. Build and submit container image to Google Artifact Registry / Google Container Registry
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/silvercare-ai

# 2. Deploy to Google Cloud Run
gcloud run deploy silvercare-ai \
  --image gcr.io/YOUR_PROJECT_ID/silvercare-ai \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY="YOUR_KEY"
```

---

## 🏆 PromptWars Evaluation Checklist Alignment

| Evaluation Criteria | Implementation in SilverCare AI |
| :--- | :--- |
| **Code Quality** | Strict TypeScript, modular React components, clean separation of concerns (`/lib`, `/components`, `/app/api`). |
| **Security** | Passcode-based role gating, input sanitization, non-root Docker execution user (`nextjs:nodejs`). |
| **Efficiency** | Next.js 14 static generation + dynamic API routes, local persistence, instant response times. |
| **Testing** | 14 comprehensive Vitest tests across security, adherence math, interaction rules, and email templates. |
| **Accessibility** | High contrast toggle, font scaling, text-to-speech voice readouts, 60px touch targets, ARIA labels. |
| **Google Services** | Google Gemini Generative AI for drug interactions and empathetic senior voice/chat assistant. |
| **Cloud Run Ready** | Standalone Next.js multi-stage Docker build ready for Google Cloud Run deployment. |

---

*Made with ❤️ for the elderly, their families, and dedicated caregivers.*
