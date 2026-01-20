  /* Dashboard is now a Server Component */
  import React from "react";
  import Link from "next/link";
  import Image from "next/image";
  import DashboardNavbar from "../components/DashboardNavbar";
  import InterviewSection from "../components/InterviewSection";
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
                 <div className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-center">
                    <div className="text-2xl font-bold text-white">0</div>
                    <div className="text-xs text-zinc-500">Completed</div>
                 </div>
                 <div className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-center">
                    <div className="text-2xl font-bold text-emerald-500">0%</div>
                    <div className="text-xs text-zinc-500">Avg Score</div>
                 </div>
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
  
            {/* Featured Interviews */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">
                  Featured Interviews
                </h2>
                <Link
                  href="/interviews"
                  className="text-sm text-emerald-500 hover:text-emerald-400 font-medium"
                >
                  View all
                </Link>
              </div>
  
              {interviews.length > 0 ? (
                <InterviewSection interviews={interviews.slice(0, 3)} />
              ) : (
                <div className="text-zinc-500 text-sm py-8 text-center bg-zinc-900/50 rounded-xl border border-zinc-800 border-dashed">
                    No interviews available at the moment.
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
