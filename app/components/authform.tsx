"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "@/Firebase/client";
import { SignUp, SignIn, SyncUser } from "@/lib/actions/auth.action";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface AuthFormProps {
  type: "sign-in" | "sign-up";
}

const AuthForm = ({ type }: AuthFormProps) => {
  const isSignIn = type === "sign-in";
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      // Sync user to database
      const res = await SyncUser({
        uid: result.user.uid,
        email: result.user.email || "",
        name: result.user.displayName || "User",
      });

      if (res.success) {
        toast.success("Signed in successfully");
        router.push("/dashboard");
      } else {
        toast.error("Failed to sync user data");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Google sign-in failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    setIsLoading(true);
    try {
      const provider = new GithubAuthProvider();
      const result = await signInWithPopup(auth, provider);

      // Sync user to database
      const res = await SyncUser({
        uid: result.user.uid,
        email: result.user.email || "",
        name: result.user.displayName || "User",
      });

      if (res.success) {
        toast.success("Signed in successfully");
        router.push("/dashboard");
      } else {
        toast.error("Failed to sync user data");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "GitHub sign-in failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignIn) {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const idToken = await userCredential.user.getIdToken();

        const res = await SignIn({
          email,
          idToken,
        });

        if (res.success) {
          toast.success("Signed in successfully");
          router.push("/dashboard");
        } else {
          toast.error(res.message);
        }
      } else {
        if (password !== confirmPassword) {
          toast.error("Passwords do not match");
          setIsLoading(false);
          return;
        }

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        await updateProfile(userCredential.user, {
          displayName: `${firstName} ${lastName}`,
        });

        const res = await SignUp({
          uid: userCredential.user.uid,
          email,
          name: `${firstName} ${lastName}`,
          password,
        });

        if (res?.success === false) {
          toast.error(res.message);
        } else {
          toast.success("Account created successfully");
          router.push("/dashboard");
        }
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Mobile logo (desktop shows it on the brand panel) */}
      <Link href="/" className="lg:hidden inline-flex items-center gap-2.5 mb-8">
        <div className="grid place-items-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-[0_8px_24px_-6px_rgba(99,102,241,0.7)]">
          <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
            <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" opacity="0.7" />
          </svg>
        </div>
        <span className="text-lg font-bold tracking-tight text-fg">FlexYourFit</span>
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-fg mb-2 tracking-tight">
          {isSignIn ? "Welcome back" : "Create your account"}
        </h1>
        <p className="text-fg-muted">
          {isSignIn
            ? "Sign in to continue your interview prep"
            : "Start your journey to ace interviews"}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {!isSignIn && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-fg-muted">First Name</label>
              <Input
                type="text"
                placeholder="John"
                className="auth-input"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-fg-muted">Last Name</label>
              <Input
                type="text"
                placeholder="Doe"
                className="auth-input"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium text-fg-muted">Email</label>
          <Input
            type="email"
            placeholder="you@example.com"
            className="auth-input"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-fg-muted">Password</label>
          <Input
            type="password"
            placeholder="••••••••"
            className="auth-input"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {!isSignIn && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-fg-muted">Confirm Password</label>
            <Input
              type="password"
              placeholder="••••••••"
              className="auth-input"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        )}

        {!isSignIn && (
          <div className="flex items-start gap-3 pt-1">
            <input
              type="checkbox"
              id="terms"
              required
              className="mt-0.5 h-4 w-4 rounded border-line-strong bg-surface-2 accent-indigo-500 focus:ring-brand"
            />
            <label htmlFor="terms" className="text-sm text-fg-muted leading-relaxed">
              I agree to the{" "}
              <Link href="/terms" className="text-brand-bright hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-brand-bright hover:underline">
                Privacy Policy
              </Link>
            </label>
          </div>
        )}

        {isSignIn && (
          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-sm text-fg-muted hover:text-fg transition-colors"
            >
              Forgot password?
            </Link>
          </div>
        )}

        <Button type="submit" disabled={isLoading} className="w-full h-12 mt-1">
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Processing...
            </span>
          ) : isSignIn ? (
            "Sign In"
          ) : (
            "Create Account"
          )}
        </Button>
      </form>

      {/* Divider */}
      <div className="relative my-7">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full divider" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-4 bg-background text-fg-subtle">or continue with</span>
        </div>
      </div>

      {/* Social Login */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 h-11 rounded-lg border border-line bg-surface-2 text-fg-muted hover:text-fg hover:bg-surface-3 hover:border-line-strong transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#EA4335" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Google
        </button>
        <button
          onClick={handleGithubLogin}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 h-11 rounded-lg border border-line bg-surface-2 text-fg-muted hover:text-fg hover:bg-surface-3 hover:border-line-strong transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
          GitHub
        </button>
      </div>

      {/* Footer */}
      <p className="text-center text-sm text-fg-muted mt-8">
        {isSignIn ? "Don't have an account?" : "Already have an account?"}{" "}
        <Link
          href={isSignIn ? "/sign-up" : "/sign-in"}
          className="text-brand-bright font-semibold hover:underline"
        >
          {isSignIn ? "Sign up" : "Sign in"}
        </Link>
      </p>
    </div>
  );
};

export default AuthForm;
