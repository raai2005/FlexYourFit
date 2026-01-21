"use client";

import React, { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/Firebase/client";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { BarChart3, LayoutGrid, Plus } from "lucide-react";

const AdminNavbar = () => {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "dashboard";

  useEffect(() => {
    // Check on mount and when pathname changes (e.g. after login/logout)
    const checkAuth = () => {
        const isAdmin = localStorage.getItem("isAdmin");
        if(isAdmin === "true"){
            setUser({ displayName: "Admin" });
        } else {
             if(!auth.currentUser) {
                 setUser(null);
             }
        }
    };
    
    checkAuth();
    
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      // Prioritize admin session if active
      if (!localStorage.getItem("isAdmin")) {
        setUser(currentUser);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
      localStorage.removeItem("isAdmin");
      await signOut(auth);
      router.push("/admin/login");
  }

  const NavItem = ({ tab, label, icon: Icon }: { tab: string; label: string; icon: any }) => {
      const isActive = currentTab === tab;
      return (
        <Link 
            href={`/admin/dashboard?tab=${tab}`} 
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                isActive 
                ? "bg-zinc-800 text-white shadow-sm ring-1 ring-zinc-700" 
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
            }`}
        >
            <Icon className={`w-4 h-4 ${isActive ? "text-emerald-400" : ""}`} />
            {label}
        </Link>
      )
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between relative">
        <div className="flex items-center gap-8">
            <Link href={user ? "/admin/dashboard" : "/admin/login"} className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
                  <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" opacity="0.7" />
                </svg>
              </div>
              <span className="text-lg font-semibold text-white hidden md:block">FlexYourFit Admin</span>
            </Link>
        </div>

        {/* Navigation Tabs (Centered) */}
        {user && (
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center gap-1 bg-zinc-900/50 p-1 rounded-full border border-zinc-800/50">
                <NavItem tab="dashboard" label="Dashboard" icon={BarChart3} />
                <NavItem tab="manage" label="Manage" icon={LayoutGrid} />
                <NavItem tab="create" label="Add New" icon={Plus} />
            </div>
        )}

        <div className="flex items-center gap-4">
          {user && (
             <button onClick={handleSignOut} className="flex items-center gap-2 pl-2 pr-4 py-1.5 rounded-full border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 hover:border-zinc-700 transition-all">
             <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-xs font-bold text-white">
               A
             </div>
             <span className="text-sm text-zinc-300">
                 Logout
             </span>
           </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
