"use client";

import React, { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/Firebase/client";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { User as UserIcon, LogOut } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/interviews", label: "Interviews" },
  { href: "/roadmap", label: "Roadmap" },
];

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
  };
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
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-line bg-background shadow-[0_4px_24px_-16px_rgba(0,0,0,0.8)]">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="grid place-items-center w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-[0_6px_20px_-6px_rgba(99,102,241,0.6)] group-hover:scale-105 transition-transform">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
                <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" opacity="0.7" />
              </svg>
            </div>
            <span className="text-lg font-bold tracking-tight text-fg hidden sm:block">
              FlexYourFit
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium px-3.5 py-2 rounded-lg transition-colors ${
                  active
                    ? "text-fg bg-surface-2"
                    : "text-fg-muted hover:text-fg hover:bg-surface-2"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-4">
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="w-10 h-10 rounded-full bg-surface-2 border border-line grid place-items-center text-fg-muted hover:text-fg hover:bg-surface-3 hover:border-line-strong transition-colors"
            >
              <UserIcon className="w-5 h-5" />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-surface-2 border border-line rounded-xl py-2 shadow-[var(--shadow-lg)] animate-in fade-in zoom-in-95 duration-200">
                <div className="px-4 py-2 border-b border-line mb-2">
                  <p className="text-sm font-medium text-fg truncate">
                    {user?.email || "User"}
                  </p>
                </div>

                {/* Mobile Navigation Links */}
                <div className="md:hidden border-b border-line mb-2 pb-2">
                  {navItems.map((item) => {
                    const active = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMenuOpen(false)}
                        className={`block px-4 py-2 text-sm ${
                          active
                            ? "text-fg bg-surface-3"
                            : "text-fg-muted hover:text-fg hover:bg-surface-3/60"
                        }`}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </div>

                <Link
                  href="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-fg-muted hover:text-fg hover:bg-surface-3 transition-colors"
                >
                  <UserIcon className="w-4 h-4" />
                  Profile
                </Link>

                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-danger-bright hover:bg-red-500/10 transition-colors"
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
