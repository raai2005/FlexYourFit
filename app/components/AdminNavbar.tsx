"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import { BarChart3, LayoutGrid, Plus } from "lucide-react";
import { adminLogout } from "@/lib/actions/admin";

const AdminNavbarContent = () => {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "dashboard";

  useEffect(() => {
    // If we are on dashboard routes, we are logged in (protected by middleware)
    if (pathname.includes("/admin") && !pathname.includes("/login")) {
      setUser({ displayName: "Admin" });
    } else {
      setUser(null);
    }
  }, [pathname]);

  const handleSignOut = async () => {
    await adminLogout();
    router.push("/admin/login");
  };

  const NavItem = ({ tab, label, icon: Icon }: { tab: string; label: string; icon: any }) => {
    const isActive = currentTab === tab;
    return (
      <Link
        href={`/admin/dashboard?tab=${tab}`}
        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
          isActive
            ? "bg-surface-3 text-fg ring-1 ring-line-strong"
            : "text-fg-muted hover:text-fg hover:bg-surface-2"
        }`}
      >
        <Icon className={`w-4 h-4 ${isActive ? "text-red-400" : ""}`} />
        {label}
      </Link>
    );
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-line bg-background shadow-[0_4px_24px_-16px_rgba(0,0,0,0.8)]">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between relative">
        <div className="flex items-center gap-8">
          <Link href={user ? "/admin/dashboard" : "/admin/login"} className="flex items-center gap-2.5">
            <div className="grid place-items-center w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 shadow-[0_6px_20px_-6px_rgba(239,68,68,0.6)]">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
                <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" opacity="0.7" />
              </svg>
            </div>
            <span className="text-lg font-bold tracking-tight text-fg hidden md:block">
              FlexYourFit Admin
            </span>
          </Link>
        </div>

        {/* Navigation Tabs (Centered) */}
        {user && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center gap-1 bg-surface-2 p-1 rounded-full border border-line">
            <NavItem tab="dashboard" label="Dashboard" icon={BarChart3} />
            <NavItem tab="manage" label="Manage" icon={LayoutGrid} />
            <NavItem tab="create" label="Add New" icon={Plus} />
          </div>
        )}

        <div className="flex items-center gap-4">
          {user && (
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 pl-2 pr-4 py-1.5 rounded-full border border-line bg-surface-2 hover:bg-surface-3 hover:border-line-strong transition-all"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-red-500 to-rose-600 grid place-items-center text-xs font-bold text-white">
                A
              </div>
              <span className="text-sm text-fg-muted">Logout</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

const AdminNavbar = () => {
  return (
    <React.Suspense fallback={<div className="h-16 bg-background border-b border-line" />}>
      <AdminNavbarContent />
    </React.Suspense>
  );
};

export default AdminNavbar;
