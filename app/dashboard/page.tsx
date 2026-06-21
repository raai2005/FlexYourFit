/* Dashboard is now a Server Component */
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Briefcase, Sparkles, ArrowRight } from "lucide-react";
import DashboardNavbar from "../components/DashboardNavbar";
import InterviewSection from "../components/InterviewSection";
import UserStats from "../components/UserStats";
import { getInterviews } from "@/lib/actions/interview.action";

const DashboardPage = async () => {
  // Fetch data on the server
  const interviews = await getInterviews();

  const roleBased = interviews.filter((i) => i.type === "role");
  const skillBased = interviews.filter((i) => i.type === "skill");

  return (
    <div className="min-h-screen bg-background">
      <DashboardNavbar />

      <main className="pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Welcome Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-fg mb-2 tracking-tight">
                Welcome to FlexYourFit
              </h1>
              <p className="text-fg-muted">Ready to ace your next technical interview?</p>
            </div>

            <div className="flex items-center gap-4">
              <UserStats />
            </div>
          </div>

          {/* CTA Section */}
          <section className="relative overflow-hidden rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-600/20 via-surface to-violet-600/10 p-8 md:p-12">
            <div className="absolute -top-20 -right-10 w-80 h-80 glow-brand opacity-40 pointer-events-none" />
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
              <div className="max-w-xl text-left">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient-brand">
                  Ready to Ace Your Next Interview?
                </h2>
                <p className="text-fg-muted mb-8 text-lg leading-relaxed">
                  Access over 500+ AI-driven mock interviews, get instant feedback, and
                  confidently land your dream job.
                </p>
                <Link href="/interviews" className="btn btn-primary h-13 px-8 text-base">
                  Start Practicing Now
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>

              <div
                className="hidden md:block relative w-96 h-96 -my-12 -mr-12"
                style={{
                  maskImage: "linear-gradient(to right, transparent, black 20%)",
                  WebkitMaskImage: "linear-gradient(to right, transparent, black 20%)",
                }}
              >
                <Image src="/assets/code-cta-matched.png" alt="Coding Interface" fill className="object-contain" />
              </div>
            </div>
          </section>

          {/* Role Based Interviews */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-brand-soft border border-indigo-500/20 grid place-items-center">
                  <Briefcase className="w-[18px] h-[18px] text-brand-bright" />
                </div>
                <h2 className="text-xl font-bold text-fg">Role Based</h2>
              </div>
              <Link href="/interviews" className="text-sm text-brand-bright hover:text-indigo-300 font-medium">
                View all
              </Link>
            </div>

            {roleBased.length > 0 ? (
              <InterviewSection interviews={roleBased.slice(0, 3)} />
            ) : (
              <div className="text-fg-subtle text-sm py-10 text-center surface-card border-dashed">
                No role-based interviews available yet.
              </div>
            )}
          </section>

          {/* Skill Based Interviews */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-violet-500/12 border border-violet-500/20 grid place-items-center">
                  <Sparkles className="w-[18px] h-[18px] text-violet-300" />
                </div>
                <h2 className="text-xl font-bold text-fg">Skill Based</h2>
              </div>
              <Link href="/interviews" className="text-sm text-brand-bright hover:text-indigo-300 font-medium">
                View all
              </Link>
            </div>

            {skillBased.length > 0 ? (
              <InterviewSection interviews={skillBased.slice(0, 3)} />
            ) : (
              <div className="text-fg-subtle text-sm py-10 text-center surface-card border-dashed">
                No skill-based interviews available yet.
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-line py-12 px-6 bg-background">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="grid place-items-center w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600">
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
              </svg>
            </div>
            <span className="text-sm text-fg-muted">FlexYourFit</span>
          </div>
          <div className="flex gap-6 text-sm text-fg-subtle">
            <Link href="/privacy" className="hover:text-fg transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-fg transition-colors">Terms</Link>
            <Link href="/help" className="hover:text-fg transition-colors">Help</Link>
          </div>
          <div className="text-sm text-fg-subtle">© 2026 FlexYourFit</div>
        </div>
      </footer>
    </div>
  );
};

export default DashboardPage;
