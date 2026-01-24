"use client";

import React, { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/Firebase/client";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { User as UserIcon, LogOut } from "lucide-react";

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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
            href="/roadmap"
            className={`text-sm transition-colors ${pathname === '/roadmap' ? 'text-white font-bold' : 'text-zinc-400 hover:text-white'}`}
          >
            Roadmap
          </Link>
        </div>

        <div className="flex items-center gap-4" ref={menuRef}>
            <div className="relative">
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:bg-zinc-800 transition-colors"
                >
                   <UserIcon className="w-5 h-5 text-zinc-400" />
                </button>

                {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-xl py-2 shadow-xl animate-in fade-in zoom-in-95 duration-200">
                        <div className="px-4 py-2 border-b border-zinc-800 mb-2">
                            <p className="text-sm font-medium text-white truncate">
                                {user?.email || "User"}
                            </p>
                        </div>
                        
                        <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-colors">
                            <UserIcon className="w-4 h-4" />
                            Profile
                        </button>
                        
                        <button 
                            onClick={handleSignOut}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            Log Out
                        </button>
                    </div>
                )}
            </div>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavbar;
