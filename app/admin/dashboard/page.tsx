"use client";

import React, { useState } from "react";
import { db, auth } from "@/Firebase/client";
import { collection, addDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

interface NewInterview {
  title: string;
  description: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
  duration: string;
  syllabus: string; // Temporarily string for input, converted to array on submit
}

const AdminDashboard = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // Import useRouter
  const [formData, setFormData] = useState<NewInterview>({
    title: "",
    description: "",
    category: "",
    difficulty: "Medium",
    duration: "30 Min",
    syllabus: "",
  });

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");
    if (isAdmin === "true") {
        return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/admin/login");
      }
    });

    return () => unsubscribe();
  }, [router]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const syllabusArray = formData.syllabus.split(",").map((s) => s.trim()).filter((s) => s.length > 0);

      const interviewData = {
        ...formData,
        syllabus: syllabusArray,
        createdAt: new Date(),
      };

      await addDoc(collection(db, "interviews"), interviewData);
      
      toast.success("Interview added successfully!");
      setFormData({
        title: "",
        description: "",
        category: "",
        difficulty: "Medium",
        duration: "30 Min",
        syllabus: "",
      });
    } catch (error: any) {
      console.error("Error adding interview:", error);
      toast.error("Failed to add interview");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-zinc-400 mt-1">Manage interviews and content</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add Interview Form */}
        <div className="lg:col-span-2">
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </span>
              Add New Interview
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-emerald-500 transition-colors"
                    placeholder="e.g. Frontend React Developer"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Category</label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-emerald-500 transition-colors"
                    placeholder="e.g. Engineering"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                  placeholder="Comprehensive assessment of React..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Difficulty</label>
                  <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-emerald-500 transition-colors appearance-none"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Duration</label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-emerald-500 transition-colors"
                    placeholder="e.g. 45 Min"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Syllabus (Comma separated)</label>
                <textarea
                   name="syllabus"
                   value={formData.syllabus}
                   onChange={handleChange}
                   rows={3}
                   className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                   placeholder="React Hooks, Context API, Redux, Performance Optimization..."
                   required
                />
                 <p className="text-xs text-zinc-500 mt-1">Separate topics with commas</p>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Adding Interview..." : "Add Interview & Store"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Possible Sidebar / Stats */}
        <div className="space-y-6">
           <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Stats</h3>
              <div className="space-y-4">
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-400">Total Interviews</span>
                    <span className="text-white font-mono">--</span> {/* Placeholder for now */}
                 </div>
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-400">Active Users</span>
                    <span className="text-white font-mono">--</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
