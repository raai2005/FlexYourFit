"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/Firebase/client";
import { Loader2, TrendingUp, History, Trophy, ArrowRight, ExternalLink, Search, X } from "lucide-react";
import { getUserPastInterviews, getUserStats } from "@/lib/actions/interview.action";
import DashboardNavbar from "@/app/components/DashboardNavbar";
import Link from "next/link";

const ProfilePage = () => {
  const router = useRouter();
  const [user, loadingUser] = useAuthState(auth);
  const [isLoading, setIsLoading] = useState(true);

  const [interviews, setInterviews] = useState<any[]>([]);
  const [showAllInterviews, setShowAllInterviews] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState({
    totalInterviews: 0,
    averageScore: 0,
    complettionRate: 0,
  });

  useEffect(() => {
    if (!loadingUser && !user) {
      router.push("/sign-in");
    }
  }, [user, loadingUser, router]);

  useEffect(() => {
    const loadProfileData = async () => {
      if (!user) return;

      try {
        const pastInterviews = await getUserPastInterviews(user.uid);

        // Filter only completed interviews
        const completed = (pastInterviews as any[]).filter(
          (i) => i.status === "completed" || i.score !== undefined
        );

        setInterviews(completed);

        // Calculate Stats
        const totalScore = completed.reduce((acc: any, curr: any) => acc + (curr.score || 0), 0);
        const avgScore = completed.length > 0 ? Math.round(totalScore / completed.length) : 0;

        setStats({
          totalInterviews: completed.length,
          averageScore: avgScore,
          complettionRate:
            pastInterviews.length > 0
              ? Math.round((completed.length / pastInterviews.length) * 100)
              : 0,
        });
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadProfileData();
    }
  }, [user]);

  if (loadingUser || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-brand-bright animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNavbar />

      <main className="pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* 1. Profile Header */}
          <div className="flex flex-col md:flex-row items-center gap-8 surface-card p-8">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 grid place-items-center text-3xl font-bold text-white shadow-[0_12px_36px_-10px_rgba(99,102,241,0.6)]">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold text-fg tracking-tight">
                {user?.displayName || "User"}
              </h1>
              <p className="text-fg-muted">{user?.email}</p>
              <p className="text-fg-subtle text-sm mt-1">
                Member since{" "}
                {new Date(user?.metadata.creationTime || Date.now()).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* 2. Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="surface-card p-6 flex items-center gap-4">
              <div className="p-3 bg-brand-soft border border-indigo-500/20 rounded-xl">
                <Trophy className="w-6 h-6 text-brand-bright" />
              </div>
              <div>
                <p className="text-fg-muted text-sm">Interviews Completed</p>
                <h3 className="text-2xl font-bold text-fg">{stats.totalInterviews}</h3>
              </div>
            </div>

            <div className="surface-card p-6 flex items-center gap-4">
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                <TrendingUp className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-fg-muted text-sm">Average Score</p>
                <h3 className="text-2xl font-bold text-fg">{stats.averageScore}/100</h3>
              </div>
            </div>

            <div className="surface-card p-6 flex items-center gap-4">
              <div className="p-3 bg-violet-500/12 border border-violet-500/20 rounded-xl">
                <History className="w-6 h-6 text-violet-300" />
              </div>
              <div>
                <p className="text-fg-muted text-sm">Completion Rate</p>
                <h3 className="text-2xl font-bold text-fg">{stats.complettionRate}%</h3>
              </div>
            </div>
          </div>

          {/* 3. Recent History - Interview Cards */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-fg flex items-center gap-2">
                <History className="w-5 h-5 text-fg-muted" />
                Recent History
              </h2>
              {interviews.length > 4 && !showAllInterviews && (
                <button
                  onClick={() => setShowAllInterviews(true)}
                  className="text-brand-bright hover:text-indigo-300 text-sm font-medium flex items-center gap-1 transition-colors"
                >
                  View All ({interviews.length})
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Search Bar - Only shown in View All mode */}
            {showAllInterviews && (
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-fg-subtle pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search interviews by title, category, or type..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="field pl-12 pr-12"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-fg-subtle hover:text-fg"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
                <button
                  onClick={() => {
                    setShowAllInterviews(false);
                    setSearchQuery("");
                  }}
                  className="mt-3 text-fg-subtle hover:text-fg text-sm flex items-center gap-1 transition-colors"
                >
                  ← Back to recent
                </button>
              </div>
            )}

            {interviews.length === 0 ? (
              <div className="text-center py-12 surface-card border-dashed">
                <p className="text-fg-subtle">No interviews taken yet.</p>
                <Link href="/interviews" className="text-brand-bright hover:text-indigo-300 text-sm mt-2 inline-block">
                  Start your first interview
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {(showAllInterviews
                  ? interviews.filter(
                      (session) =>
                        searchQuery === "" ||
                        session.interviewTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        session.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        session.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        session.difficulty?.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                  : interviews.slice(0, 4)
                ).map((session) => {
                  const difficultyColor = {
                    Easy: "text-emerald-300 bg-emerald-500/10 border-emerald-500/25",
                    Medium: "text-amber-300 bg-amber-500/10 border-amber-500/25",
                    Hard: "text-rose-300 bg-rose-500/10 border-rose-500/25",
                  }[session.difficulty as "Easy" | "Medium" | "Hard"] ||
                    "text-fg-muted bg-surface-2 border-line-strong";

                  const typeLabel = session.type === "skill" ? "Skill Based" : "Role Based";
                  const typeColor =
                    session.type === "skill"
                      ? "text-violet-300 bg-violet-500/10 border-violet-500/25"
                      : "text-indigo-300 bg-indigo-500/10 border-indigo-500/25";

                  return (
                    <div key={session.id} className="group surface-card-interactive p-5 flex flex-col">
                      {/* Header - Type & Difficulty Badges */}
                      <div className="flex flex-wrap items-center gap-1.5 mb-3">
                        <span className={`px-2 py-0.5 rounded-full border text-[10px] font-semibold ${typeColor}`}>
                          {typeLabel}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full border text-[10px] font-semibold ${difficultyColor}`}>
                          {session.difficulty || "Medium"}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-base font-bold text-fg mb-2 group-hover:text-brand-bright transition-colors line-clamp-1">
                        {session.interviewTitle || "Mock Interview"}
                      </h3>

                      {/* Description */}
                      <p className="text-fg-muted text-xs mb-4 flex-grow line-clamp-2">
                        {session.description || "Practice interview session"}
                      </p>

                      {/* Stats Row */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex-1 text-center p-2 bg-surface-2 rounded-lg border border-line">
                          <p className="text-[10px] text-fg-subtle mb-0.5">Attempts</p>
                          <p className="text-sm font-bold text-fg">{session.attempts || 1}</p>
                        </div>
                        <div
                          className={`flex-1 text-center p-2 rounded-lg ${
                            session.score !== undefined
                              ? session.score >= 80
                                ? "bg-emerald-500"
                                : session.score >= 50
                                ? "bg-amber-500"
                                : "bg-red-500"
                              : "bg-surface-2 border border-line"
                          }`}
                        >
                          <p
                            className={`text-[10px] mb-0.5 ${
                              session.score !== undefined
                                ? session.score >= 50 && session.score < 80
                                  ? "text-black/60"
                                  : "text-white/70"
                                : "text-fg-subtle"
                            }`}
                          >
                            Score
                          </p>
                          <p
                            className={`text-sm font-bold ${
                              session.score !== undefined
                                ? session.score >= 50 && session.score < 80
                                  ? "text-black"
                                  : "text-white"
                                : "text-fg-subtle"
                            }`}
                          >
                            {session.score !== undefined ? session.score : "—"}
                          </p>
                        </div>
                      </div>

                      {/* Review Feedback Button */}
                      <Link
                        href={`/interview/${session.interviewId}/feedback`}
                        className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-brand-soft hover:bg-indigo-500/20 border border-indigo-500/20 hover:border-indigo-500/40 rounded-lg text-brand-bright text-sm font-medium transition-all duration-200"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Review Feedback
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}

            {/* No results message for search */}
            {showAllInterviews &&
              searchQuery &&
              interviews.filter(
                (session) =>
                  session.interviewTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  session.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  session.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  session.difficulty?.toLowerCase().includes(searchQuery.toLowerCase())
              ).length === 0 && (
                <div className="text-center py-8 text-fg-subtle">
                  No interviews found matching "{searchQuery}"
                </div>
              )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
