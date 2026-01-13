import React from "react";
import Link from "next/link";

const DashboardNavbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
              <svg
                className="w-5 h-5 text-zinc-900"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
                <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" opacity="0.7" />
              </svg>
            </div>
            <span className="text-lg font-semibold text-white">FlexYourFit</span>
          </Link>
        </div>

        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="text-sm text-white font-medium">
            Dashboard
          </Link>
          <Link
            href="/interviews"
            className="text-sm text-zinc-400 hover:text-white transition-colors"
          >
            Interviews
          </Link>
          <Link
            href="/questions"
            className="text-sm text-zinc-400 hover:text-white transition-colors"
          >
            Questions
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 pl-2 pr-4 py-1.5 rounded-full border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 hover:border-zinc-700 transition-all">
            <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-xs font-bold text-white">
              JD
            </div>
            <span className="text-sm text-zinc-300">John Doe</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavbar;
