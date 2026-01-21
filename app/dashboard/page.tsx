  /* Dashboard is now a Server Component */
  import React from "react";
  import Link from "next/link";
  import Image from "next/image";
  import DashboardNavbar from "../components/DashboardNavbar";
  import InterviewSection from "../components/InterviewSection";
  import UserStats from "../components/UserStats";
  import { getInterviews } from "@/lib/actions/interview.action";

  const DashboardPage = async () => {
    // Fetch data on the server
    const interviews = await getInterviews();

    return (
      <div className="min-h-screen bg-zinc-950">
        <DashboardNavbar />
  
        <main className="pt-24 pb-12 px-6">
          <div className="max-w-7xl mx-auto space-y-12">
            {/* Welcome Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Welcome to FlexYourFit
                </h1>
                <p className="text-zinc-400">
                  Ready to ace your next technical interview?
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                 <UserStats />
              </div>
            </div>
  
            {/* CTA Section */}
            <section className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                <div className="max-w-xl text-left">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                    Ready to Ace Your Next Interview?
                  </h2>
                  <p className="text-zinc-400 mb-8 text-lg leading-relaxed">
                    Access over 500+ AI-driven mock interviews, get instant feedback, and confidently land your dream job.
                  </p>
                  <Link
                    href="/interviews"
                    className="inline-flex px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 shadow-lg shadow-emerald-500/20"
                  >
                    Start Practicing Now
                  </Link>
                </div>
                
                <div 
                  className="hidden md:block relative w-96 h-96 -my-12 -mr-12"
                  style={{ 
                    maskImage: 'linear-gradient(to right, transparent, black 20%)',
                    WebkitMaskImage: 'linear-gradient(to right, transparent, black 20%)'
                  }}
                >
                   <Image
                      src="/assets/code-cta-matched.png"
                      alt="Coding Interface"
                      fill
                      className="object-contain"
                   />
                </div>
              </div>
            </section>
  
            {/* Role Based Interviews */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-white">Role Based</h2>
                </div>
                <Link
                  href="/interviews"
                  className="text-sm text-emerald-500 hover:text-emerald-400 font-medium"
                >
                  View all
                </Link>
              </div>
  
              {interviews.filter(i => i.type === "role").length > 0 ? (
                <InterviewSection interviews={interviews.filter(i => i.type === "role").slice(0, 3)} />
              ) : (
                <div className="text-zinc-500 text-sm py-8 text-center bg-zinc-900/50 rounded-xl border border-zinc-800 border-dashed">
                    No role-based interviews available yet.
                </div>
              )}
            </section>

            {/* Skill Based Interviews */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-white">Skill Based</h2>
                </div>
                <Link
                  href="/interviews"
                  className="text-sm text-emerald-500 hover:text-emerald-400 font-medium"
                >
                  View all
                </Link>
              </div>
  
              {interviews.filter(i => i.type === "skill").length > 0 ? (
                <InterviewSection interviews={interviews.filter(i => i.type === "skill").slice(0, 3)} />
              ) : (
                <div className="text-zinc-500 text-sm py-8 text-center bg-zinc-900/50 rounded-xl border border-zinc-800 border-dashed">
                    No skill-based interviews available yet.
                </div>
              )}
            </section>
          </div>
        </main>
  
        {/* Footer */}
        <footer className="border-t border-zinc-800/50 py-12 px-6 bg-zinc-950">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-zinc-800 flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-emerald-500"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
                </svg>
              </div>
              <span className="text-sm text-zinc-400">FlexYourFit</span>
            </div>
            <div className="flex gap-6 text-sm text-zinc-500">
              <Link href="/privacy" className="hover:text-zinc-300">Privacy</Link>
              <Link href="/terms" className="hover:text-zinc-300">Terms</Link>
              <Link href="/help" className="hover:text-zinc-300">Help</Link>
            </div>
            <div className="text-sm text-zinc-600">
              © 2026 FlexYourFit
            </div>
          </div>
        </footer>
      </div>
    );
  };
  
  export default DashboardPage;
