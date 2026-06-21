"use client";

import React, { useState } from "react";
import { verifyAdminCredentials } from "@/lib/actions/admin";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ShieldCheck } from "lucide-react";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    const result = await verifyAdminCredentials(formData);

    if (result.success) {
      toast.success("Admin logged in successfully");
      router.push("/admin/dashboard");
      setLoading(false);
      return;
    }

    toast.error(result.message);
    setLoading(false);
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <div className="w-full max-w-md p-8 surface-card">
        <div className="flex flex-col items-center mb-6">
          <div className="grid place-items-center w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 mb-4 shadow-[0_10px_30px_-8px_rgba(239,68,68,0.6)]">
            <ShieldCheck className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-fg text-center">Admin Access</h1>
          <p className="text-fg-subtle text-sm mt-1">Authorized personnel only</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-fg-muted mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="field"
              placeholder="admin@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-fg-muted mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="field"
              placeholder="••••••••"
              required
            />
          </div>
          <button type="submit" disabled={loading} className="btn btn-danger w-full h-11 mt-2">
            {loading ? "Verifying..." : "Access Portal"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
