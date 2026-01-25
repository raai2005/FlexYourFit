# Mock Interview Prep

An AI-powered mock interview platform designed to help users practice and improve their interview skills with real-time feedback.

![Project Banner](public/banner-placeholder.png)

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

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Frontend**: React 19, Tailwind CSS 4
- **AI Model**: [Google Gemini AI](https://deepmind.google/technologies/gemini/) (gemini-2.5-flash)
- **Voice Engine**: [Vapi](https://vapi.ai/)
- **Backend Service**: [Firebase](https://firebase.google.com/)
  - **Authentication**: Secure user login.
  - **Firestore**: NoSQL database for storing user data & interviews.
  - **Admin SDK**: Server-side management.
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/) (based on Radix UI) & Lucide React Icons.
- **Language**: TypeScript

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
