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
      <div className="flex items-center gap-3 animate-pulse">
        <div className="surface-card px-4 py-2 w-28 h-[68px]" />
        <div className="surface-card px-4 py-2 w-28 h-[68px]" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="surface-card px-5 py-3 text-center min-w-[112px]">
        <div className="text-2xl font-bold text-fg">{completedCount}</div>
        <div className="text-xs text-fg-subtle mt-0.5">Completed</div>
      </div>
      <div className="surface-card px-5 py-3 text-center min-w-[112px]">
        <div className="text-2xl font-bold text-success-bright">
          {completedCount > 0 ? "85%" : "0%"}
        </div>
        <div className="text-xs text-fg-subtle mt-0.5">Avg Score</div>
      </div>
    </div>
  );
};

export default UserStats;
