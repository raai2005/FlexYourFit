import React from "react";
import Link from "next/link";
import { Mic, BarChart3, Route } from "lucide-react";

const features = [
  {
    icon: Mic,
    title: "Realistic AI voice interviews",
    desc: "Practice out loud with an interviewer that adapts to your answers.",
  },
  {
    icon: BarChart3,
    title: "Instant scoring & feedback",
    desc: "Get a 0–100 score with strengths and fixes after every session.",
  },
  {
    icon: Route,
    title: "Personalized prep roadmaps",
    desc: "Follow a step-by-step plan to close your skill gaps.",
  },
];

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[1.05fr_1fr]">
      {/* LEFT — brand panel (desktop only) */}
      <aside className="relative hidden lg:flex flex-col justify-between overflow-hidden p-12 xl:p-16">
        {/* Layered backdrop */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#17143c] via-[#0d0a22] to-[#08090e]" />
        <div className="absolute inset-0 bg-grid opacity-50" />
        <div className="absolute -top-28 -left-20 w-[34rem] h-[34rem] glow-brand opacity-60" />
        <div className="absolute -bottom-10 right-0 w-[26rem] h-[26rem] rounded-full bg-violet-600/20 blur-[110px]" />

        {/* Top: logo */}
        <Link href="/" className="relative z-10 flex items-center gap-2.5 w-fit">
          <div className="grid place-items-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-[0_8px_24px_-6px_rgba(99,102,241,0.7)]">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
              <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" opacity="0.7" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight text-white">FlexYourFit</span>
        </Link>

        {/* Middle: headline + features */}
        <div className="relative z-10 max-w-md">
          <h2 className="text-4xl xl:text-5xl font-bold text-white leading-[1.1] tracking-tight mb-5">
            Land your dream role with{" "}
            <span className="text-gradient-brand">confidence.</span>
          </h2>
          <p className="text-indigo-100/70 text-lg mb-10 leading-relaxed">
            Prepare smarter with AI-powered mock interviews, instant feedback, and a roadmap
            built around your goals.
          </p>
          <ul className="space-y-5">
            {features.map((f) => (
              <li key={f.title} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 grid place-items-center text-indigo-200 shrink-0">
                  <f.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-white font-semibold">{f.title}</p>
                  <p className="text-indigo-100/55 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom: footer */}
        <p className="relative z-10 text-indigo-100/40 text-sm">
          © 2026 FlexYourFit. All rights reserved.
        </p>
      </aside>

      {/* RIGHT — form panel */}
      <main className="relative flex items-center justify-center px-6 py-12 sm:px-10 min-h-screen">
        <div className="absolute inset-0 bg-grid bg-grid-fade opacity-40 lg:hidden pointer-events-none" />
        <div className="relative z-10 w-full max-w-md">{children}</div>
      </main>
    </div>
  );
};

export default AuthLayout;
