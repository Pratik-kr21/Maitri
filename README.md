<![CDATA[# 🌸 Maitri — Know Your Cycle

> *The first period tracker that teaches you what your cycle is actually telling you — privately, safely, and with people who get it.*

**Maitri** is a privacy-first, AI-powered women's health Progressive Web App (PWA). It goes beyond simple period prediction — connecting your logged symptoms to real physiological explanations, surfacing patterns you'd never notice on your own, and providing a safe, moderated community of women at similar life stages.

[![Version](https://img.shields.io/badge/version-1.2.0-E87A86?style=for-the-badge)]()
[![PWA](https://img.shields.io/badge/PWA-Installable-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)]()
[![License](https://img.shields.io/badge/license-ISC-blue?style=for-the-badge)]()

---

## ✨ Features

### 🩸 Intelligent Cycle Tracking
- Log cycle start dates and receive phase predictions (Menstrual, Follicular, Ovulatory, Luteal)
- Visual progress bar showing where you are in your current cycle
- Transparent confidence tiers — predictions get smarter with every logged cycle

### 📝 Daily Symptom Journal
- Quick micro-conversation check-ins (energy, physical symptoms, mood) designed to take under 30 seconds
- Calendar-style history view of all logged entries
- Automatic pattern surfacing after 2+ cycles of data

### 🤖 Ask Maitri — AI Health Companion
- Phase-aware, empathetic AI chatbot that knows your current cycle phase and recent symptoms
- **Multi-provider failover** across Google Gemini, Groq (Llama 3), and OpenRouter for 99.9% uptime
- **Persistent chat history** with conversations grouped by date in a collapsible sidebar
- Per-user rate limiting and server-side AI response caching

### 🫂 Community Circles
- Anonymous, moderated spaces grouped by life stage (Teens, 20s & 30s, Perimenopause, etc.)
- Structured post types: Questions, Experiences, Wins, Resources
- Upvoting, threaded replies, and weekly engagement prompts

### 🗄️ Health Vault & Data Export
- Complete history of cycle patterns, symptom logs, and AI conversations
- One-click data export for sharing with healthcare providers
- Full data deletion capabilities

### 🔐 Privacy & Security
- OTP-based passwordless authentication via email
- JWT session management with secure token handling
- Toggle-able pattern detection, AI chat history retention, and push notifications
- Customisable profiles with avatar and accent color selection

### 📱 Progressive Web App (PWA)
- Installable on mobile (Android & iOS) and desktop
- Offline-capable with service worker caching
- Push notification support for cycle reminders and insights
- Native app-like experience with standalone display mode

---

## 🛠️ Technology Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 19** (Vite 7) | UI framework with fast HMR |
| **React Router DOM v7** | Client-side routing with protected routes |
| **TailwindCSS 3** | Utility-first responsive styling |
| **Axios** | HTTP client for API communication |
| **React Icons** | Icon library |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js / Express 5** | REST API server |
| **MongoDB / Mongoose 9** | Database & ODM |
| **JWT** | Stateless session authentication |
| **Nodemailer** | OTP email delivery |
| **web-push** | Browser push notifications (VAPID) |
| **Helmet** | HTTP security headers |
| **express-rate-limit** | API rate limiting |
| **Morgan** | HTTP request logging |

### AI Service Layer
A custom multi-provider fallback system that automatically fails over between:
1. **Google Gemini API** (gemini-1.5-flash) — Primary
2. **Groq API** (llama3-8b-8192) — Secondary
3. **OpenRouter API** (Gemma 3 / Mistral free models) — Tertiary

### Deployment
| Service | Role |
|---|---|
| **Vercel** | Frontend hosting + serverless API functions |

---

## 📁 Project Structure

```
Maitri/
├── public/                     # Static assets & PWA files
│   ├── manifest.json           # PWA web app manifest
│   ├── sw.js                   # Service worker (caching + push)
│   ├── android-chrome-*.png    # App icons (192x192, 512x512)
│   ├── apple-touch-icon.png    # iOS home screen icon
│   └── favicon.*               # Browser favicons
│
├── src/                        # React frontend
│   ├── main.jsx                # Entry point + SW registration
│   ├── App.jsx                 # Root component & routing
│   ├── index.css               # Global styles & design tokens
│   ├── context/
│   │   ├── AuthContext.jsx     # Authentication state provider
│   │   └── ToastContext.jsx    # Toast notification provider
│   ├── components/
│   │   └── layout/
│   │       ├── AppLayout.jsx   # Protected layout shell with nav
│   │       └── AppLayout.css
│   ├── lib/
│   │   └── api.js              # Axios instance & interceptors
│   └── pages/
│       ├── LandingPage.jsx     # Public marketing page
│       ├── LoginPage.jsx       # OTP login
│       ├── SignupPage.jsx       # Registration flow
│       ├── VerifyEmailPage.jsx # Email verification
│       ├── HomePage.jsx        # Dashboard with cycle tracking
│       ├── JournalPage.jsx     # Daily symptom check-ins
│       ├── AskMaitriPage.jsx   # AI chat interface
│       ├── CommunityPage.jsx   # Community circles
│       ├── VaultPage.jsx       # Health data vault & export
│       └── ProfilePage.jsx     # User profile & settings
│
├── server/                     # Express backend
│   ├── index.js                # Server entry point
│   ├── package.json            # Backend dependencies
│   ├── controllers/
│   │   ├── authController.js       # Signup, login, OTP, verify
│   │   ├── cycleController.js      # Cycle CRUD & predictions
│   │   ├── journalController.js    # Daily log management
│   │   ├── insightController.js    # AI-generated daily insights
│   │   ├── askMaitriController.js  # AI chat endpoint
│   │   ├── communityController.js  # Posts, replies, upvotes
│   │   └── vaultController.js      # Data export & history
│   ├── models/
│   │   ├── User.js             # User schema (auth, preferences)
│   │   ├── Cycle.js            # Cycle records
│   │   ├── DailyLog.js         # Symptom journal entries
│   │   ├── Post.js             # Community posts
│   │   ├── Reply.js            # Threaded replies
│   │   ├── ChatHistory.js      # AI conversation persistence
│   │   └── AiCache.js          # Cached AI responses
│   ├── routes/
│   │   ├── auth.js
│   │   ├── cycles.js
│   │   ├── journal.js
│   │   ├── insights.js
│   │   ├── askMaitri.js
│   │   ├── community.js
│   │   └── vault.js
│   ├── services/
│   │   └── aiService.js        # Multi-provider AI fallback engine
│   └── middleware/             # Auth guards & rate limiters
│
├── api/                        # Vercel serverless adapter
├── index.html                  # App shell (PWA-configured)
├── vite.config.js              # Vite config with API proxy
├── tailwind.config.js          # Tailwind theme configuration
├── vercel.json                 # Vercel deployment config
└── package.json                # Root dependencies & scripts
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **MongoDB** instance (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- At least **one AI API key** from: [Google AI Studio](https://aistudio.google.com/), [Groq](https://console.groq.com/), or [OpenRouter](https://openrouter.ai/)

### 1. Clone the Repository

```bash
git clone https://github.com/Pratik-kr21/Maitri.git
cd Maitri
```

### 2. Install Dependencies

```bash
# Frontend dependencies
npm install

# Backend dependencies
cd server
npm install
cd ..
```

### 3. Configure Environment Variables

#### Backend — `server/.env`

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d

# Email (Gmail App Password recommended)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
CLIENT_URL=http://localhost:5173
NODE_ENV=development

# AI Providers — at least one is required
GEMINI_API_KEY=your_gemini_api_key
GROQ_API_KEY=your_groq_api_key
OPENROUTER_API_KEY=your_openrouter_api_key

# Push Notifications — generate with: npx web-push generate-vapid-keys
VAPID_PUBLIC_KEY=your_vapid_public_key
VAPID_PRIVATE_KEY=your_vapid_private_key
```

#### Frontend — `.env` (project root)

```env
VITE_VAPID_PUBLIC_KEY=your_vapid_public_key
VITE_API_URL=http://localhost:5000/api
```

### 4. Run the Application

You need **two terminal windows**:

```bash
# Terminal 1 — Backend
cd server
npm run dev
```

```bash
# Terminal 2 — Frontend
npm run dev
```

Open **http://localhost:5173** in your browser.

### 5. Build for Production

```bash
npm run build    # Outputs to dist/
npm run preview  # Preview the production build locally
```

---

## 📱 PWA Installation

Maitri is a fully installable Progressive Web App:

| Platform | How to Install |
|---|---|
| **Android (Chrome)** | Tap the "Add to Home Screen" banner or use the browser menu → "Install App" |
| **iOS (Safari)** | Tap the Share button → "Add to Home Screen" |
| **Desktop (Chrome/Edge)** | Click the install icon in the address bar |

Once installed, Maitri runs in standalone mode with its own window, offline caching, and push notifications.

---

## 🌐 Deployment

The project is configured for **Vercel** deployment:

1. Connect your GitHub repository to Vercel
2. Set all environment variables from above in Vercel's dashboard
3. The `vercel.json` handles routing — API requests go to serverless functions, everything else falls through to the SPA

---

## 🗺️ Application Routes

| Route | Access | Description |
|---|---|---|
| `/` | Public | Landing page |
| `/login` | Public | OTP-based login |
| `/signup` | Public | Registration flow |
| `/verify-email` | Public | Email verification |
| `/home` | Protected | Dashboard with cycle tracking & insights |
| `/journal` | Protected | Daily symptom check-in |
| `/ask` | Protected | Ask Maitri AI companion |
| `/community` | Protected | Community circles |
| `/vault` | Protected | Health data vault & export |
| `/profile` | Protected | Settings & preferences |

---

## 🔒 Disclaimer

Maitri provides **health education only**. It is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.

---

## 🤝 Contributing

Maitri thrives on community feedback! Here's how you can help:

1. **Report bugs** — [Open an issue](https://github.com/Pratik-kr21/Maitri/issues)
2. **Request features** — Share your ideas in the issues tab
3. **Contribute code** — Fork the repo, create a branch, and submit a pull request

---

## 📄 License

This project is licensed under the **ISC License**.

---

<p align="center">Built with 💜 for women's health</p>
]]>
