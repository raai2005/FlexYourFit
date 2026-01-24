"use server";

import { db } from "@/Firebase/admin";
import { FieldValue } from "firebase-admin/firestore";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

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
    // Generate JWT
    const secret = new TextEncoder().encode(process.env.ADMIN_SECRET || process.env.ADMIN_PASS || "fallback_secret_do_not_use_in_prod");
    const token = await new SignJWT({ role: "admin" })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(secret);

    // Set Cookie
    (await cookies()).set("admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
      sameSite: "strict",
    });

    return { success: true };
  }

  return { success: false, message: "Invalid admin credentials" };
}

export async function adminLogout() {
  (await cookies()).delete("admin_session");
  return { success: true };
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
      usageCount: 0, // Initialize usage count
      createdAt: new Date().toISOString(),
    };

    const docRef = await db.collection("interviews").add(interviewData);
    
    return { success: true, id: docRef.id };
  } catch (error: any) {
    console.error("Error adding interview:", error);
    return { success: false, message: error.message || "Failed to add interview" };
  }
}

export async function deleteInterview(id: string) {
  try {
    await db.collection("interviews").doc(id).delete();
    return { success: true, message: "Interview deleted successfully" };
  } catch (error: any) {
    console.error("Error deleting interview:", error);
    return { success: false, message: error.message || "Failed to delete interview" };
  }
}

export async function incrementInterviewUsage(id: string) {
    try {
        await db.collection("interviews").doc(id).update({
            usageCount: FieldValue.increment(1)
        });
        return { success: true };
    } catch (error) {
        console.error("Error incrementing usage:", error);
        return { success: false };
    }
}

export async function updateInterview(id: string, data: Partial<NewInterviewData>) {
    try {
        await db.collection("interviews").doc(id).update(data);
        return { success: true, message: "Interview updated successfully" };
    } catch (error: any) {
         console.error("Error updating interview:", error);
         return { success: false, message: error.message || "Failed to update interview" };
    }
}

export async function getDashboardStats() {
    try {
        const interviewsSnapshot = await db.collection("interviews").get();
        if (interviewsSnapshot.empty) {
             return {
                totalInterviews: 0,
                totalUsers: 0, // Mock for now or implement user collection later
                roleBasedCount: 0,
                skillBasedCount: 0,
                recentInterviews: []
            };
        }

        let totalInterviews = 0;
        let roleBasedCount = 0;
        let skillBasedCount = 0;
        const interviews: any[] = [];

        interviewsSnapshot.forEach(doc => {
            const data = doc.data();
            totalInterviews++;
            if (data.type === 'role') roleBasedCount++;
            if (data.type === 'skill') skillBasedCount++;

            interviews.push({
                id: doc.id,
                ...data,
                // Ensure usageCount exists
                usageCount: data.usageCount || 0
            });
        });

        // Sort by createdAt desc for recent
        interviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        const recentInterviews = interviews.slice(0, 3);

        return {
            totalInterviews,
            totalUsers: 0, // Set to 0 until user collection is implemented
            roleBasedCount,
            skillBasedCount,
            recentInterviews
        };

    } catch (error) {
        console.error("Error fetching stats:", error);
         return {
            totalInterviews: 0,
            totalUsers: 0,
            roleBasedCount: 0,
            skillBasedCount: 0,
            recentInterviews: []
        };
    }
}
