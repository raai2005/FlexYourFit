"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, Mic, MicOff, PhoneOff, Volume2, User, CheckCircle } from "lucide-react";
import Vapi from "@vapi-ai/web";
import { getInterviewById, trackInterviewStart, completeInterviewSession } from "@/lib/actions/interview.action";
import { FireStoreInterview } from "@/lib/actions/interview.action";
import { generateInterviewFeedback } from "@/lib/actions/gemini";
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
  const [transcript, setTranscript] = useState<{role: string; content: string}[]>([]);
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
      const jobRoleVariables = interview.type === "role" 
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
            setTranscript(prev => [...prev, {
                role: message.role, // 'user' or 'assistant'
                content: message.transcript
            }]);
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
      // vapi.stop(); // Only stop explicitly if needed, but here we just want to detach listeners. cleanupAndSave handles stopping.
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
        
        let score = 0;
        try {
            // Generate Score using Gemini
            const conversationText = transcript.map(t => `${t.role}: ${t.content}`).join("\n");
            const feedbackResult = await generateInterviewFeedback(conversationText, interview.title);
            
            if (feedbackResult.success && feedbackResult.data) {
                score = feedbackResult.data.score;
            }
        } catch (error) {
            console.error("Error generating score:", error);
        }

        await completeInterviewSession(userId, sessionId, transcript, score);
        toast.success("Interview completed and saved!");
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
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  if (!interview) return null;

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      <DashboardNavbar />

      <main className="flex-1 flex flex-col items-center justify-center p-6 pt-20">
        
        {/* Interview Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-xs text-zinc-400 font-medium mb-2">
            <span>{interview.category}</span>
            <span>•</span>
            <span>{interview.duration}</span>
          </div>
          <h1 className="text-2xl font-bold text-white">
            {interview.title} Interview
          </h1>
        </div>

        {/* Main Interview Grid */}
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* AI Interviewer */}
          <div className="relative aspect-video bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-2xl border border-zinc-700 overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/10" />
            
            {/* AI Avatar */}
            <div className="relative z-10 flex flex-col items-center gap-4">
              <div className={`relative w-32 h-32 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-500 flex items-center justify-center shadow-2xl ${callStatus === 'active' && isSpeaking ? 'animate-pulse scale-110' : ''} transition-transform duration-300`}>
                <div className="w-28 h-28 rounded-full bg-zinc-900 flex items-center justify-center">
                  <Volume2 className={`w-12 h-12 ${callStatus === 'active' ? 'text-emerald-400' : 'text-zinc-500'}`} />
                </div>
                {/* Speaking Indicator Ring */}
                {callStatus === 'active' && isSpeaking && (
                  <div className="absolute -inset-2 border-2 border-emerald-400 rounded-full animate-ping opacity-50" />
                )}
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-white">AI Interviewer</h3>
                <p className={`text-sm ${callStatus === 'active' ? (isSpeaking ? 'text-emerald-400' : 'text-zinc-400') : 'text-zinc-500'}`}>
                  {callStatus === 'idle' && 'Ready to start'}
                  {callStatus === 'connecting' && 'Connecting...'}
                  {callStatus === 'active' && (isSpeaking ? 'Speaking...' : 'Listening...')}
                  {callStatus === 'ended' && 'Call ended'}
                </p>
              </div>
            </div>

            {/* Status Badge */}
            <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/50 backdrop-blur text-xs font-medium text-white flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${callStatus === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-500'}`} />
              {callStatus === 'active' ? 'Live' : 'Standby'}
            </div>
          </div>

          {/* User Video */}
          <div className="relative aspect-video bg-zinc-900 rounded-2xl border border-zinc-700 overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover transform scale-x-[-1]"
            />
            
            {/* No Video Fallback */}
            {!stream && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900">
                <div className="w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center mb-4">
                  <User className="w-10 h-10 text-zinc-500" />
                </div>
                <p className="text-zinc-500 text-sm">Camera not available</p>
              </div>
            )}

            {/* User Label */}
            <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/50 backdrop-blur text-xs font-medium text-white">
              You
            </div>

            {/* Mute Indicator */}
            {isMuted && (
              <div className="absolute top-4 right-4 px-2 py-1 rounded-full bg-red-500/80 backdrop-blur text-xs font-medium text-white flex items-center gap-1">
                <MicOff className="w-3 h-3" />
                Muted
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          {callStatus === 'idle' && (
            <button
              onClick={startInterview}
              className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl text-lg transition-all transform hover:scale-105 shadow-lg shadow-emerald-500/20"
            >
              Start Interview Now
            </button>
          )}

          {callStatus === 'connecting' && (
            <div className="flex items-center gap-3 px-8 py-4 bg-zinc-800 rounded-2xl">
              <Loader2 className="w-5 h-5 text-emerald-500 animate-spin" />
              <span className="text-white font-medium">Connecting...</span>
            </div>
          )}

          {callStatus === 'active' && (
            <>
              <button
                onClick={toggleMute}
                className={`w-14 h-14 rounded-full flex items-center justify-center border transition-all ${
                  isMuted 
                    ? "bg-red-500/20 border-red-500 text-red-500" 
                    : "bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700"
                }`}
              >
                {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              </button>
              <button
                onClick={endCall}
                className="w-14 h-14 rounded-full flex items-center justify-center bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20 transition-all"
              >
                <PhoneOff className="w-6 h-6" />
              </button>
            </>
          )}

          {callStatus === 'ended' && (
            <button
              onClick={cleanupAndSave}
              className="px-8 py-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-2xl text-lg transition-all flex items-center gap-2 shadow-lg shadow-red-500/20"
            >
              <PhoneOff className="w-5 h-5" />
              End / Leave
            </button>
          )}
        </div>

        {/* Saving Modal */}
        {isSaving && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 flex flex-col items-center gap-4 max-w-sm w-full mx-4 shadow-2xl">
              <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
              <div className="text-center">
                <h3 className="text-xl font-semibold text-white mb-2">Saving Data</h3>
                <p className="text-zinc-400">Please wait while we save your interview details and transcripts...</p>
              </div>
            </div>
          </div>
        )}

        {/* Completion Modal */}
        {isCompleted && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 flex flex-col items-center gap-6 max-w-md w-full mx-4 shadow-2xl">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-emerald-500" />
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-2">Interview Completed!</h3>
                <p className="text-zinc-400">
                  Thank you for taking the interview. Your interview details and transcripts have been saved successfully.
                </p>
              </div>
              <button
                onClick={() => router.push("/dashboard")}
                className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default InterviewSessionPage;
