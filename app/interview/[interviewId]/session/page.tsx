"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, Mic, MicOff, PhoneOff, Volume2 } from "lucide-react";
import Vapi from "@vapi-ai/web";
import { getInterviewById } from "@/lib/actions/interview.action";
import { FireStoreInterview } from "@/lib/actions/interview.action";
import DashboardNavbar from "@/app/components/DashboardNavbar";
import { toast } from "sonner";

// Initialize Vapi with Public Key from env
const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY!);

const InterviewSessionPage = () => {
  const params = useParams();
  const router = useRouter();
  const [interview, setInterview] = useState<FireStoreInterview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [callStatus, setCallStatus] = useState<
    "idle" | "connecting" | "active" | "ended"
  >("idle");
  const [isMuted, setIsMuted] = useState(false);

  // Fetch interview details
  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const data = await getInterviewById(params.interviewId as string);
        if (data) {
          setInterview(data);
        } else {
          toast.error("Interview not found");
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("Error fetching interview:", error);
        toast.error("Something went wrong");
      } finally {
        setIsLoading(false);
      }
    };

    if (params.interviewId) {
      fetchInterview();
    }
  }, [params.interviewId, router]);

  // Start Vapi Call
  const startInterview = useCallback(async () => {
    if (!interview) return;

    setCallStatus("connecting");

    try {
      // Start the call with the specific Assistant ID and injected variables
      await vapi.start(process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID!, {
        variableValues: {
          jobRole: interview.title,
          techStack: interview.syllabus.join(", "),
          questions:
            (interview as any).questions?.join("\n") ||
            "No specific questions provided.", // Fallback if questions missing
        },
      });
      setCallStatus("active");
    } catch (error) {
      console.error("Error starting Vapi call:", error);
      toast.error("Failed to start AI Interviewer");
      setCallStatus("idle");
    }
  }, [interview]);

  // Handle Vapi Events
  useEffect(() => {
    const onCallEnd = () => {
      setCallStatus("ended");
      toast.success("Interview ended");
    };

    const onError = (e: any) => {
      console.error("Vapi Error:", e);
      // Don't toast every error, some are minor
    };

    vapi.on("call-end", onCallEnd);
    vapi.on("error", onError);

    return () => {
      // Cleanup listeners
      vapi.removeAllListeners();
      // Ensure call stops if component unmounts
      if (callStatus === "active" || callStatus === "connecting") {
        vapi.stop();
      }
    };
  }, [callStatus]);

  const toggleMute = () => {
    const newMutedState = !isMuted;
    vapi.setMuted(newMutedState);
    setIsMuted(newMutedState);
  };

  const endCall = () => {
    vapi.stop();
    setCallStatus("ended");
    router.push("/dashboard"); // Or a feedback page later
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  if (!interview) return null;

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      <DashboardNavbar />

      <main className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Main Card */}
        <div className="relative z-10 w-full max-w-2xl bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8 shadow-2xl flex flex-col items-center text-center space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-xs text-zinc-400 font-medium mb-2">
              <span>{interview.category}</span>
              <span>•</span>
              <span>{interview.duration}</span>
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              {interview.title} Interview
            </h1>
            <p className="text-zinc-400 max-w-md mx-auto">
              Our AI interviewer is ready. Make sure your mic is working and you
              are in a quiet environment.
            </p>
          </div>

          {/* Active Call UI */}
          {callStatus === "active" ? (
            <div className="w-full py-12 flex flex-col items-center justify-center space-y-8 animate-in fade-in zoom-in duration-500">
              {/* AI Avatar / Visualizer Placeholder */}
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 animate-pulse">
                  <Volume2 className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -inset-4 border border-white/10 rounded-full animate-[spin_10s_linear_infinite]" />
              </div>

              <div className="text-emerald-400 font-medium tracking-widest uppercase text-sm">
                AI is listening...
              </div>
            </div>
          ) : callStatus === "connecting" ? (
            <div className="py-12 flex flex-col items-center gap-4">
              <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
              <p className="text-zinc-400">Connecting to AI Interviewer...</p>
            </div>
          ) : (
            /* Idle State */
            <div className="py-8">
              <button
                onClick={startInterview}
                className="px-8 py-4 bg-white hover:bg-zinc-200 text-black font-bold rounded-2xl text-lg transition-all transform hover:scale-105 shadow-xl"
              >
                Start Interview Now
              </button>
            </div>
          )}

          {/* Controls (Only visible when active) */}
          {callStatus === "active" && (
            <div className="flex items-center gap-4">
              <button
                onClick={toggleMute}
                className={`w-14 h-14 rounded-full flex items-center justify-center border transition-all ${isMuted ? "bg-red-500/10 border-red-500 text-red-500" : "bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700"}`}
              >
                {isMuted ? (
                  <MicOff className="w-6 h-6" />
                ) : (
                  <Mic className="w-6 h-6" />
                )}
              </button>
              <button
                onClick={endCall}
                className="w-14 h-14 rounded-full flex items-center justify-center bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20 transition-all"
              >
                <PhoneOff className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default InterviewSessionPage;
