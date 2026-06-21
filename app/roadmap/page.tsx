"use client";

import React, { useState } from "react";
import DashboardNavbar from "../components/DashboardNavbar";
import { Loader2, Sparkles, Map, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

import { generateRoadmap, RoadmapResponse } from "@/lib/actions/gemini";

const RoadmapPage = () => {
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState<RoadmapResponse | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = role.trim();
    // Basic validation: at least 3 chars, at least one letter, not just gibberish
    if (!trimmed || trimmed.length < 3 || !/[a-zA-Z]/.test(trimmed)) {
      toast.error("Please enter a valid job role, skill, or tech stack.");
      return;
    }

    setLoading(true);
    setRoadmap(null);
    try {
      const result = await generateRoadmap(trimmed);
      if (result.success && result.data) {
        setRoadmap(result.data);
        toast.success("Roadmap generated successfully!");
      } else {
        toast.error(result.message || "Failed to generate roadmap.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardNavbar />

      <main className="pt-24 pb-12 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <span className="chip chip-brand mb-4">AI Powered</span>
            <h1 className="text-4xl md:text-5xl font-bold text-gradient-brand mb-4 tracking-tight">
              AI Career Roadmap
            </h1>
            <p className="text-fg-muted text-lg max-w-2xl mx-auto">
              Generate a personalized step-by-step guide to ace your next interview for any role.
            </p>
          </div>

          {/* Input Section */}
          <div className="surface-card p-8 mb-12">
            <form onSubmit={handleGenerate} className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Enter a job role, skill, or tech stack (e.g. Full Stack Dev, Python, System Design)..."
                className="field flex-1 h-14 text-base"
              />
              <button
                type="submit"
                disabled={loading || !role.trim()}
                className="btn btn-primary h-14 px-8 text-base min-w-[200px]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Plan
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Roadmap Display */}
          {roadmap && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="flex items-center gap-3 mb-8">
                <Map className="w-6 h-6 text-brand-bright" />
                <h2 className="text-2xl font-bold text-fg">
                  Your Path to Becoming a {roadmap.role}
                </h2>
              </div>

              <div className="relative space-y-6 pl-8 border-l-2 border-line-strong ml-4">
                {roadmap.steps.map((step: any, index: number) => (
                  <div key={index} className="relative group">
                    {/* Connector Node */}
                    <div className="absolute -left-[41px] top-0 w-6 h-6 rounded-full bg-surface border-2 border-indigo-500/50 group-hover:border-brand group-hover:scale-110 transition-all flex items-center justify-center z-10">
                      <div className="w-2 h-2 rounded-full bg-brand" />
                    </div>

                    <div className="surface-card-interactive p-6">
                      <h3 className="text-xl font-bold text-fg mb-2 flex items-center gap-2">
                        <span className="text-brand-bright">Step {index + 1}:</span> {step.title}
                      </h3>
                      <p className="text-fg-muted mb-4 leading-relaxed">{step.description}</p>

                      <div className="flex flex-wrap gap-2">
                        {step.topics.map((topic: string, i: number) => (
                          <span
                            key={i}
                            className="px-3 py-1 rounded-full bg-brand-soft text-brand-bright text-sm border border-indigo-500/20 flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Final Success Node */}
                <div className="relative">
                  <div className="absolute -left-[41px] top-0 w-6 h-6 rounded-full bg-emerald-500 border-2 border-emerald-400 flex items-center justify-center z-10 shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                    <CheckCircle2 className="w-4 h-4 text-zinc-950" />
                  </div>
                  <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-emerald-300 mb-2">Goal Achieved! 🚀</h3>
                    <p className="text-fg-muted">You are ready to ace your {roadmap.role} interview.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default RoadmapPage;
