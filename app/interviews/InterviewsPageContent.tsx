"use client";

import React, { useState } from "react";
import DashboardNavbar from "../components/DashboardNavbar";
import InterviewSection from "../components/InterviewSection";
import { Search, Briefcase, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { FireStoreInterview } from "@/lib/actions/interview.action";

interface InterviewsPageProps {
  initialInterviews: FireStoreInterview[];
}

const InterviewsPageContent = ({ initialInterviews }: InterviewsPageProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredInterviews = initialInterviews.filter((interview) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      interview.title.toLowerCase().includes(searchLower) ||
      interview.category.toLowerCase().includes(searchLower) ||
      interview.description.toLowerCase().includes(searchLower)
    );
  });

  // Split interviews by type
  const roleBasedInterviews = filteredInterviews.filter(
    (interview) => interview.type === "role"
  );
  const skillBasedInterviews = filteredInterviews.filter(
    (interview) => interview.type === "skill"
  );

  const noResults = filteredInterviews.length === 0;

  return (
    <div className="min-h-screen bg-background">
      <DashboardNavbar />

      <main className="pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto space-y-10">
          {/* Header & Search */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-fg mb-2 tracking-tight">All Interviews</h1>
              <p className="text-fg-muted">Browse our collection of mock interviews</p>
            </div>

            <div className="relative w-full md:w-96">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-fg-subtle pointer-events-none" />
              <Input
                placeholder="Search by role, category or keywords..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* No Results */}
          {noResults && (
            <div className="text-center py-20 surface-card border-dashed">
              <div className="w-16 h-16 bg-surface-2 rounded-full grid place-items-center mx-auto mb-4 border border-line">
                <Search className="w-6 h-6 text-fg-subtle" />
              </div>
              <h3 className="text-xl font-semibold text-fg mb-2">No interviews found</h3>
              <p className="text-fg-subtle max-w-sm mx-auto">
                {initialInterviews.length === 0
                  ? "There are currently no interviews available. Please check back later."
                  : `We couldn't find any interviews matching "${searchTerm}". Try checking for typos or using different keywords.`}
              </p>
            </div>
          )}

          {/* Role Based Interviews Section */}
          {roleBasedInterviews.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-brand-soft border border-indigo-500/20 grid place-items-center">
                  <Briefcase className="w-5 h-5 text-brand-bright" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-fg">Role Based</h2>
                  <p className="text-sm text-fg-subtle">Prepare for specific job roles</p>
                </div>
              </div>
              <InterviewSection interviews={roleBasedInterviews} />
            </section>
          )}

          {/* Skill Based Interviews Section */}
          {skillBasedInterviews.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-violet-500/12 border border-violet-500/20 grid place-items-center">
                  <Sparkles className="w-5 h-5 text-violet-300" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-fg">Skill Based</h2>
                  <p className="text-sm text-fg-subtle">Master specific technical skills</p>
                </div>
              </div>
              <InterviewSection interviews={skillBasedInterviews} />
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default InterviewsPageContent;
