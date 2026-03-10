# 🌸 Maitri v1.2

**Maitri** is an empathetic, comprehensive, and privacy-focused women's health companion application. It provides intelligent cycle tracking, symptom journaling, and an empathetic AI companion to support women through their daily health journey.

## ✨ Key Features

*   **Intelligent Cycle Tracking**: Log your cycle start dates to receive predictions for upcoming phases (Menstrual, Follicular, Ovulatory, Luteal) and next periods.
*   **Daily Check-ins**: A quick, intuitive journaling system to log daily energy levels, physical symptoms (cramps, bloating, headache, etc.), and emotional mood.
*   **Personalised AI Insights**: Generates a bespoke daily insight connecting your logged symptoms to your current cycle phase, offering actionable, gentle tips.
*   **Ask Maitri (AI Companion)**: An integrated, empathetic AI chatbot powered by leading language models. You can ask questions about your cycle, hormones, or symptoms and receive educational, supportive answers tailored to your current phase.
*   **Secure Authentication**: Passwordless OTP-based authentication via email.
*   **Privacy-First Design**: Total control over your data. Easily toggle pattern detection, AI chat history retention, and push notifications directly from your profile settings.
*   **Customisable Profiles**: Personalise your experience by choosing an avatar and an accent color to make Maitri truly yours.
*   **Push Notifications**: (Optional) Receive timely reminders for daily check-ins and cycle predictions.

## 🛠️ Technology Stack

**Frontend:**
*   **React 18** (Vite)
*   React Router DOM for navigation
*   TailwindCSS for modern, responsive, and beautiful UI styling
*   Axios for API communication

**Backend:**
*   **Node.js / Express**
*   **MongoDB & Mongoose** for the database
*   **OpenRouter API** for AI capabilities (Ask Maitri, Insights)
*   **Nodemailer** for email delivery (OTP, Verification)
*   **web-push** for browser push notifications
*   **JWT** for secure session management

## 🚀 Installation & Setup

### Prerequisites
*   Node.js (v18+ recommended)
*   MongoDB instance (Local or Atlas)
*   An OpenRouter API key

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
OPENROUTER_API_KEY=your_openrouter_api_key

# Generate these using `npx web-push generate-vapid-keys`
VAPID_PUBLIC_KEY=your_vapid_public_key
VAPID_PRIVATE_KEY=your_vapid_private_key
```

**Frontend (`.env` in the root folder):**
```env
# Must match the VAPID_PUBLIC_KEY from the server
VITE_VAPID_PUBLIC_KEY=your_vapid_public_key
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

## 🚀 Future Integrations & Roadmap

We are constantly working to improve Maitri. Here are some of the exciting features planned for future releases:

*   **Wearable Integration**: Sync with Apple Health, Google Fit, Oura Ring, and Fitbit to automatically track sleep, heart rate variability (HRV), and activity levels, providing even more context to AI insights.
*   **Community Forums**: A safe, anonymous space for users to discuss women's health topics, share experiences, and support one another.
*   **Partner Sharing**: An optional, privacy-controlled feature to share cycle phases and mood with a partner to foster better understanding and communication.
*   **Export to Doctor**: A secure feature to compile and export your symptom history and cycle data into a neat PDF to share with your healthcare provider.
*   **Localized Content**: Support for multiple languages and regionally relevant health articles.
*   **Pregnancy & Postpartum Modes**: Specialized tracking modes beyond the standard menstrual cycle.

## 🤝 Contributing & Community

Maitri thrives on community feedback. If you have a feature request, bug report, or want to contribute to the codebase, please open an issue or submit a pull request!

---
*Built with 💜 for women's health.*
