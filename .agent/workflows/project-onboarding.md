---
description: Comprehensive guide to the MindOasis project architecture and features for agent onboarding
---

# MindOasis - Project Onboarding Guide

MindOasis is a premium mental wellness application designed to help users track their moods, journal their thoughts, and manage burnout through AI-driven insights and interactive simulations.

## 🏗️ Architecture Overview

The app is built using **React** and **Vite**, prioritizing a smooth, premium user experience with modern UI/UX principles.

### 💾 Data Persistence
- **Local Storage**: The app uses `localStorage` for all data persistence.
- **Service Layer**: [storage.js](file:///d:/IGDTU/src/services/storage.js) acts as the data access layer, managing keys for moods, journals, burnout results, and scenario interactions.

### 🔐 State Management
- **UserContext**: [UserContext.jsx](file:///d:/IGDTU/src/context/UserContext.jsx) manages the user session (sign-up/login state) using the `mindoasis_user` key in `localStorage`.
- **ToastProvider**: Manages global notifications.

---

## 🚀 Key Features

### 1. Mood Tracking & Dashboard
- **Dynamic Backgrounds**: Uses [ShaderBackground.jsx](file:///d:/IGDTU/src/components/ShaderBackground.jsx) and [DynamicHomeBackground.jsx](file:///d:/IGDTU/src/components/DynamicHomeBackground.jsx) for an immersive feel.
- **Mood Analytics**: [AnalyticalTracker.jsx](file:///d:/IGDTU/src/components/AnalyticalTracker.jsx) uses `chart.js` to visualize mood trends.

### 2. Emotional Journaling
- **AI Analysis**: [ai.js](file:///d:/IGDTU/src/services/ai.js) performs keyword-based analysis to detect emotional tone and stress triggers (Academic, Work, Social, etc.).
- **Art Therapy**: [DrawingCanvas.jsx](file:///d:/IGDTU/src/components/DrawingCanvas.jsx) allows users to express emotions visually and save drawings to their journal.

### 3. Burnout Assessment
- **Assessment Logic**: [Burnout.jsx](file:///d:/IGDTU/src/pages/Burnout.jsx) combines questionnaire answers with journal history to calculate a burnout risk level (Low, Moderate, High).

### 4. Interactive Simulator
- **Situational Analysis**: [Simulator.jsx](file:///d:/IGDTU/src/pages/Simulator.jsx) presents users with common stressors (e.g., Exam Failure, Imposter Syndrome).
- **Outcome Engine**: Users make choices, and the app provides AI-simulated outcomes and recommended healthy behaviors.

---

## 🤖 AI Simulation Engine

The "AI" in MindOasis is currently a sophisticated keyword-based simulation engine found in [ai.js](file:///d:/IGDTU/src/services/ai.js).

> [!NOTE]
> This engine can be easily swapped with a real LLM API (like Gemini) by updating the `analyzeJournal` and `assessBurnout` functions in `src/services/ai.js`.

---

## 🎨 Key Components

- **[MoodAvatar.jsx](file:///d:/IGDTU/src/components/MoodAvatar.jsx)**: A customizable SVG-based companion that changes expressions based on user mood.
- **[DrawingCanvas.jsx](file:///d:/IGDTU/src/components/DrawingCanvas.jsx)**: A full-featured `<canvas>` component with undo/redo, stickers, and custom brush tools.
- **[Layout.jsx](file:///d:/IGDTU/src/components/Layout.jsx)**: The main shell containing the persistent navigation and glassmorphism UI elements.

---

## 🛠️ Development Workflows

### Running Locally
```powershell
npm run dev
```

### Key Data Keys (localStorage)
- `mindoasis_user`: User profile data
- `mindoasis_moods`: Array of mood logs
- `mindoasis_journals`: Array of journal entries
- `mindoasis_burnout`: History of burnout assessments
