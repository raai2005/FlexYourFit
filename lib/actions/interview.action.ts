"use server";

import { db } from "@/Firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

export interface FireStoreInterview {
  id: string;
  title: string;
  description: string;
  category: string;
  type: "role" | "skill";
  difficulty: "Easy" | "Medium" | "Hard";
  duration: string;
  syllabus: string[];
  createdAt: string;
  usageCount: number;
}
// ... (rest of file)

export async function getInterviews() {
  try {
    const interviewsSnapshot = await db.collection("interviews").get();
    
    if (interviewsSnapshot.empty) {
      return [];
    }

    const interviews = interviewsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return interviews as FireStoreInterview[];
  } catch (error) {
    console.error("Error fetching interviews:", error);
    return [];
  }
}

export async function getInterviewById(id: string): Promise<FireStoreInterview | null> {
  try {
    const docRef = await db.collection("interviews").doc(id).get();
    
    if (!docRef.exists) {
      return null;
    }

    return {
      id: docRef.id,
      ...docRef.data(),
    } as FireStoreInterview;
  } catch (error) {
    console.error("Error fetching interview by ID:", error);
    return null;
  }
}

export async function seedInterviews() {
    const MOCK_INTERVIEWS = [
        {
          title: "Frontend Developer",
          description: "Prepare for a generic frontend developer interview covering React, HTML/CSS, and JavaScript fundamentals.",
          category: "Engineering",
          difficulty: "Medium",
          duration: "45 min",
          syllabus: ["React Hooks", "CSS Grid/Flexbox", "ES6+ Features", "Performance Optimization"],
          createdAt: new Date().toISOString()
        },
        {
          title: "System Design",
          description: "Design scalable systems. Topics include load balancing, database sharding, and caching strategies.",
          category: "Architecture",
          difficulty: "Hard",
          duration: "60 min",
          syllabus: ["Load Balancing", "Caching", "Database Sharding", "API Design"],
          createdAt: new Date().toISOString()
        },
        {
          title: "Behavioral Interview",
          description: "Common behavioral questions using the STAR method. Great for all roles.",
          category: "HR",
          difficulty: "Easy",
          duration: "30 min",
          syllabus: ["Conflict Resolution", "Leadership", "Teamwork", "Career Goals"],
          createdAt: new Date().toISOString()
        }
      ];

      try {
        const batch = db.batch();
        
        MOCK_INTERVIEWS.forEach((interview) => {
            const docRef = db.collection("interviews").doc();
            batch.set(docRef, interview);
        })

        await batch.commit();
        return { success: true, message: "Interviews seeded successfully" };
      } catch (error) {
        console.error("Error seeding interviews:", error);
        return { success: false, message: "Failed to seed interviews" };  
      }
}

export async function trackInterviewStart(interviewId: string, userId: string) {
    try {
        const batch = db.batch();
        
        // 1. Increment Interview Usage Count
        const interviewRef = db.collection("interviews").doc(interviewId);
        batch.update(interviewRef, {
            usageCount: FieldValue.increment(1)
        });

        // 2. Increment User Completed Count (and potentially store session history later)
        if (userId) {
            const userRef = db.collection("users").doc(userId);
            
            // 2a. Get Interview Details for Snapshot
            const interviewSnapshot = await interviewRef.get();
            const interviewData = interviewSnapshot.data();

            if (interviewData) {
                // 2b. Check if Session Document exists
                const sessionRef = userRef.collection("interviews").doc(interviewId);
                const sessionDoc = await sessionRef.get();

                if (sessionDoc.exists) {
                    // Update existing -> Increment attempts, update startedAt
                    batch.update(sessionRef, {
                        attempts: FieldValue.increment(1),
                        startedAt: new Date().toISOString(),
                        status: "started",
                        // Reset simple status fields if needed, but keep history if strictly overwrite
                        interviewTitle: interviewData.title || "Unknown Interview",
                    });
                } else {
                    // Create new
                    const sessionData = {
                        id: interviewId, // Use interviewId as doc ID
                        interviewId: interviewId,
                        interviewTitle: interviewData.title || "Unknown Interview",
                        category: interviewData.category || "General",
                        difficulty: interviewData.difficulty || "Medium",
                        startedAt: new Date().toISOString(),
                        status: "started",
                        attempts: 1 
                    };
                    batch.set(sessionRef, sessionData);
                }

                // 2c. Update User Aggregate Stats
                batch.set(userRef, { 
                    lastActiveAt: new Date().toISOString()
                }, { merge: true });

                await batch.commit();
                return { success: true, sessionId: interviewId };
            }
        }

        await batch.commit();
        return { success: true };
    } catch (error) {
        console.error("Error tracking interview start:", error);
        return { success: false };
    }
}

// New function to mark interview as completed (initially just status and transcript)
export async function completeInterviewSession(userId: string, sessionId: string, transcript: { role: string; content: string }[]) {
    try {
        const sessionRef = db.collection("users").doc(userId).collection("interviews").doc(sessionId);
        const userRef = db.collection("users").doc(userId);

        const batch = db.batch();

        // 1. Update Session Status
        batch.update(sessionRef, {
            status: "completed",
            endedAt: new Date().toISOString(),
            transcript: transcript,
            // Score and feedback will be added later when the user clicks "Save Feedback"
        });

        // 2. Increment User Completed Count
        batch.set(userRef, {
            completedInterviews: FieldValue.increment(1)
        }, { merge: true });

        await batch.commit();
        return { success: true };
    } catch (error) {
        console.error("Error completing interview session:", error);
        return { success: false };
    }
}

export interface DetailedFeedbackData {
    score: number;
    feedback: string;
    good_parts: string[];
    improvements: string[];
    motivation: string;
}

export async function saveDetailedFeedback(userId: string, sessionId: string, feedbackData: DetailedFeedbackData) {
  try {
    const sessionRef = db.collection("users").doc(userId).collection("interviews").doc(sessionId);
    
    await sessionRef.update({
        score: feedbackData.score,
        feedback: feedbackData.feedback,
        good_parts: feedbackData.good_parts || [],
        improvements: feedbackData.improvements || [],
        motivation: feedbackData.motivation || "",
        feedbackSavedAt: new Date().toISOString()
    });

    return { success: true };
  } catch (error) {
    console.error('Error saving detailed feedback:', error);
    return { success: false };
  }
}

export async function getUserInterviewSession(userId: string, sessionId: string) {
    try {
        const docRef = await db.collection("users").doc(userId).collection("interviews").doc(sessionId).get();
        if (docRef.exists) {
            return { id: docRef.id, ...docRef.data() };
        }
        return null;
    } catch (error) {
        console.error("Error fetching user session:", error);
        return null;
    }
}

export async function getUserStats(userId: string) {
    try {
        const userDoc = await db.collection("users").doc(userId).get();
        if (!userDoc.exists) {
            return { completedInterviews: 0 };
        }
        return userDoc.data() as { completedInterviews: number };
    } catch (error) {
        console.error("Error fetching user stats:", error);
        return { completedInterviews: 0 };
    }
}
export async function getUserPastInterviews(userId: string) {
    try {
        const sessionsRef = db.collection("users").doc(userId).collection("interviews");
        const snapshot = await sessionsRef.orderBy("startedAt", "desc").get();

        if (snapshot.empty) {
            return [];
        }

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error("Error fetching past interviews:", error);
        return [];
    }
}
