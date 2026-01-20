"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Webcam, Mic, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";
import DashboardNavbar from "@/app/components/DashboardNavbar";

// Mock data for now (since we don't have a backend fetch yet)
const MOCK_INTERVIEW_INFO = {
  title: "Full Stack Developer Interview",
  description: "This interview focuses on React, Node.js, and System Design.",
  duration: "45 mins",
  questions: 5,
};

const InterviewSetupPage = () => {
  const params = useParams();
  const router = useRouter();
  const [hasPermissions, setHasPermissions] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Cleanup function to stop stream when component unmounts
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  const enableMedia = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setStream(mediaStream);
      setHasPermissions(true);
      setError(null);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Error accessing media devices:", err);
      setHasPermissions(false);
      setError(
        "Could not access camera/microphone. Please check your system permissions and try again."
      );
    }
  };

  const handleStartInterview = () => {
    if (hasPermissions) {
        // Navigate to the actual interview session (dashboard for now or a new page)
        // For now, we remain here or go to a placeholder
        // router.push(`/interview/${params.interviewId}/session`); // Future
        alert("Interview Session Starting... (This would navigate to the interview)");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
       <DashboardNavbar />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 pt-24 pb-12 flex flex-col md:flex-row gap-12">
        {/* Left Col: Instructions & Info */}
        <div className="flex-1 space-y-8">
            <div>
                 <Link href="/dashboard" className="text-zinc-500 hover:text-zinc-300 transition-colors text-sm mb-4 inline-flex items-center gap-1">
                    ← Back to Dashboard
                 </Link>
                <h1 className="text-3xl font-bold text-white mb-2">
                    Let's Get You Ready
                </h1>
                <p className="text-zinc-400">
                    Before we start, let's make sure your camera and microphone are working properly.
                </p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-6">
                <h2 className="text-xl font-semibold text-white">Interview Details</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                        <span className="text-zinc-500 text-sm block mb-1">Role</span>
                        <span className="text-zinc-200 font-medium">{MOCK_INTERVIEW_INFO.title}</span>
                    </div>
                     <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                        <span className="text-zinc-500 text-sm block mb-1">Duration</span>
                        <span className="text-zinc-200 font-medium">{MOCK_INTERVIEW_INFO.duration}</span>
                    </div>
                     <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                        <span className="text-zinc-500 text-sm block mb-1">Questions</span>
                        <span className="text-zinc-200 font-medium">{MOCK_INTERVIEW_INFO.questions}</span>
                    </div>
                </div>
                <div className="text-sm text-zinc-400 leading-relaxed">
                    <span className="text-emerald-400 font-medium">Note:</span> Your video and audio will be recorded for AI analysis. The data is processed securely and is only used to provide you with feedback.
                </div>
            </div>

             <div className="hidden md:block">
                 <button
                    onClick={handleStartInterview}
                    disabled={!hasPermissions}
                    className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all duration-200 ${
                        hasPermissions
                        ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 cursor-pointer"
                        : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                    }`}
                >
                    Start Interview
                    <ArrowRight className="w-5 h-5" />
                </button>
                {!hasPermissions && (
                    <p className="text-center text-zinc-500 text-sm mt-3">
                        Please enable your camera and microphone to continue
                    </p>
                )}
             </div>
        </div>

        {/* Right Col: Webcam Check */}
        <div className="flex-1 flex flex-col items-center justify-start space-y-6">
             <div className="relative w-full aspect-video bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden flex items-center justify-center shadow-2xl">
                {hasPermissions ? (
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover transform scale-x-[-1]" // Mirror effect
                    />
                ) : (
                    <div className="text-center space-y-4 p-8">
                        <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                             <Webcam className="w-10 h-10 text-zinc-500" />
                        </div>
                        <h3 className="text-lg font-medium text-white">Camera is Off</h3>
                        <p className="text-zinc-400 max-w-xs mx-auto">
                            Please click the button below to enable your camera and microphone access.
                        </p>
                         <button 
                            onClick={enableMedia}
                            className="px-6 py-2 bg-white text-black font-medium rounded-lg hover:bg-zinc-200 transition-colors"
                        >
                            Enable Camera & Microphone
                         </button>
                    </div>
                )}

                 {/* Permission Status Badge */}
                 <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center gap-2 text-xs font-medium">
                    {hasPermissions ? (
                        <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            <span className="text-white">System Ready</span>
                        </>
                    ) : (
                        <>
                            <AlertCircle className="w-4 h-4 text-amber-500" />
                            <span className="text-zinc-300">Checking Permissions</span>
                        </>
                    )}
                 </div>
             </div>

             <div className="w-full bg-zinc-900/50 p-6 rounded-xl border border-zinc-800">
                <div className="flex items-center gap-4 mb-4">
                     <Mic className={`w-6 h-6 ${hasPermissions ? "text-emerald-500" : "text-zinc-500"}`} />
                     <div className="flex-1">
                        <h4 className="text-white font-medium">Microphone</h4>
                        <p className="text-zinc-500 text-sm">
                            {hasPermissions ? "Microphone active (Default Input)" : "Waiting for permission..."}
                        </p>
                     </div>
                </div>
                 <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                     {/* Fake volume visualizer */}
                    <div className={`h-full bg-emerald-500 transition-all duration-150 ${hasPermissions ? "w-[60%] animate-pulse" : "w-0"}`} />
                 </div>
             </div>

             {/* Mobile Start Button */}
             <div className="block md:hidden w-full">
                 <button
                    onClick={handleStartInterview}
                    disabled={!hasPermissions}
                    className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all duration-200 ${
                        hasPermissions
                        ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20"
                        : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                    }`}
                >
                    Start Interview
                    <ArrowRight className="w-5 h-5" />
                </button>
             </div>
        </div>
      </main>
    </div>
  );
};

export default InterviewSetupPage;
