"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, CheckCircle, AlertCircle, Save, Home, Lightbulb } from "lucide-react";
import GaugeChart from "react-gauge-chart";
import { toast } from "sonner";

import { getInterviewById, getUserInterviewSession, saveDetailedFeedback } from "@/lib/actions/interview.action";
import { generateInterviewFeedback, FeedbackResponse } from "@/lib/actions/gemini";
import { FireStoreInterview } from "@/lib/actions/interview.action";
import { auth } from "@/Firebase/client";
import DashboardNavbar from "@/app/components/DashboardNavbar";

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
          getUserInterviewSession(user.uid, params.interviewId as string),
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
            motivation: session.motivation || "",
          });
          setIsSaved(true);
        } else if (session?.transcript) {
          setIsGenerating(true);
          const transcriptText = session.transcript
            .map((t: any) => `${t.role}: ${t.content}`)
            .join("\n");

          const result = await generateInterviewFeedback(
            transcriptText,
            interviewData.title,
            interviewData.syllabus
          );

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
        motivation: feedbackData.motivation,
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-brand-bright animate-spin" />
        <p className="ml-3 text-fg-muted">Loading your results...</p>
      </div>
    );
  }

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-6">
        <div className="relative">
          <div className="absolute inset-0 bg-brand/25 blur-xl rounded-full animate-pulse" />
          <Loader2 className="w-16 h-16 text-brand-bright animate-spin relative z-10" />
        </div>
        <h2 className="text-2xl font-bold text-fg">Analyzing Your Interview...</h2>
        <p className="text-fg-muted max-w-md text-center">
          Our AI is reviewing your answers, evaluating your technical accuracy, and generating a
          personalized roadmap for improvement.
        </p>
      </div>
    );
  }

  if (!feedbackData || !interview) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <AlertCircle className="w-10 h-10 text-danger-bright" />
        <h2 className="text-xl font-bold text-fg">Unable to Load Feedback</h2>
        <p className="text-fg-muted">We couldn't generate or find your feedback details.</p>
        <button onClick={() => router.push("/dashboard")} className="btn btn-secondary h-10 px-4">
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNavbar />

      <main className="pt-24 pb-32 px-6">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* 1. Header Details */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="chip">{interview.type === "role" ? "Role Based" : "Skill Based"}</span>
                <span className="chip">{interview.difficulty}</span>
              </div>
              <h1 className="text-3xl font-bold text-fg tracking-tight">
                {interview.title} Interview Report
              </h1>
              <p className="text-fg-subtle text-sm mt-1">
                Completed on {new Date().toLocaleDateString()}
              </p>
            </div>

            <div className="flex gap-3">
              <button onClick={() => router.push("/dashboard")} className="btn btn-secondary h-10 px-4">
                <Home className="w-4 h-4" />
                Dashboard
              </button>
            </div>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 2. Speedometer Score */}
            <div className="col-span-1 surface-card p-6 flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-brand-soft to-transparent" />

              <h3 className="text-lg font-semibold text-fg-muted mb-6 z-10">Overall Score</h3>

              <div className="w-full text-center z-10 -mb-8">
                <GaugeChart
                  id="gauge-chart1"
                  nrOfLevels={3}
                  colors={["#ef4444", "#f59e0b", "#10b981"]}
                  arcWidth={0.3}
                  percent={feedbackData.score / 100}
                  textColor="#FFF"
                  hideText={true}
                />
              </div>
              <div className="text-center z-10 mt-4">
                <span className="text-5xl font-bold text-fg tracking-tight">{feedbackData.score}</span>
                <span className="text-xl text-fg-subtle">/100</span>
              </div>

              {/* 5. Motivation */}
              <div className="mt-8 p-4 bg-surface-2 rounded-xl border border-line text-center relative max-w-[250px]">
                <Lightbulb className="w-5 h-5 text-amber-400 absolute -top-2.5 left-1/2 -translate-x-1/2 bg-surface rounded-full px-1" />
                <p className="text-sm font-medium text-fg-muted italic">"{feedbackData.motivation}"</p>
              </div>
            </div>

            {/* Right Col: Details */}
            <div className="col-span-1 md:col-span-2 space-y-6">
              {/* Summary */}
              <div className="surface-card p-6">
                <h3 className="text-lg font-semibold text-fg mb-3 flex items-center gap-2">
                  <span className="w-1 h-6 bg-brand rounded-full" />
                  Executive Summary
                </h3>
                <p className="text-fg/90 leading-relaxed">{feedbackData.feedback}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* 3. Good Parts */}
                <div className="bg-emerald-500/[0.06] border border-emerald-500/15 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-emerald-300 mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Strengths
                  </h3>
                  <ul className="space-y-3">
                    {feedbackData.good_parts.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2" />
                        <span className="text-fg/90 text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 4. Improvements */}
                <div className="bg-red-500/[0.06] border border-red-500/15 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-red-300 mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Areas for Improvement
                  </h3>
                  <ul className="space-y-3">
                    {feedbackData.improvements.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2" />
                        <span className="text-fg/90 text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* 6. Save Action Bar */}
          {!isSaved && (
            <div className="fixed bottom-0 left-0 right-0 py-4 px-6 bg-surface border-t border-line flex justify-center animate-in slide-in-from-bottom-5 z-50">
              <div className="max-w-5xl w-full flex items-center justify-between gap-4">
                <p className="text-fg-muted text-sm hidden md:block">
                  Don't forget to save your feedback results to your profile.
                </p>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="btn btn-primary w-full md:w-auto h-11 px-6 text-sm"
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
              <a href="/dashboard" className="btn btn-primary h-11 px-6 text-sm">
                <CheckCircle className="w-4 h-4" />
                Go To Dashboard
              </a>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default FeedbackPage;
