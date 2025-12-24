# 💊 MedTrack+ Medication Tracker & Reminder

## 🎯 Purpose

MedTrack+ is a web-based application designed to **help people stay on top of their medications** with clear schedules, smart reminders, and simple adherence insights.

It focuses on:

- **Patients** → see exactly what to take, when to take it, and avoid missed doses.
- **Caregivers** → get a clearer picture of someone’s routine and how consistently medications are being taken.
- **Clinicians & families** → use adherence patterns as a conversation starter, not a judgment.

---

## ✨ Features

### 👤 Users / Patients

- Add medications with name, dose, and schedule
- See **today’s medications** in a clear, prioritized view
- Mark doses as **upcoming, taken, or missed**
- Receive reminder alerts when it’s time to take a dose
- View adherence summaries over time

### 📱 Experience & UI

- Mobile-friendly, card-based interface
- Gradient, glassmorphism-inspired design
- Quick-scan action for adding prescriptions faster
- Sticky header with current date & time
- Rounded progress visual for adherence

### 🚨 Reminders & Alerts

- In-app alarm popup when a medication is due
- Snooze option (e.g., 5 minutes) when life interrupts
- Browser notifications (where supported and permitted)
- Audio alarm playback with looping until dismissed

### 📷 Prescription Scanning

- Optional prescription scanning workflow
- Vision API integration (via `visionApi` + `prescriptionParser` services)
- Extracts key information from images of prescriptions to speed up medication entry

## 🏗️ Tech Stack

- **Frontend** → React + TypeScript + Vite
- **Styling** → Tailwind CSS (utility-first, responsive design)
- **State Management** → React Context (MedicationContext, SettingsContext)
- **Routing** → React Router (multi-page user flows: Home, Medications, Alerts, Settings, etc.)
- **Notifications** → Web Notifications API + custom alarm modal
- **Vision / Parsing** → Custom services integrating with external Vision/OCR APIs

---

## 🚀 Getting Started (Dev)

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the development server:
   ```bash
   npm run dev
   ```
3. Open the app in your browser (default Vite URL, e.g. `http://localhost:5173`).

From here you can add medications, test reminders, and explore the full MedTrack+ experience. tg
