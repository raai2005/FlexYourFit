"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/Firebase/client";
import { Loader2, TrendingUp, Clock, History, Trophy, ArrowRight, ExternalLink } from "lucide-react";
import { getUserPastInterviews, getUserStats } from "@/lib/actions/interview.action";
import DashboardNavbar from "@/app/components/DashboardNavbar";
import Link from "next/link";
import GaugeChart from "react-gauge-chart";

const ProfilePage = () => {
  const router = useRouter();
  const [user, loadingUser] = useAuthState(auth);
  const [isLoading, setIsLoading] = useState(true);
  
  const [interviews, setInterviews] = useState<any[]>([]);
  const [stats, setStats] = useState({
      totalInterviews: 0,
      averageScore: 0,
      complettionRate: 0
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
            const completed = (pastInterviews as any[]).filter(i => i.status === "completed" || i.score !== undefined);
            
            setInterviews(completed);

            // Calculate Stats
            const totalScore = completed.reduce((acc: any, curr: any) => acc + (curr.score || 0), 0);
            const avgScore = completed.length > 0 ? Math.round(totalScore / completed.length) : 0;
            
            setStats({
                totalInterviews: completed.length,
                averageScore: avgScore,
                complettionRate: pastInterviews.length > 0 ? Math.round((completed.length / pastInterviews.length) * 100) : 0
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
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
            <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950">
        <DashboardNavbar />
        
        <main className="pt-24 pb-12 px-6">
            <div className="max-w-5xl mx-auto space-y-12">
                
                {/* 1. Profile Header */}
                <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-emerald-500/20">
                        {user?.email?.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-center md:text-left">
                        <h1 className="text-3xl font-bold text-white">{user?.displayName || "User"}</h1>
                        <p className="text-zinc-400">{user?.email}</p>
                        <p className="text-zinc-500 text-sm mt-1">Member since {new Date(user?.metadata.creationTime || Date.now()).toLocaleDateString()}</p>
                    </div>
                </div>

                {/* 2. Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Total Interviews */}
                    <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex items-center gap-4">
                        <div className="p-3 bg-blue-500/10 rounded-xl">
                            <Trophy className="w-6 h-6 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-zinc-400 text-sm">Interviews Completed</p>
                            <h3 className="text-2xl font-bold text-white">{stats.totalInterviews}</h3>
                        </div>
                    </div>

                    {/* Average Score */}
                    <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex items-center gap-4">
                        <div className="p-3 bg-emerald-500/10 rounded-xl">
                            <TrendingUp className="w-6 h-6 text-emerald-500" />
                        </div>
                        <div>
                            <p className="text-zinc-400 text-sm">Average Score</p>
                            <h3 className="text-2xl font-bold text-white">{stats.averageScore}/100</h3>
                        </div>
                    </div>

                     {/* Completion Rate */}
                     <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex items-center gap-4">
                        <div className="p-3 bg-purple-500/10 rounded-xl">
                            <History className="w-6 h-6 text-purple-500" />
                        </div>
                        <div>
                            <p className="text-zinc-400 text-sm">Completion Rate</p>
                            <h3 className="text-2xl font-bold text-white">{stats.complettionRate}%</h3>
                        </div>
                    </div>
                </div>

                {/* 3. History List */}
                <section>
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <History className="w-5 h-5 text-zinc-400" />
                        Recent History
                    </h2>

                    <div className="space-y-4">
                        {interviews.length === 0 ? (
                            <div className="text-center py-12 bg-zinc-900/50 rounded-2xl border border-zinc-800 border-dashed">
                                <p className="text-zinc-500">No interviews taken yet.</p>
                                <Link href="/interviews" className="text-emerald-500 hover:text-emerald-400 text-sm mt-2 inline-block">
                                    Start your first interview
                                </Link>
                            </div>
                        ) : (
                            interviews.map((session) => (
                                <div key={session.id} className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="font-semibold text-white">{session.interviewTitle || "Mock Interview"}</h3>
                                            <span className="text-[10px] px-2 py-0.5 rounded-full border bg-emerald-500/10 border-emerald-500/20 text-emerald-500">
                                                Completed
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-zinc-400">
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {new Date(session.startedAt).toLocaleDateString()}
                                            </span>
                                            <span>•</span>
                                            <span>Difficulty: {session.difficulty}</span>
                                        </div>
                                    </div>

                                    {session.score !== undefined && (
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <p className="text-xs text-zinc-500">Score</p>
                                                <p className={`text-xl font-bold ${
                                                    session.score >= 80 ? 'text-emerald-500' : 
                                                    session.score >= 60 ? 'text-yellow-500' : 'text-red-500'
                                                }`}>
                                                    {session.score}
                                                </p>
                                            </div>
                                            <Link 
                                                href={`/interview/${session.interviewId}/feedback`}
                                                className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors text-white"
                                                title="View Detailed Feedback"
                                            >
                                                <ArrowRight className="w-5 h-5" />
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </section>

            </div>
        </main>
    </div>
  );
};

export default ProfilePage;
