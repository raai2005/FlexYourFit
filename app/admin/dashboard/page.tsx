"use client";

import React, { useState, useEffect } from "react";
import { auth } from "@/Firebase/client";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { addInterview, deleteInterview, getDashboardStats, updateInterview } from "@/lib/actions/admin";
import { getInterviews, FireStoreInterview } from "@/lib/actions/interview.action";
import { Trash2, Edit, Plus, LayoutGrid, List, BarChart3, Users, Briefcase, GraduationCap, X } from "lucide-react";

interface NewInterview {
  title: string;
  description: string;
  category: string;
  type: "role" | "skill";
  difficulty: "Easy" | "Medium" | "Hard";
  duration: string;
  syllabus: string;
}

interface DashboardStats {
    totalInterviews: number;
    totalUsers: number;
    roleBasedCount: number;
    skillBasedCount: number;
    recentInterviews: any[];
}

const AdminDashboard = () => {
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Use URL param for tab, default to 'dashboard'
  const activeTab = searchParams.get("tab") || "dashboard";

  const [interviews, setInterviews] = useState<FireStoreInterview[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [fetchingData, setFetchingData] = useState(false);
  
  // Modal States
  const [showAddSuccess, setShowAddSuccess] = useState(false);
  const [showUpdateSuccess, setShowUpdateSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  const [addedInterviewTitle, setAddedInterviewTitle] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<NewInterview>({
    title: "",
    description: "",
    category: "",
    type: "role",
    difficulty: "Medium",
    duration: "30 Min",
    syllabus: "",
  });

  useEffect(() => {
    // Middleware protects this route now. 
    // We can add a simple server-side check double-verification in future if needed, 
    // but for now relying on middleware is standard pattern.
  }, [router]);

  // Fetch data based on active tab
  useEffect(() => {
    if (activeTab === "manage") {
      fetchInterviews();
    } else if (activeTab === "dashboard") {
      fetchStats();
    } else if (activeTab === "create" && !isEditMode) {
      // If manually navigating to create and not in edit mode, ensure form is clear
      clearForm();
    }
  }, [activeTab]);

  const fetchStats = async () => {
      setFetchingData(true);
      try {
          const data = await getDashboardStats();
          setStats(data);
      } catch (error) {
          console.error("Error fetching stats:", error);
      } finally {
          setFetchingData(false);
      }
  }

  const fetchInterviews = async () => {
    setFetchingData(true);
    try {
      const data = await getInterviews();
      setInterviews(data);
    } catch (error) {
      console.error("Error fetching interviews:", error);
      toast.error("Failed to load interviews");
    } finally {
      setFetchingData(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTabChange = (tab: string) => {
      // If leaving create tab reset edit mode unless explicitly editing
      if (tab !== 'create') {
          clearForm();
      }
      router.push(`/admin/dashboard?tab=${tab}`);
  };

  const clearForm = () => {
      setIsEditMode(false);
      setEditingId(null);
      setFormData({
        title: "",
        description: "",
        category: "",
        type: "role",
        difficulty: "Medium",
        duration: "30 Min",
        syllabus: "",
      });
  }

  const handleEdit = (interview: FireStoreInterview) => {
      setIsEditMode(true);
      setEditingId(interview.id);
      setFormData({
          title: interview.title,
          description: interview.description,
          category: interview.category,
          type: interview.type,
          difficulty: interview.difficulty,
          duration: interview.duration,
          syllabus: Array.isArray(interview.syllabus) ? interview.syllabus.join(", ") : interview.syllabus,
      });
      router.push("/admin/dashboard?tab=create");
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const syllabusArray = formData.syllabus.split(",").map((s) => s.trim()).filter((s) => s.length > 0);
      const dataToSubmit = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        type: formData.type,
        difficulty: formData.difficulty,
        duration: formData.duration,
        syllabus: syllabusArray,
      };

      let result;
      if (isEditMode && editingId) {
          // Update existing
           // @ts-ignore
           result = await updateInterview(editingId, dataToSubmit);
           
           if (result.success) {
               setShowUpdateSuccess(true);
               clearForm();
           }
      } else {
          // Add new
          // @ts-ignore
          result = await addInterview(dataToSubmit);
          
          if (result.success) {
              setAddedInterviewTitle(formData.title);
              setShowAddSuccess(true);
              clearForm();
          }
      }

      if (!result.success) {
        toast.error(result.message || `Failed to ${isEditMode ? 'update' : 'add'} interview`);
      }
    } catch (error: any) {
      console.error(`Error ${isEditMode ? 'updating' : 'adding'} interview:`, error);
      toast.error(`Failed to ${isEditMode ? 'update' : 'add'} interview`);
    } finally {
      setLoading(false);
    }
  };

  // Trigger Delete Modal
  const confirmDelete = (id: string) => {
      setDeleteId(id);
      setShowDeleteConfirm(true);
  }

  // Actual Delete Action
  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const result = await deleteInterview(deleteId);
      if (result.success) {
        toast.success("Interview deleted successfully");
        setInterviews((prev) => prev.filter((i) => i.id !== deleteId));
        setShowDeleteConfirm(false);
        setDeleteId(null);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to delete interview");
    }
  };

  return (
    <>
      {/* 1. Add Success Modal */}
      {showAddSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-700 rounded-3xl p-8 max-w-md w-full mx-4 text-center animate-in zoom-in-95 duration-300">
             {/* Add Icon */}
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 animate-pulse"></div>
              <div className="absolute inset-2 rounded-full bg-zinc-900 flex items-center justify-center">
                <Plus className="w-10 h-10 text-emerald-400" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-2">🎉 Interview Created!</h2>
            <p className="text-zinc-400 mb-2">Your new interview has been successfully added to the platform.</p>
            <p className="text-emerald-400 font-semibold text-lg mb-6">"{addedInterviewTitle}"</p>
            
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setShowAddSuccess(false)}
                className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-xl transition-colors"
              >
                Add Another
              </button>
              <button
                onClick={() => { setShowAddSuccess(false); handleTabChange('manage'); }}
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium rounded-xl transition-all"
              >
                View Interviews
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Update Success Modal */}
      {showUpdateSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-700 rounded-3xl p-8 max-w-md w-full mx-4 text-center animate-in zoom-in-95 duration-300">
             {/* Edit Icon */}
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 animate-pulse"></div>
              <div className="absolute inset-2 rounded-full bg-zinc-900 flex items-center justify-center">
                <Edit className="w-10 h-10 text-blue-400" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-2">✨ Update Saved!</h2>
            <p className="text-zinc-400 mb-6">The interview details have been successfully updated.</p>
            
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setShowUpdateSuccess(false)}
                className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-xl transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => { setShowUpdateSuccess(false); handleTabChange('manage'); }}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium rounded-xl transition-all"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-red-900/50 rounded-3xl p-8 max-w-md w-full mx-4 text-center animate-in zoom-in-95 duration-300">
             {/* Delete Icon */}
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full bg-red-500/20 animate-pulse"></div>
              <div className="absolute inset-2 rounded-full bg-zinc-900 flex items-center justify-center border-2 border-red-500/50">
                <Trash2 className="w-10 h-10 text-red-500" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-2">Delete Interview?</h2>
            <p className="text-zinc-400 mb-6">Are you sure you want to delete this interview? This action cannot be undone.</p>
            
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-colors shadow-lg shadow-red-500/20"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">
                {activeTab === 'dashboard' && 'Dashboard Overview'}
                {activeTab === 'manage' && 'Manage Interviews'}
                {activeTab === 'create' && (isEditMode ? 'Edit Interview' : 'Create New Interview')}
            </h1>
            <p className="text-zinc-400 mt-1">
                {activeTab === 'dashboard' && 'Stats and analytics for your interview platform'}
                {activeTab === 'manage' && 'View, edit, and delete existing interviews'}
                {activeTab === 'create' && (isEditMode ? 'Update interview details' : 'Add new interview content to the platform')}
            </p>
          </div>
        </div>

        {/* --- DASHBOARD TAB --- */}
        {activeTab === "dashboard" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {fetchingData ? (
                    <div className="flex justify-center p-12"><div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div></div>
                ) : stats ? (
                    <>
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <List className="w-16 h-16 text-white" />
                                </div>
                                <p className="text-zinc-400 text-sm font-medium">Total Interviews</p>
                                <h3 className="text-4xl font-bold text-white mt-2">{stats.totalInterviews}</h3>
                                <div className="mt-4 text-emerald-500 text-sm font-medium flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Active
                                </div>
                            </div>

                            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Users className="w-16 h-16 text-blue-400" />
                                </div>
                                <p className="text-zinc-400 text-sm font-medium">Total Users</p>
                                <h3 className="text-4xl font-bold text-white mt-2">{stats.totalUsers}</h3>
                                <div className="mt-4 text-blue-400 text-sm font-medium flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-blue-400"></span> Registered
                                </div>
                            </div>

                            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Briefcase className="w-16 h-16 text-purple-400" />
                                </div>
                                <p className="text-zinc-400 text-sm font-medium">Role Based</p>
                                <h3 className="text-4xl font-bold text-white mt-2">{stats.roleBasedCount}</h3>
                                <div className="w-full bg-zinc-800 h-1 mt-4 rounded-full overflow-hidden">
                                    <div className="h-full bg-purple-500" style={{ width: `${(stats.roleBasedCount / stats.totalInterviews) * 100}%` }}></div>
                                </div>
                            </div>

                            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <GraduationCap className="w-16 h-16 text-amber-400" />
                                </div>
                                <p className="text-zinc-400 text-sm font-medium">Skill Based</p>
                                <h3 className="text-4xl font-bold text-white mt-2">{stats.skillBasedCount}</h3>
                                <div className="w-full bg-zinc-800 h-1 mt-4 rounded-full overflow-hidden">
                                     <div className="h-full bg-amber-500" style={{ width: `${(stats.skillBasedCount / stats.totalInterviews) * 100}%` }}></div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div>
                            <h3 className="text-xl font-bold text-white mb-6">Recently Added Interviews</h3>
                            <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
                                <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-zinc-950 border-b border-zinc-800">
                                        <tr>
                                            <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Title</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Category</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Created</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-right">Attended</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-800">
                                        {stats.recentInterviews.map((interview: any) => (
                                            <tr key={interview.id} className="hover:bg-zinc-800/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-white">{interview.title}</div>
                                                    <div className="text-xs text-zinc-500">{interview.type}</div>
                                                </td>
                                                 <td className="px-6 py-4 text-sm text-zinc-300">
                                                    {interview.category}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-zinc-400">
                                                    {new Date(interview.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-800 text-zinc-300">
                                                        {interview.usageCount} users
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                </div>
                            </div>
                        </div>
                    </>
                ) : null}
            </div>
        )}

        {/* --- MANAGE TAB --- */}
        {activeTab === "manage" && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                {fetchingData ? (
                        <div className="text-center py-12 text-zinc-500">Loading interviews...</div>
                ) : interviews.length === 0 ? (
                    <div className="text-center py-12 bg-zinc-900 rounded-2xl border border-zinc-800">
                        <p className="text-zinc-400">No interviews created yet.</p>
                        <button 
                            onClick={() => handleTabChange("create")}
                            className="mt-4 text-emerald-500 hover:text-emerald-400 text-sm font-medium"
                        >
                            Create your first interview
                        </button>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {interviews.map((interview) => (
                            <div key={interview.id} className="bg-zinc-900 rounded-xl border border-zinc-800 p-5 flex items-center justify-between group hover:border-zinc-700 transition-colors">
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="font-semibold text-white">{interview.title}</h3>
                                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-medium border ${
                                            interview.type === 'role' 
                                            ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
                                            : 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                                        }`}>
                                            {interview.type}
                                        </span>
                                    </div>
                                    <p className="text-sm text-zinc-400 line-clamp-1 max-w-xl">{interview.description}</p>
                                    <div className="flex items-center gap-4 mt-3 text-xs text-zinc-500">
                                        <div className="flex items-center gap-1"><Briefcase className="w-3 h-3"/> {interview.category}</div>
                                        <span>•</span>
                                        <span>{interview.duration}</span>
                                        <span>•</span>
                                        <span>{interview.difficulty}</span>
                                        <span className="text-zinc-400 bg-zinc-800 px-2 rounded-full ml-2">
                                            {interview.usageCount || 0} Attended
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                    <button 
                                        onClick={() => handleEdit(interview)}
                                        className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                                        title="Edit Interview"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button 
                                        onClick={() => confirmDelete(interview.id)}
                                        className="p-2 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                                        title="Delete Interview"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        )}
          
        {/* --- CREATE TAB --- */}
        {activeTab === "create" && (
            <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 animate-in fade-in slide-in-from-bottom-4 duration-300 max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                        {isEditMode ? <Edit className="w-5 h-5"/> : <Plus className="w-5 h-5" />}
                    </span>
                    {isEditMode ? 'Edit Interview' : 'Add New Interview'}
                    </h2>

                    {isEditMode && (
                        <button 
                            onClick={clearForm}
                            className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 bg-zinc-800 px-3 py-1.5 rounded-full"
                        >
                            <X className="w-3 h-3" /> Cancel Edit
                        </button>
                    )}
                </div>

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
                    <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">Type</label>
                    <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-emerald-500 transition-colors appearance-none"
                    >
                        <option value="role">Role Based</option>
                        <option value="skill">Skill Based</option>
                    </select>
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
                        {loading 
                            ? (isEditMode ? "Updating..." : "Adding Interview...") 
                            : (isEditMode ? "Update Interview" : "Add Interview & Store")
                        }
                    </button>
                </div>
                </form>
            </div>
        )}

      </div>
    </>
  );
};

export default AdminDashboard;
