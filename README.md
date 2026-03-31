# 🌸 Maitri v1.2

**Maitri** is an empathetic, comprehensive, and privacy-focused women's health companion application. It provides intelligent cycle tracking, symptom journaling, an empathetic AI companion, and a supportive community to empower women through their daily health journey.

## ✨ Key Features

*   **Intelligent Cycle Tracking**: Log your cycle start dates to receive predictions for upcoming phases (Menstrual, Follicular, Ovulatory, Luteal) and next periods, with a visual progress bar.
*   **Daily Check-ins**: A quick, intuitive journaling system to log daily energy levels, physical symptoms (cramps, bloating, headache, etc.), and emotional mood.
*   **Personalised AI Insights**: Generates a bespoke daily insight connecting your logged symptoms to your current cycle phase, offering actionable, gentle tips and explaining what's happening in your body.
*   **Ask Maitri (AI Companion)**: An integrated, empathetic AI chatbot powered by leading language models. 
    * **Multi-Provider Fallback:** Ensures 99.9% uptime by automatically failing over between Google Gemini, Groq (Llama 3), and OpenRouter models.
    * **Persistent Chat History:** Seamlessly review past conversations grouped by date in a collapsible sidebar.
    * **Phase-Aware Responses:** The AI knows your current cycle phase and recent symptoms to provide highly personalized educational answers.
*   **Community Circles**: Connect anonymously with women at your life stage. Share experiences, ask questions, and offer support in moderated, age-gated communities (e.g., Teens, 20s & 30s, Perimenopause).
*   **Health Vault Data Export**: Total control over your data. View a comprehensive history of your cycle patterns and securely export your logged symptoms and data.
*   **Secure Authentication**: Passwordless OTP-based authentication via email for frictionless and secure login.
*   **Privacy-First Design**: Your data is yours. Easily toggle pattern detection, AI chat history retention, and push notifications directly from your profile settings.
*   **Customisable Profiles**: Personalise your experience by choosing an avatar and an accent color to make Maitri truly yours.
*   **Edge-to-Edge Responsive UI**: A fully responsive, premium, glassmorphism-inspired interface that looks beautiful across all devices.

## 🛠️ Technology Stack

**Frontend:**
*   **React 18** (Vite)
*   **React Router DOM** for navigation
*   **TailwindCSS** for modern, responsive, edge-to-edge UI styling
*   **Axios** for API communication

**Backend:**
*   **Node.js / Express**
*   **MongoDB & Mongoose** for the database
*   **AI Service Layer**: A custom multi-provider fallback system natively integrating:
    * **Google Gemini API** (gemini-1.5-flash)
    * **Groq API** (llama3-8b-8192)
    * **OpenRouter API** (free models like Gemma 3 and Mistral)
*   **Nodemailer** for email delivery (OTP, Verification)
*   **web-push** for browser push notifications
*   **JWT (JSON Web Tokens)** for secure session management

## 🚀 Installation & Setup

### Prerequisites
*   Node.js (v18+ recommended)
*   MongoDB instance (Local or Atlas)
*   API Keys: Gemini API, Groq API, OpenRouter API (at least one is required for the AI features)

### 1. Clone & Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
```

### 2. Environment Variables

You need to create two `.env` files.

**Backend (`server/.env`):**
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
CLIENT_URL=http://localhost:5173
NODE_ENV=development

# AI Providers (Provide at least one)
GEMINI_API_KEY=your_gemini_api_key
GROQ_API_KEY=your_groq_api_key
OPENROUTER_API_KEY=your_openrouter_api_key

# Generate these using `npx web-push generate-vapid-keys`
VAPID_PUBLIC_KEY=your_vapid_public_key
VAPID_PRIVATE_KEY=your_vapid_private_key
```

**Frontend (`.env` in the root folder):**
```env
# Must match the VAPID_PUBLIC_KEY from the server
VITE_VAPID_PUBLIC_KEY=your_vapid_public_key
# API URL (Optional, defaults to /api in proxy or production)
VITE_API_URL=http://localhost:5000/api
```

### 3. Run the Application

Maitri runs in two parts. You will need two terminal windows.

**Terminal 1 (Backend):**
```bash
cd server
npm run dev
```

**Terminal 2 (Frontend):**
```bash
# In the root project directory
npm run dev
```

Visit `http://localhost:5173` in your browser.

## 🔒 Disclaimer
Maitri provides **health education only**. It is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.

## 🤝 Contributing & Community

Maitri thrives on community feedback. If you have a feature request, bug report, or want to contribute to the codebase, please open an issue or submit a pull request!

---
*Built with 💜 for women's health.*
