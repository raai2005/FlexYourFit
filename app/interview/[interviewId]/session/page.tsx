"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, Mic, MicOff, PhoneOff, Volume2, User, CheckCircle } from "lucide-react";
import Vapi from "@vapi-ai/web";
import { getInterviewById, trackInterviewStart, completeInterviewSession } from "@/lib/actions/interview.action";
import { FireStoreInterview } from "@/lib/actions/interview.action";
import DashboardNavbar from "@/app/components/DashboardNavbar";
import { toast } from "sonner";
import { auth } from "@/Firebase/client";

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
  const [isSpeaking, setIsSpeaking] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const [hasPermissions, setHasPermissions] = useState(false);
  const startTimeRef = useRef<number | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<{ role: string; content: string }[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

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
    } else {
      console.warn("Interview ID missing in params");
      setIsLoading(false);
      toast.error("Invalid Session ID");
      router.push("/dashboard");
    }
  }, [params.interviewId, router]);

  // Setup webcam
  useEffect(() => {
    const setupCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setStream(mediaStream);
        setHasPermissions(true);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setHasPermissions(false);
        toast.error("Camera/Microphone access denied");
      }
    };

    setupCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Update video element when stream changes
  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  // Start Vapi Call
  const startInterview = useCallback(async () => {
    if (!interview) return;
    if (!hasPermissions) {
      toast.error("Please enable camera/microphone first");
      return;
    }

    setCallStatus("connecting");

    try {
      const jobRoleVariables =
        interview.type === "role"
          ? `${interview.title} Role`
          : `${interview.title} Assessment`;

      await vapi.start(process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID!, {
        variableValues: {
          jobRole: jobRoleVariables,
          jobDescription: interview.description,
          difficulty: interview.difficulty,
          techStack: interview.syllabus.join(", "),
        },
      });
      setCallStatus("active");
      startTimeRef.current = Date.now();

      if (interview.id) {
        const userId = auth.currentUser?.uid || "";
        const result = await trackInterviewStart(interview.id, userId);
        if (result && result.sessionId) {
          setSessionId(result.sessionId);
        }
      }
    } catch (error) {
      console.error("Error starting Vapi call:", error);
      toast.error("Failed to start AI Interviewer");
      setCallStatus("idle");
    }
  }, [interview, hasPermissions]);

  // Handle Vapi Events
  useEffect(() => {
    const onCallEnd = () => {
      setCallStatus("ended");
      startTimeRef.current = null;
      toast("Interview Session Ended");
    };

    const onSpeechStart = () => setIsSpeaking(true);
    const onSpeechEnd = () => setIsSpeaking(false);

    // Capture transcripts
    const onMessage = (message: any) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        setTranscript((prev) => [
          ...prev,
          {
            role: message.role, // 'user' or 'assistant'
            content: message.transcript,
          },
        ]);
      }
    };

    const onError = (e: any) => {
      console.error("Vapi Error:", e);
    };

    vapi.on("call-end", onCallEnd);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("message", onMessage);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-end", onCallEnd);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("message", onMessage);
      vapi.off("error", onError);
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  const toggleMute = () => {
    const newMutedState = !isMuted;
    vapi.setMuted(newMutedState);
    setIsMuted(newMutedState);
  };

  const cleanupAndSave = async () => {
    // 1. Stop things if running
    vapi.stop();
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }

    setIsSaving(true);

    // 2. Save
    if (sessionId && interview) {
      const userId = auth.currentUser?.uid || "";

      // Just save the transcript and mark as completed.
      // Feedback generation happens on the next page.
      await completeInterviewSession(userId, sessionId, transcript);
      toast.success("Interview completed!");
    }

    setIsSaving(false);
    setIsCompleted(true);
  };

  const endCall = async () => {
    setCallStatus("ended");
    await cleanupAndSave();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-bright animate-spin" />
      </div>
    );
  }

  if (!interview) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DashboardNavbar />

      <main className="flex-1 flex flex-col items-center justify-start md:justify-center p-4 md:p-6 pt-20 md:pt-24 pb-24 md:pb-12 w-full">
        {/* Interview Header */}
        <div className="text-center mb-4 md:mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-2 border border-line text-xs text-fg-muted font-medium mb-2">
            <span>{interview.category}</span>
            <span>•</span>
            <span>{interview.duration}</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-fg">{interview.title} Interview</h1>
        </div>

        {/* Main Interview Grid */}
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-8">
          {/* AI Interviewer */}
          <div className="relative aspect-video bg-surface rounded-2xl border border-line overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/8 to-violet-500/10" />

            {/* AI Avatar */}
            <div className="relative z-10 flex flex-col items-center gap-4">
              <div
                className={`relative w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 grid place-items-center shadow-[0_18px_50px_-12px_rgba(99,102,241,0.6)] ${
                  callStatus === "active" && isSpeaking ? "animate-pulse scale-110" : ""
                } transition-transform duration-300`}
              >
                <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-surface grid place-items-center">
                  <Volume2
                    className={`w-8 h-8 md:w-12 md:h-12 ${
                      callStatus === "active" ? "text-brand-bright" : "text-fg-subtle"
                    }`}
                  />
                </div>
                {/* Speaking Indicator Ring */}
                {callStatus === "active" && isSpeaking && (
                  <div className="absolute -inset-2 border-2 border-brand rounded-full animate-ping opacity-50" />
                )}
              </div>
              <div className="text-center">
                <h3 className="text-base md:text-lg font-semibold text-fg">AI Interviewer</h3>
                <p
                  className={`text-xs md:text-sm ${
                    callStatus === "active"
                      ? isSpeaking
                        ? "text-brand-bright"
                        : "text-fg-muted"
                      : "text-fg-subtle"
                  }`}
                >
                  {callStatus === "idle" && "Ready to start"}
                  {callStatus === "connecting" && "Connecting..."}
                  {callStatus === "active" && (isSpeaking ? "Speaking..." : "Listening...")}
                  {callStatus === "ended" && "Call ended"}
                </p>
              </div>
            </div>

            {/* Status Badge */}
            <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/50 text-xs font-medium text-white flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  callStatus === "active" ? "bg-emerald-400 animate-pulse" : "bg-zinc-500"
                }`}
              />
              {callStatus === "active" ? "Live" : "Standby"}
            </div>
          </div>

          {/* User Video */}
          <div className="relative aspect-video bg-surface rounded-2xl border border-line overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover transform scale-x-[-1]"
            />

            {/* No Video Fallback */}
            {!stream && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface">
                <div className="w-20 h-20 rounded-full bg-surface-2 grid place-items-center mb-4 border border-line">
                  <User className="w-10 h-10 text-fg-subtle" />
                </div>
                <p className="text-fg-subtle text-sm">Camera not available</p>
              </div>
            )}

            {/* User Label */}
            <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/50 text-xs font-medium text-white">
              You
            </div>

            {/* Mute Indicator */}
            {isMuted && (
              <div className="absolute top-4 right-4 px-2 py-1 rounded-full bg-red-500/80 text-xs font-medium text-white flex items-center gap-1">
                <MicOff className="w-3 h-3" />
                Muted
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 md:static md:translate-x-0 flex items-center gap-4 bg-surface md:bg-transparent p-4 md:p-0 rounded-2xl border border-line md:border-none shadow-[var(--shadow-lg)] md:shadow-none">
          {callStatus === "idle" && (
            <button onClick={startInterview} className="btn btn-primary h-14 px-8 text-lg">
              Start Interview Now
            </button>
          )}

          {callStatus === "connecting" && (
            <div className="flex items-center gap-3 px-8 h-14 bg-surface-2 rounded-2xl whitespace-nowrap border border-line">
              <Loader2 className="w-5 h-5 text-brand-bright animate-spin" />
              <span className="text-fg font-medium">Connecting...</span>
            </div>
          )}

          {callStatus === "active" && (
            <>
              <button
                onClick={toggleMute}
                className={`w-14 h-14 rounded-full flex items-center justify-center border transition-all ${
                  isMuted
                    ? "bg-red-500/20 border-red-500 text-red-400"
                    : "bg-surface-2 border-line-strong text-fg hover:bg-surface-3"
                }`}
              >
                {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              </button>
              <button
                onClick={endCall}
                className="w-14 h-14 rounded-full flex items-center justify-center bg-red-500 hover:bg-red-600 text-white shadow-[0_10px_32px_-10px_rgba(220,38,38,0.55)] transition-all"
              >
                <PhoneOff className="w-6 h-6" />
              </button>
            </>
          )}

          {callStatus === "ended" && (
            <button onClick={cleanupAndSave} className="btn btn-danger h-14 px-8 text-lg">
              <PhoneOff className="w-5 h-5" />
              End / Leave
            </button>
          )}
        </div>

        {/* Saving Modal */}
        {isSaving && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
            <div className="surface-card p-8 flex flex-col items-center gap-4 max-w-sm w-full mx-4">
              <Loader2 className="w-12 h-12 text-brand-bright animate-spin" />
              <div className="text-center">
                <h3 className="text-xl font-semibold text-fg mb-2">Saving Data</h3>
                <p className="text-fg-muted">
                  Please wait while we save your interview details and transcripts...
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Completion Modal */}
        {isCompleted && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
            <div className="surface-card p-8 flex flex-col items-center gap-6 max-w-md w-full mx-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 grid place-items-center">
                <CheckCircle className="w-8 h-8 text-emerald-400" />
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-fg mb-2">Interview Completed!</h3>
                <p className="text-fg-muted">
                  Your interview has been recorded. Click below to view your score and AI feedback.
                </p>
              </div>
              <button
                onClick={() => router.push(`/interview/${params.interviewId}/feedback`)}
                className="btn btn-primary w-full h-12"
              >
                View Feedback with Score
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default InterviewSessionPage;
