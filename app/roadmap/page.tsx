"use client";

import React, { useState } from "react";
import DashboardNavbar from "../components/DashboardNavbar";
import { Loader2, Sparkles, Map, ChevronRight, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

import { generateRoadmap, RoadmapResponse } from "@/lib/actions/gemini";

const RoadmapPage = () => {
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState<RoadmapResponse | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role.trim()) return;

    setLoading(true);
    setRoadmap(null);
    
    try {
        const result = await generateRoadmap(role);
        
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
    <div className="min-h-screen bg-zinc-950">
      <DashboardNavbar />

      <main className="pt-24 pb-12 px-6">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent mb-4">
              AI Career Roadmap
            </h1>
            <p className="text-zinc-400 text-lg">
              Generate a personalized step-by-step guide to ace your next interview for any role.
            </p>
          </div>

          {/* Input Section */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 mb-12 shadow-xl shadow-blue-500/5">
            <form onSubmit={handleGenerate} className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Enter your target role (e.g. Senior React Developer, DevOps Engineer)..."
                className="flex-1 px-6 py-4 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-lg"
              />
              <button
                type="submit"
                disabled={loading || !role.trim()}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[200px]"
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
                    <Map className="w-6 h-6 text-blue-400" />
                    <h2 className="text-2xl font-bold text-white">Your Path to Becoming a {roadmap.role}</h2>
                </div>

                <div className="relative space-y-8 pl-8 border-l-2 border-zinc-800 ml-4">
                    {roadmap.steps.map((step: any, index: number) => (
                        <div key={index} className="relative group">
                            {/* Connector Node */}
                            <div className="absolute -left-[41px] top-0 w-6 h-6 rounded-full bg-zinc-900 border-2 border-blue-500/50 group-hover:border-blue-400 group-hover:scale-110 transition-all flex items-center justify-center z-10">
                                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            </div>

                            <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-6 hover:bg-zinc-900 hover:border-zinc-700 transition-all">
                                <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                                    <span className="text-blue-400">Step {index + 1}:</span> {step.title}
                                </h3>
                                <p className="text-zinc-400 mb-4">{step.description}</p>
                                
                                <div className="flex flex-wrap gap-2">
                                    {step.topics.map((topic: string, i: number) => (
                                        <span key={i} className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm border border-blue-500/20 flex items-center gap-1">
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
                           <CheckCircle2 className="w-4 h-4 text-zinc-900" />
                        </div>
                        <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl p-6">
                            <h3 className="text-xl font-bold text-emerald-400 mb-2">Goal Achieved! 🚀</h3>
                            <p className="text-zinc-400">You are ready to ace your {roadmap.role} interview.</p>
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
