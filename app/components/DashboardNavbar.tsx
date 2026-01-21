"use client";

import React, { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/Firebase/client";
  import { useRouter, usePathname } from "next/navigation";
  import Link from "next/link";

const DashboardNavbar = () => {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
      await signOut(auth);
      router.push("/sign-in");
  }
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
          <Link 
            href="/dashboard" 
            className={`text-sm transition-colors ${pathname === '/dashboard' ? 'text-white font-bold' : 'text-zinc-400 hover:text-white'}`}
          >
            Dashboard
          </Link>
          <Link
            href="/interviews"
            className={`text-sm transition-colors ${pathname === '/interviews' ? 'text-white font-bold' : 'text-zinc-400 hover:text-white'}`}
          >
            Interviews
          </Link>
          <Link
            href="/questions"
            className={`text-sm transition-colors ${pathname === '/questions' ? 'text-white font-bold' : 'text-zinc-400 hover:text-white'}`}
          >
            Questions
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={handleSignOut} 
            className="flex items-center justify-center w-10 h-10 rounded-full border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 hover:border-zinc-700 transition-all text-zinc-400 hover:text-red-500"
            title="Logout"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth={1.5} 
              stroke="currentColor" 
              className="w-5 h-5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavbar;
