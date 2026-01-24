# Mock Interview Prep

An AI-powered mock interview platform designed to help users practice and improve their interview skills with real-time feedback.

## Features

- **AI Mock Interviews**: Simulate real interview scenarios with Google Gemini AI.
- **Voice Interaction**: Speak naturally with the AI interviewer using Vapi for a realistic experience.
- **Real-time Feedback**: Receive detailed performance analysis, including scores, strengths, and areas for improvement.
- **Dashboard**: Track your progress with visual charts and interview history.
- **Secure Authentication**: User management and authentication via Firebase.
- **Admin Panel**: Manage interview content and settings.

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Frontend**: React 19, Tailwind CSS 4
- **AI**: [Google Gemini AI](https://deepmind.google/technologies/gemini/)
- **Voice**: [Vapi](https://vapi.ai/)
- **Backend/Database**: [Firebase](https://firebase.google.com/) (Auth, Firestore, Admin SDK)
- **Styling**: Tailwind CSS, Shadcn UI (Radix Primitives), Lucide React
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js (latest LTS recommended)
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd mock_interview
   ```

2. **Install dependencies:**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Environment Setup:**

   Create a `.env.local` file in the root directory and add the following environment variables:

   ```env
   # Gemini AI
   GEMINI_API_KEY=your_gemini_api_key

   # Firebase Client SDK
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

   # Firebase Admin SDK
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_CLIENT_EMAIL=your_client_email
   FIREBASE_PRIVATE_KEY="your_private_key"

   # Admin Authentication
   ADMIN_SECRET=your_admin_secret_key
   # or
   ADMIN_PASS=your_admin_password
   ```

4. **Run the development server:**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Gemini API Documentation](https://ai.google.dev/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
