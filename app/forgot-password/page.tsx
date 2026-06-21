"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/Firebase/client";
import { toast } from "sonner";
import { ArrowLeft, MailCheck } from "lucide-react";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setIsSent(true);
      toast.success("Password reset email sent!");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to send reset email");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative">
      {/* Decorative backdrop */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-grid bg-grid-fade opacity-60" />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[40rem] h-[40rem] glow-brand opacity-30" />
      </div>

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Back Button */}
        <Link
          href="/sign-in"
          className="inline-flex items-center text-fg-muted hover:text-fg transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Sign In
        </Link>

        <div className="auth-card">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-fg mb-2">Forgot Password?</h1>
            <p className="text-fg-muted text-sm">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          {isSent ? (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-brand-soft text-brand-bright rounded-full grid place-items-center mx-auto border border-indigo-500/20">
                <MailCheck className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-fg mb-2">Check your email</h3>
                <p className="text-fg-muted text-sm">
                  We have sent a password reset link to{" "}
                  <span className="text-fg font-medium">{email}</span>
                </p>
              </div>
              <Button
                onClick={() => setIsSent(false)}
                variant="secondary"
                className="w-full h-11"
              >
                Try using a different email
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-fg-muted">Email Address</label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  className="auth-input"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <Button type="submit" disabled={isLoading} className="w-full h-12">

                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Sending Link...
                  </span>
                ) : (
                  "Send Reset Link"
                )}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
