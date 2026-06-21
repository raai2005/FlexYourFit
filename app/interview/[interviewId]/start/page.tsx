"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Webcam, Mic, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";
import DashboardNavbar from "@/app/components/DashboardNavbar";

import { getInterviewById, FireStoreInterview } from "@/lib/actions/interview.action";

const InterviewSetupPage = () => {
  const params = useParams();
  const router = useRouter();
  const [hasPermissions, setHasPermissions] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [interview, setInterview] = useState<FireStoreInterview | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        if (params.interviewId) {
          const data = await getInterviewById(params.interviewId as string);
          if (data) {
            setInterview(data);
          }
        }
      } catch (error) {
        console.error("Error fetching interview:", error);
      }
    };
    fetchInterview();
  }, [params.interviewId]);

  useEffect(() => {
    // Cleanup function to stop stream when component unmounts
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream, hasPermissions]);

  const enableMedia = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setStream(mediaStream);
      setHasPermissions(true);
      setError(null);
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
      router.push(`/interview/${params.interviewId}/session`);
    }
  };

  if (!interview) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-fg-muted">Loading interview details...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DashboardNavbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-6 pt-24 pb-20 flex flex-col md:flex-row gap-8 md:gap-12">
        {/* Left Col: Instructions & Info */}
        <div className="flex-1 space-y-8">
          <div>
            <Link
              href="/dashboard"
              className="text-fg-subtle hover:text-fg transition-colors text-sm mb-4 inline-flex items-center gap-1"
            >
              ← Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-fg mb-2 tracking-tight">Let's Get You Ready</h1>
            <p className="text-fg-muted">
              Before we start, let's make sure your camera and microphone are working properly.
            </p>
          </div>

          <div className="surface-card p-6 space-y-6">
            <h2 className="text-xl font-semibold text-fg">Interview Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface-2 p-4 rounded-xl border border-line">
                <span className="text-fg-subtle text-sm block mb-1">Role</span>
                <span className="text-fg font-medium">{interview.title}</span>
              </div>
              <div className="bg-surface-2 p-4 rounded-xl border border-line">
                <span className="text-fg-subtle text-sm block mb-1">Duration</span>
                <span className="text-fg font-medium">{interview.duration}</span>
              </div>
              <div className="bg-surface-2 p-4 rounded-xl border border-line">
                <span className="text-fg-subtle text-sm block mb-1">Difficulty</span>
                <span className="text-fg font-medium">{interview.difficulty}</span>
              </div>
            </div>
            <div className="text-sm text-fg-muted leading-relaxed">
              <span className="text-brand-bright font-medium">Note:</span> Your video and audio will
              be recorded for AI analysis. The data is processed securely and is only used to provide
              you with feedback.
            </div>
          </div>

          <div className="hidden md:block">
            <button
              onClick={handleStartInterview}
              disabled={!hasPermissions}
              className={`btn w-full h-14 text-base ${
                hasPermissions ? "btn-primary" : "bg-surface-2 text-fg-subtle cursor-not-allowed"
              }`}
            >
              Start Interview
              <ArrowRight className="w-5 h-5" />
            </button>
            {!hasPermissions && (
              <p className="text-center text-fg-subtle text-sm mt-3">
                Please enable your camera and microphone to continue
              </p>
            )}
          </div>
        </div>

        {/* Right Col: Webcam Check */}
        <div className="flex-1 flex flex-col items-center justify-start space-y-6">
          <div className="relative w-full aspect-auto md:aspect-video bg-surface rounded-2xl border border-line overflow-hidden flex items-center justify-center shadow-[var(--shadow-lg)] min-h-[400px] md:min-h-0">
            {hasPermissions ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover transform scale-x-[-1]"
              />
            ) : (
              <div className="text-center space-y-4 p-8">
                <div className="w-20 h-20 bg-surface-2 rounded-full grid place-items-center mx-auto mb-4 border border-line">
                  <Webcam className="w-10 h-10 text-fg-subtle" />
                </div>
                <h3 className="text-lg font-medium text-fg">Camera is Off</h3>
                <p className="text-fg-muted max-w-xs mx-auto">
                  Please click the button below to enable your camera and microphone access.
                </p>
                <button onClick={enableMedia} className="btn btn-secondary h-11 px-6">
                  Enable Camera & Microphone
                </button>
              </div>
            )}

            {/* Permission Status Badge */}
            <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-black/60 border border-white/10 flex items-center gap-2 text-xs font-medium">
              {hasPermissions ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-white">System Ready</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                  <span className="text-zinc-200">Checking Permissions</span>
                </>
              )}
            </div>
          </div>

          <div className="w-full surface-card p-6">
            <div className="flex items-center gap-4 mb-4">
              <Mic className={`w-6 h-6 ${hasPermissions ? "text-emerald-400" : "text-fg-subtle"}`} />
              <div className="flex-1">
                <h4 className="text-fg font-medium">Microphone</h4>
                <p className="text-fg-subtle text-sm">
                  {hasPermissions ? "Microphone active (Default Input)" : "Waiting for permission..."}
                </p>
              </div>
            </div>
            <div className="h-1.5 w-full bg-surface-2 rounded-full overflow-hidden">
              <div
                className={`h-full bg-emerald-500 transition-all duration-150 ${
                  hasPermissions ? "w-[60%] animate-pulse" : "w-0"
                }`}
              />
            </div>
          </div>

          {/* Mobile Start Button */}
          <div className="block md:hidden w-full">
            <button
              onClick={handleStartInterview}
              disabled={!hasPermissions}
              className={`btn w-full h-14 text-base ${
                hasPermissions ? "btn-primary" : "bg-surface-2 text-fg-subtle cursor-not-allowed"
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
