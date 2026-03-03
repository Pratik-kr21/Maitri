# Maitri 🌸

> The first period tracker that teaches you what your cycle is actually telling you — privately, safely, and with people who get it.

Maitri is a privacy-first, AI-assisted women's health web app centered on period and reproductive health tracking. It goes beyond prediction to help teenage girls and working women understand what their cycle is actually telling them about their bodies and minds each day.

## ✨ Core Features

- **Private Cycle Tracking & Prediction**: Track periods, flow intensity, and over 20+ symptoms (physical, emotional, energy levels). Prediction engine adapts and learns with transparent confidence indicators.
- **Phase-Aware Daily Insights**: Receive a daily personalized card explaining your current cycle phase, connecting your logged symptoms to hormonal changes, and offering one actionable tip.
- **Symptom Journal & Pattern Surfacing**: Fast, 30-second daily check-in to log energy and feelings. After 2 cycles, Maitri surfaces your unique body patterns.
- **Ask Maitri — AI Health Assistant**: A specialized AI trained on reproductive health that can explain symptoms, prepare you for doctor's appointments, and provide context. It comes with strict clinical guardrails and mandatory escalation triggers.
- **Safe Community Circles**: Age-gated, moderated community spaces ("Teen Talk", "PCOS Warriors", etc.) where users can share experiences anonymously with peers who understand.
- **Private Health Vault**: Your data is yours. Health logs are encrypted. Generate comprehensive PDF summaries to take to your next doctor's appointment.
- **Strict Privacy & Parental Consent**: Health and community data are strictly separated into different databases. No real names or phone numbers are collected. Under-18 users go through a mandatory parental consent flow.

## 🛠️ Tech Stack

Maitri is built with a modern, full-stack JavaScript architecture designed for privacy and speed.

- **Frontend**: React (Vite template), TailwindCSS for styling. Configured as a Progressive Web App (PWA).
- **Backend API**: Node.js, Express.
- **Database**: MongoDB (Mongoose).
- **AI Layer**: Groq/Claude integration for the "Ask Maitri" feature and automated community moderation.
- **Deployment**: Vercel (Frontend & Serverless API via `vercel.json`).

## 🚀 Local Development

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB instance (local or Atlas)

### 1. Clone & Setup

```bash
git clone https://github.com/Pratik-kr21/Maitri.git
cd Maitri
```

### 2. Environment Variables

Create a `.env` file in the `server` directory based on the following template:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/maitri
JWT_SECRET=your_super_secret_jwt_key
# API keys for Ask Maitri implementation
# VITE_API_BASE_URL=http://localhost:5000 (frontend environment variable if needed)
```

### 3. Install Dependencies & Run

You need to start both the frontend Vite development server and the backend Express server.

**Terminal 1 (Backend):**
```bash
cd server
npm install
npm run dev
```

**Terminal 2 (Frontend):**
```bash
# In the root Maitri directory
npm install
npm run dev
```

The app will be available at `http://localhost:5173` (or the port Vite provides) and the API runs on `http://localhost:5000`.

## 🛡️ Privacy Architecture

Maitri's architecture is built on the principle of data separation. Health data (cycles, symptoms) and community identities are functionally distinct. All personal health logs are encrypted at the application layer before reaching the database. There is no integration with generic third-party ad networks or social logins, ensuring user data is never monetized.

## 📄 License

This project is proprietary and intended for the Maitri product suite. All rights reserved.
