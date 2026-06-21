"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { addInterview, deleteInterview, getDashboardStats, updateInterview } from "@/lib/actions/admin";
import { getInterviews, FireStoreInterview } from "@/lib/actions/interview.action";
import { Trash2, Edit, Plus, List, Users, Briefcase, GraduationCap, X } from "lucide-react";

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

const AdminDashboardContent = () => {
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
  };

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTabChange = (tab: string) => {
    // If leaving create tab reset edit mode unless explicitly editing
    if (tab !== "create") {
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
  };

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
      syllabus: Array.isArray(interview.syllabus)
        ? interview.syllabus.join(", ")
        : interview.syllabus,
    });
    router.push("/admin/dashboard?tab=create");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const syllabusArray = formData.syllabus
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
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
        toast.error(result.message || `Failed to ${isEditMode ? "update" : "add"} interview`);
      }
    } catch (error: any) {
      console.error(`Error ${isEditMode ? "updating" : "adding"} interview:`, error);
      toast.error(`Failed to ${isEditMode ? "update" : "add"} interview`);
    } finally {
      setLoading(false);
    }
  };

  // Trigger Delete Modal
  const confirmDelete = (id: string) => {
    setDeleteId(id);
    setShowDeleteConfirm(true);
  };

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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="surface-card rounded-3xl p-8 max-w-md w-full text-center animate-in zoom-in-95 duration-300">
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 animate-pulse" />
              <div className="absolute inset-2 rounded-full bg-surface grid place-items-center">
                <Plus className="w-10 h-10 text-emerald-400" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-fg mb-2">🎉 Interview Created!</h2>
            <p className="text-fg-muted mb-2">
              Your new interview has been successfully added to the platform.
            </p>
            <p className="text-emerald-300 font-semibold text-lg mb-6">"{addedInterviewTitle}"</p>

            <div className="flex gap-3 justify-center">
              <button onClick={() => setShowAddSuccess(false)} className="btn btn-secondary h-11 px-6">
                Add Another
              </button>
              <button
                onClick={() => {
                  setShowAddSuccess(false);
                  handleTabChange("manage");
                }}
                className="btn btn-primary h-11 px-6"
              >
                View Interviews
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Update Success Modal */}
      {showUpdateSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="surface-card rounded-3xl p-8 max-w-md w-full text-center animate-in zoom-in-95 duration-300">
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 animate-pulse" />
              <div className="absolute inset-2 rounded-full bg-surface grid place-items-center">
                <Edit className="w-10 h-10 text-brand-bright" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-fg mb-2">✨ Update Saved!</h2>
            <p className="text-fg-muted mb-6">The interview details have been successfully updated.</p>

            <div className="flex gap-3 justify-center">
              <button onClick={() => setShowUpdateSuccess(false)} className="btn btn-secondary h-11 px-6">
                Close
              </button>
              <button
                onClick={() => {
                  setShowUpdateSuccess(false);
                  handleTabChange("manage");
                }}
                className="btn btn-primary h-11 px-6"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-surface border border-red-900/50 rounded-3xl p-8 max-w-md w-full text-center animate-in zoom-in-95 duration-300 shadow-[var(--shadow-lg)]">
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full bg-red-500/20 animate-pulse" />
              <div className="absolute inset-2 rounded-full bg-surface grid place-items-center border-2 border-red-500/50">
                <Trash2 className="w-10 h-10 text-red-400" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-fg mb-2">Delete Interview?</h2>
            <p className="text-fg-muted mb-6">
              Are you sure you want to delete this interview? This action cannot be undone.
            </p>

            <div className="flex gap-3 justify-center">
              <button onClick={() => setShowDeleteConfirm(false)} className="btn btn-secondary h-11 px-6">
                Cancel
              </button>
              <button onClick={handleDelete} className="btn btn-danger h-11 px-6">
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-fg tracking-tight">
              {activeTab === "dashboard" && "Dashboard Overview"}
              {activeTab === "manage" && "Manage Interviews"}
              {activeTab === "create" && (isEditMode ? "Edit Interview" : "Create New Interview")}
            </h1>
            <p className="text-fg-muted mt-1">
              {activeTab === "dashboard" && "Stats and analytics for your interview platform"}
              {activeTab === "manage" && "View, edit, and delete existing interviews"}
              {activeTab === "create" &&
                (isEditMode ? "Update interview details" : "Add new interview content to the platform")}
            </p>
          </div>
        </div>

        {/* --- DASHBOARD TAB --- */}
        {activeTab === "dashboard" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {fetchingData ? (
              <div className="flex justify-center p-12">
                <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin" />
              </div>
            ) : stats ? (
              <>
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="surface-card p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <List className="w-16 h-16 text-fg" />
                    </div>
                    <p className="text-fg-muted text-sm font-medium">Total Interviews</p>
                    <h3 className="text-4xl font-bold text-fg mt-2">{stats.totalInterviews}</h3>
                    <div className="mt-4 text-emerald-400 text-sm font-medium flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" /> Active
                    </div>
                  </div>

                  <div className="surface-card p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Users className="w-16 h-16 text-blue-400" />
                    </div>
                    <p className="text-fg-muted text-sm font-medium">Total Users</p>
                    <h3 className="text-4xl font-bold text-fg mt-2">{stats.totalUsers}</h3>
                    <div className="mt-4 text-blue-400 text-sm font-medium flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-blue-400" /> Registered
                    </div>
                  </div>

                  <div className="surface-card p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Briefcase className="w-16 h-16 text-violet-400" />
                    </div>
                    <p className="text-fg-muted text-sm font-medium">Role Based</p>
                    <h3 className="text-4xl font-bold text-fg mt-2">{stats.roleBasedCount}</h3>
                    <div className="w-full bg-surface-2 h-1 mt-4 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-violet-500"
                        style={{ width: `${(stats.roleBasedCount / stats.totalInterviews) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="surface-card p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <GraduationCap className="w-16 h-16 text-amber-400" />
                    </div>
                    <p className="text-fg-muted text-sm font-medium">Skill Based</p>
                    <h3 className="text-4xl font-bold text-fg mt-2">{stats.skillBasedCount}</h3>
                    <div className="w-full bg-surface-2 h-1 mt-4 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500"
                        style={{ width: `${(stats.skillBasedCount / stats.totalInterviews) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div>
                  <h3 className="text-xl font-bold text-fg mb-6">Recently Added Interviews</h3>
                  <div className="surface-card overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead className="bg-surface-2 border-b border-line">
                          <tr>
                            <th className="px-6 py-4 text-xs font-semibold text-fg-subtle uppercase tracking-wider">Title</th>
                            <th className="px-6 py-4 text-xs font-semibold text-fg-subtle uppercase tracking-wider">Category</th>
                            <th className="px-6 py-4 text-xs font-semibold text-fg-subtle uppercase tracking-wider">Created</th>
                            <th className="px-6 py-4 text-xs font-semibold text-fg-subtle uppercase tracking-wider text-right">Attended</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-line">
                          {stats.recentInterviews.map((interview: any) => (
                            <tr key={interview.id} className="hover:bg-surface-2 transition-colors">
                              <td className="px-6 py-4">
                                <div className="font-medium text-fg">{interview.title}</div>
                                <div className="text-xs text-fg-subtle">{interview.type}</div>
                              </td>
                              <td className="px-6 py-4 text-sm text-fg-muted">{interview.category}</td>
                              <td className="px-6 py-4 text-sm text-fg-subtle">
                                {new Date(interview.createdAt).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 text-right">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-surface-2 text-fg-muted border border-line">
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
              <div className="text-center py-12 text-fg-subtle">Loading interviews...</div>
            ) : interviews.length === 0 ? (
              <div className="text-center py-12 surface-card">
                <p className="text-fg-muted">No interviews created yet.</p>
                <button
                  onClick={() => handleTabChange("create")}
                  className="mt-4 text-brand-bright hover:text-indigo-300 text-sm font-medium"
                >
                  Create your first interview
                </button>
              </div>
            ) : (
              <div className="grid gap-4">
                {interviews.map((interview) => (
                  <div
                    key={interview.id}
                    className="surface-card p-5 flex items-center justify-between group hover:border-line-strong transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold text-fg">{interview.title}</h3>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] uppercase font-semibold border ${
                            interview.type === "role"
                              ? "bg-indigo-500/10 text-indigo-300 border-indigo-500/25"
                              : "bg-violet-500/10 text-violet-300 border-violet-500/25"
                          }`}
                        >
                          {interview.type}
                        </span>
                      </div>
                      <p className="text-sm text-fg-muted line-clamp-1 max-w-xl">{interview.description}</p>
                      <div className="flex items-center gap-4 mt-3 text-xs text-fg-subtle">
                        <div className="flex items-center gap-1">
                          <Briefcase className="w-3 h-3" /> {interview.category}
                        </div>
                        <span>•</span>
                        <span>{interview.duration}</span>
                        <span>•</span>
                        <span>{interview.difficulty}</span>
                        <span className="text-fg-muted bg-surface-2 px-2 rounded-full ml-2 border border-line">
                          {interview.usageCount || 0} Attended
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(interview)}
                        className="p-2 rounded-lg text-fg-muted hover:text-fg hover:bg-surface-2 transition-colors"
                        title="Edit Interview"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => confirmDelete(interview.id)}
                        className="p-2 rounded-lg text-fg-muted hover:text-red-400 hover:bg-red-400/10 transition-colors"
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
          <div className="surface-card p-6 animate-in fade-in slide-in-from-bottom-4 duration-300 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-fg flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-brand-soft text-brand-bright grid place-items-center border border-indigo-500/20">
                  {isEditMode ? <Edit className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </span>
                {isEditMode ? "Edit Interview" : "Add New Interview"}
              </h2>

              {isEditMode && (
                <button
                  onClick={clearForm}
                  className="text-xs text-fg-muted hover:text-fg flex items-center gap-1 bg-surface-2 px-3 py-1.5 rounded-full border border-line"
                >
                  <X className="w-3 h-3" /> Cancel Edit
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-fg-muted mb-1.5">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="field"
                    placeholder="e.g. Frontend React Developer"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-fg-muted mb-1.5">Category</label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="field"
                    placeholder="e.g. Engineering"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-fg-muted mb-1.5">Type</label>
                  <select name="type" value={formData.type} onChange={handleChange} className="field">
                    <option value="role">Role Based</option>
                    <option value="skill">Skill Based</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-fg-muted mb-1.5">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="field"
                  placeholder="Comprehensive assessment of React..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-fg-muted mb-1.5">Difficulty</label>
                  <select name="difficulty" value={formData.difficulty} onChange={handleChange} className="field">
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-fg-muted mb-1.5">Duration</label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className="field"
                    placeholder="e.g. 45 Min"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-fg-muted mb-1.5">
                  Syllabus (Comma separated)
                </label>
                <textarea
                  name="syllabus"
                  value={formData.syllabus}
                  onChange={handleChange}
                  rows={3}
                  className="field"
                  placeholder="React Hooks, Context API, Redux, Performance Optimization..."
                  required
                />
                <p className="text-xs text-fg-subtle mt-1">Separate topics with commas</p>
              </div>

              <div className="flex justify-end pt-4">
                <button type="submit" disabled={loading} className="btn btn-primary h-11 px-8">
                  {loading
                    ? isEditMode
                      ? "Updating..."
                      : "Adding Interview..."
                    : isEditMode
                    ? "Update Interview"
                    : "Add Interview & Store"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  );
};

const AdminDashboard = () => {
  return (
    <React.Suspense
      fallback={
        <div className="flex justify-center p-12">
          <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <AdminDashboardContent />
    </React.Suspense>
  );
};

export default AdminDashboard;
