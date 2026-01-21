"use server";

import { db } from "@/Firebase/admin";

export async function verifyAdminCredentials(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const adminId = process.env.ADMIN_ID;
  const adminPass = process.env.ADMIN_PASS;
  
  // Basic validation
  if (!email || !password) {
      return { success: false, message: "Missing credentials" };
  }

  if (email === adminId && password === adminPass) {
    return { success: true };
  }

  return { success: false, message: "Invalid admin credentials" };
}

export interface NewInterviewData {
  title: string;
  description: string;
  category: string;
  type: "role" | "skill";
  difficulty: "Easy" | "Medium" | "Hard";
  duration: string;
  syllabus: string[];
}

export async function addInterview(data: NewInterviewData) {
  try {
    const interviewData = {
      ...data,
      createdAt: new Date().toISOString(),
    };

    const docRef = await db.collection("interviews").add(interviewData);
    
    return { success: true, id: docRef.id };
  } catch (error: any) {
    console.error("Error adding interview:", error);
    return { success: false, message: error.message || "Failed to add interview" };
  }
}
