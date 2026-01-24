"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, CheckCircle, AlertCircle, Save, Home, Lightbulb, Share2 } from "lucide-react";
import GaugeChart from "react-gauge-chart";
import { toast } from "sonner";

import { getInterviewById, getUserInterviewSession, saveDetailedFeedback } from "@/lib/actions/interview.action";
import { generateInterviewFeedback, FeedbackResponse } from "@/lib/actions/gemini";
import { FireStoreInterview } from "@/lib/actions/interview.action";
import { auth } from "@/Firebase/client";
import DashboardNavbar from "@/app/components/DashboardNavbar";

// Helper for typewriter effect or just fading in
import { useAuthState } from "react-firebase-hooks/auth";

const FeedbackPage = () => {
  const params = useParams();
  const router = useRouter();
  const [user, loadingUser] = useAuthState(auth);

  const [interview, setInterview] = useState<FireStoreInterview | null>(null);
  const [session, setSession] = useState<any>(null);
  const [feedbackData, setFeedbackData] = useState<FeedbackResponse | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (!loadingUser && !user) {
        router.push("/sign-in");
    }
  }, [user, loadingUser, router]);

  useEffect(() => {
    const fetchData = async () => {
        if (!user || !params.interviewId) return;

        try {
            const [interviewData, sessionData] = await Promise.all([
                getInterviewById(params.interviewId as string),
                getUserInterviewSession(user.uid, params.interviewId as string)
            ]);
            if (!interviewData) {
                toast.error("Interview not found");
                router.push("/dashboard");
                return;
            }

            setInterview(interviewData);
            setSession(sessionData);

            // Cast to any to avoid TS errors
            const session = sessionData as any;

            if (session?.score !== undefined && session?.feedback) {
                setFeedbackData({
                    score: session.score,
                    feedback: session.feedback,
                    good_parts: session.good_parts || [],
                    improvements: session.improvements || [],
                    motivation: session.motivation || ""
                });
                setIsSaved(true);
            } else if (session?.transcript) {
                setIsGenerating(true);
                const transcriptText = session.transcript.map((t: any) => `${t.role}: ${t.content}`).join("\n");
                
                const result = await generateInterviewFeedback(transcriptText, interviewData.title, interviewData.syllabus);
                
                if (result.success && result.data) {
                    setFeedbackData(result.data);
                } else {
                    toast.error("Failed to generate feedback: " + result.message);
                }
                setIsGenerating(false);
            } else {
                // Handle no transcript case
            }

        } catch (error) {
            console.error(error);
            toast.error("Something went wrong loading your results.");
        } finally {
            setIsLoading(false);
        }
    };

    if (user) {
        fetchData();
    }
  }, [user, params.interviewId, router]);

  const handleSave = async () => {
    if (!user || !session || !feedbackData || isSaved) return;

    setIsSaving(true);
    try {
        const result = await saveDetailedFeedback(user.uid, params.interviewId as string, {
            score: feedbackData.score,
            feedback: feedbackData.feedback,
            good_parts: feedbackData.good_parts,
            improvements: feedbackData.improvements,
            motivation: feedbackData.motivation
        });

        if (result.success) {
            toast.success("Feedback saved successfully!");
            setIsSaved(true);
        } else {
            toast.error("Failed to save feedback.");
        }
    } catch (error) {
        toast.error("Error saving feedback");
    } finally {
        setIsSaving(false);
    }
  };

  if (isLoading || loadingUser) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
        <p className="ml-3 text-zinc-400">Loading your results...</p>
      </div>
    );
  }

  if (isGenerating) {
    return (
        <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center space-y-6">
            <div className="relative">
                <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full animate-pulse" />
                <Loader2 className="w-16 h-16 text-emerald-500 animate-spin relative z-10" />
            </div>
            <h2 className="text-2xl font-bold text-white">Analyzing Your Interview...</h2>
            <p className="text-zinc-400 max-w-md text-center">
                Our AI is reviewing your answers, evaluating your technical accuracy, and generating a personalized roadmap for improvement.
            </p>
        </div>
    );
  }

  if (!feedbackData || !interview) {
      return (
        <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-4">
            <AlertCircle className="w-10 h-10 text-red-500" />
            <h2 className="text-xl font-bold text-white">Unable to Load Feedback</h2>
            <p className="text-zinc-400">We couldn't generate or find your feedback details.</p>
            <button 
                onClick={() => router.push('/dashboard')}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-medium transition-colors"
            >
                Return to Dashboard
            </button>
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-zinc-950">
        <DashboardNavbar />
        
        <main className="pt-24 pb-32 px-6">
            <div className="max-w-5xl mx-auto space-y-8">
                
                {/* 1. Header Details */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="px-3 py-1 bg-zinc-800 rounded-full text-xs font-medium text-zinc-400 border border-zinc-700">
                                {interview.type === 'role' ? 'Role Based' : 'Skill Based'}
                            </span>
                            <span className="px-3 py-1 bg-zinc-800 rounded-full text-xs font-medium text-zinc-400 border border-zinc-700">
                                {interview.difficulty}
                            </span>
                        </div>
                        <h1 className="text-3xl font-bold text-white">{interview.title} Interview Report</h1>
                        <p className="text-zinc-400 text-sm mt-1">Completed on {new Date().toLocaleDateString()}</p>
                    </div>

                    <div className="flex gap-3">
                        <button 
                            onClick={() => router.push('/dashboard')}
                            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                        >
                            <Home className="w-4 h-4" />
                            Dashboard
                        </button>
                    </div>
                </div>

                {/* Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    
                    {/* 2. Speedometer Score (Left Col) */}
                    <div className="col-span-1 bg-zinc-900 border border-zinc-800 rounded-3xl p-6 flex flex-col items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent" />
                        
                        <h3 className="text-lg font-semibold text-zinc-300 mb-6 z-10">Overall Score</h3>
                        
                        <div className="w-full text-center z-10 -mb-8">
                            <GaugeChart 
                                id="gauge-chart1" 
                                nrOfLevels={3} 
                                colors={["#ef4444", "#f59e0b", "#10b981"]} 
                                arcWidth={0.3} 
                                percent={feedbackData.score / 100} 
                                textColor="#FFF"
                                hideText={true} // We'll render custom text
                            />
                        </div>
                        <div className="text-center z-10 mt-4">
                            <span className="text-5xl font-bold text-white tracking-tight">{feedbackData.score}</span>
                            <span className="text-xl text-zinc-500">/100</span>
                        </div>

                        {/* 5. Motivation (Immediately below score) */}
                        <div className="mt-8 p-4 bg-zinc-950/50 rounded-xl border border-zinc-800/50 text-center relative max-w-[250px]">
                            <Lightbulb className="w-5 h-5 text-yellow-500 absolute -top-2.5 left-1/2 -translate-x-1/2 bg-zinc-900 rounded-full px-1" />
                            <p className="text-sm font-medium text-zinc-300 italic">"{feedbackData.motivation}"</p>
                        </div>
                    </div>

                    {/* Right Col: Details */}
                    <div className="col-span-1 md:col-span-2 space-y-6">
                        
                        {/* Summary */}
                        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                                <span className="w-1 h-6 bg-blue-500 rounded-full"/>
                                Executive Summary
                            </h3>
                            <p className="text-zinc-300 leading-relaxed">
                                {feedbackData.feedback}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            
                            {/* 3. Good Parts */}
                            <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-6">
                                <h3 className="text-lg font-semibold text-emerald-400 mb-4 flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5" />
                                    Strengths
                                </h3>
                                <ul className="space-y-3">
                                    {feedbackData.good_parts.map((item, i) => (
                                        <li key={i} className="flex items-start gap-2.5">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2" />
                                            <span className="text-zinc-300 text-sm">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* 4. Improvements */}
                            <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-6">
                                <h3 className="text-lg font-semibold text-red-400 mb-4 flex items-center gap-2">
                                    <AlertCircle className="w-5 h-5" />
                                    Areas for Improvement
                                </h3>
                                <ul className="space-y-3">
                                    {feedbackData.improvements.map((item, i) => (
                                        <li key={i} className="flex items-start gap-2.5">
                                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2" />
                                            <span className="text-zinc-300 text-sm">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 6. Save Action Bar */}
                {!isSaved && (
                    <div className="fixed bottom-0 left-0 right-0 py-4 px-6 bg-zinc-900/90 backdrop-blur-lg border-t border-zinc-800 flex justify-center animate-in slide-in-from-bottom-5 z-50">
                        <div className="max-w-5xl w-full flex items-center justify-between gap-4">
                            <p className="text-zinc-400 text-sm hidden md:block">
                                Don't forget to save your feedback results to your profile.
                            </p>
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="w-full md:w-auto px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold rounded-lg shadow-lg shadow-emerald-500/10 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 text-sm"
                            >
                                {isSaving ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        Save Results
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}
                
                {isSaved && (
                     <div className="flex justify-center mt-8">
                         <div className="px-6 py-3 bg-zinc-900 rounded-full border border-emerald-500/30 text-emerald-500 text-sm font-medium flex items-center gap-2">
                             <CheckCircle className="w-4 h-4" />
                             Results saved to your dashboard
                         </div>
                     </div>
                )}

            </div>
        </main>
    </div>
  );
};

export default FeedbackPage;
