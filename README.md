# Mock Interview Prep

An AI-powered mock interview platform designed to help users practice and improve their interview skills with real-time feedback.

![Project Banner](public/assets/DWS7OLFYIC5ITK1T.png)

## 💡 Inspiration

The idea for **FlexYourFit** was born out of a common struggle: **interview anxiety**. We realized that many talented candidates fail not because they lack knowledge, but because they lack the practice to articulate their thoughts clearly under pressure. Traditional mock interviews require a peer (who might not give good feedback) or a paid coach (who is expensive). We wanted to democratize this process using Generative AI, creating a safe, judgment-free zone where anyone can "flex" their interview muscles until they fit the role perfectly.

## 🚀 What it does

**FlexYourFit** is an interactive, AI-powered specialized interview coaching platform. Here is the flow:

1.  **Role Selection**: Users tell the platform what job they are applying for (e.g., "Senior React Developer") and their experience level.
2.  **Real-time Simulation**: The AI acts as a hiring manager, conducting a voice-based interview. It asks relevant technical and behavioral questions.
3.  **Voice Interaction**: Users answer verbally. The system transcribes their speech in real-time.
4.  **Instant Feedback**: Once the interview ends, the AI analyzes the answers against industry standards. It provides a score, highlights strengths, points out weaknesses, and suggests better ways to frame the answers.

## ⚙️ How we built it

This project was built with a focus on **real-time interaction** and **seamless user experience**.

- **Frontend**: We utilized **Next.js 16** for its server-side rendering capabilities and the new App Router.
- **AI Integration**: The core "brain" is **Google's Gemini AI**, which generates dynamic questions and analyzes answers.
- **Voice Engine**: We integrated **Vapi** to handle the speech-to-text and text-to-speech pipeline, creating a natural conversational flow.
- **Backend & Database**: **Firebase** handles secure authentication and stores interview transcripts and scores in **Firestore**.
- **Styling**: We used **Tailwind CSS 4** and **Shadcn UI** for a clean, accessible, and modern design.

## 🧩 Challenges we ran into

1.  **Latency in Voice AI**: One of the biggest hurdles was minimizing the delay between the user speaking and the AI responding. Optimizing the Vapi configuration and Gemini API calls was crucial to keep the conversation natural.
2.  **Prompt Engineering**: Getting the AI to act like a strict yet helpful interviewer took several iterations. We had to fine-tune the system prompts to ensure the AI asked relevant follow-up questions and didn't just accept vague answers.
3.  **Real-time State Management**: Synchronizing the voice state (listening/speaking) with the UI visualizers required complex state management in React to avoid UI glitches.

## 🏆 Accomplishments that we're proud of

- **Seamless Voice Integration**: Successfully creating a hands-free experience where users can just talk to their computer and get an intelligent response.
- **Dynamic Feedback Engine**: The feedback system doesn't just give a generic score; it truly "listens" to the content of the answer and provides specific, actionable advice.
- **Zero-Latency Feel**: Achieving a near-conversational response time that makes the AI feel present and attentive.

## 📚 What we learned

- **The power of Multimodal AI**: Combining text generation (Gemini) with voice synthesis creates a significantly more engaging user experience than text-only interfaces.
- **Edge cases in Speech-to-Text**: We learned how to handle accents, background noise, and interruptions to make the application robust for real-world use.
- **Full-stack Architecture**: Building a seamless integration between a Next.js frontend, serverless backend functions, and third-party AI APIs deepened our understanding of modern web architecture.

## 🔮 What's next for FlexYourFit

- **Custom Resume Analysis**: Allowing users to upload their resume so the AI can ask questions specific to their actual past experience.
- **Coding Pad Integration**: Adding a live coding environment for technical interviews where the AI can review code in real-time.
- **Mobile Application**: Building a React Native version to allow users to practice interviews on the go, perhaps before walking into a real one.
- **Community Leaderboard**: Gamifying the process to encourage users to practice more often.

## Features

- **🤖 AI Mock Interviews**: Experience realistic interview sessions tailored to your specific job role and description using Google's advanced Gemini AI.
- **🎙️ Natural Voice Interaction**: Speak naturally with the AI interviewer. Integrated with Vapi for seamless speech-to-text and text-to-speech capabilities, making the experience feel like a real conversation.
- **📊 Comprehensive Feedback**: Get instant, detailed feedback after every session:
  - **Overall Score**: A quantitative rating (0-100) of your performance.
  - **Review**: A summary of how you did.
  - **Strengths**: Specific areas where you excelled.
  - **Improvements**: Actionable advice on what to improve.
  - **Sample Answers**: See better ways to answer the questions asked.
- **📈 Progress Dashboard**: Track your interview history, monitor your scores over time, and visualize your improvement with interactive charts.
- **🔐 Secure Authentication**: Robust user management using Firebase Authentication (Google & Email/Password).
- **🛠️ Admin Panel**: A dedicated admin area to manage interview templates, questions, and system settings.
- **📱 Responsive Design**: Fully optimized for desktop, tablet, and mobile devices.

## Folder Structure

```
mock_interview/
├── app/                    # Next.js 16 App Router (Pages & API routes)
│   ├── (auth)/             # Authentication routes (sign-in, sign-up)
│   ├── (root)/             # Main application layout & home
│   ├── admin/              # Admin dashboard & controls
│   ├── dashboard/          # User dashboard (stats, history)
│   ├── interview/          # Interview session logic
│   └── api/                # Backend API endpoints
├── components/             # Reusable UI components (Shadcn UI, Custom)
├── lib/                    # Utilities, helper functions, and actions
│   ├── actions/            # Server Actions (Gemini, Database ops)
│   └── utils.ts            # Common utility functions
├── Firebase/               # Firebase configuration (Client & Admin)
├── public/                 # Static assets (images, icons)
├── types/                  # TypeScript interface definitions
└── ...config files         # Tailwind, Next.js, ESLint configs
```

## 🛠️ Built With

### Technologies

- ![Next.js](https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white) **[Next.js 16](https://nextjs.org/)** - App Router & Server Actions.
- ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) **[React 19](https://react.dev/)** - Component-based UI library.
- ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) **[TypeScript](https://www.typescriptlang.org/)** - Static type checking.
- ![Tailwind CSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white) **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS framework.

### AI & Cloud Services

- ![Google Gemini](https://img.shields.io/badge/Google%20Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white) **[Google Gemini AI](https://deepmind.google/technologies/gemini/)** - Generative AI for interview logic.
- 🗣️ **[Vapi](https://vapi.ai/)** - Real-time Voice AI infrastructure.
- ![Firebase](https://img.shields.io/badge/firebase-%23039BE5.svg?style=for-the-badge&logo=firebase) **[Firebase](https://firebase.google.com/)** - Auth, Firestore, and Admin SDK.

### Tools & Components

- **[Shadcn UI](https://ui.shadcn.com/)** - Reusable UI components.
- **[Lucide Icons](https://lucide.dev/)** - Beautiful & consistent icons.
- **[Firebase Auth](https://firebase.google.com/docs/auth)** - Secure User Authentication.

## Getting Started

### Prerequisites

- **Node.js**: v18 or later (LTS recommended)
- **Package Manager**: npm, yarn, pnpm, or bun

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/yourusername/mock-interview-prep.git
    cd mock_interview_prep
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Environment Setup:**
    Create a `.env.local` file in the root directory and add your credentials:

    ```env
    # Google Gemini AI
    GEMINI_API_KEY=your_gemini_api_key

    # Vapi (Voice AI)
    NEXT_PUBLIC_VAPI_PUBLIC_KEY=your_vapi_public_key

    # Firebase Client (from Project Settings)
    NEXT_PUBLIC_FIREBASE_API_KEY=...
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
    NEXT_PUBLIC_FIREBASE_APP_ID=...
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=...

    # Firebase Admin (Service Account)
    FIREBASE_PROJECT_ID=...
    FIREBASE_CLIENT_EMAIL=...
    FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."

    # Admin Access
    ADMIN_SECRET=your_secure_secret
    ```

4.  **Run Locally:**
    ```bash
    npm run dev
    ```
    Visit [http://localhost:3000](http://localhost:3000) to view the app.

## Usage

1.  **Sign Up/Login**: Create an account to save your progress.
2.  **Start Interview**: Click "Start New Interview" on the dashboard.
3.  **Configure**: Enter the Job Role (e.g., "Full Stack Developer"), Job Description, and Years of Experience.
4.  **Interview**:
    - Allow microphone access.
    - Listen to the AI interviewer's questions.
    - Speak your answers clearly.
    - Click "End Interview" when finished.
5.  **Review**: Check your Feedback page for scores and actionable advice.

## Screenshots

|                Landing Page                |             Interview Session              |                   Dashboard                    |
| :----------------------------------------: | :----------------------------------------: | :--------------------------------------------: |
| ![Landing](public/landing-placeholder.png) | ![Session](public/session-placeholder.png) | ![Dashboard](public/dashboard-placeholder.png) |

## Contributing

Contributions are welcome!

1.  Fork the project.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

**Megha Roy** - [LinkedIn Profile](https://www.linkedin.com/in/megha1999r/) - roymegha952@gmail.com

Project Link: [https://github.com/raai2005/FlexYourFit](https://github.com/raai2005/FlexYourFit)
