"use client";

import React, { useEffect, useState } from "react";
import { auth } from "@/Firebase/client";
import { onAuthStateChanged } from "firebase/auth";
import { getUserStats } from "@/lib/actions/interview.action";

const UserStats = () => {
  const [completedCount, setCompletedCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const stats = await getUserStats(user.uid);
          setCompletedCount(stats.completedInterviews || 0);
        } catch (error) {
          console.error("Error fetching user stats:", error);
        } finally {
            setLoading(false);
        }
      } else {
          setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
      return (
        <div className="flex items-center gap-4 animate-pulse">
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-center w-24 h-16"></div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-center w-24 h-16"></div>
        </div>
      )
  }

  return (
    <div className="flex items-center gap-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-center min-w-[100px]">
        <div className="text-2xl font-bold text-white transition-all duration-500">
            {completedCount}
        </div>
        <div className="text-xs text-zinc-500">Completed</div>
      </div>
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-center min-w-[100px]">
        <div className="text-2xl font-bold text-emerald-500">
            {completedCount > 0 ? "85%" : "0%"}
        </div>
        <div className="text-xs text-zinc-500">Avg Score</div>
      </div>
    </div>
  );
};

export default UserStats;
