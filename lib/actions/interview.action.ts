"use server";

import { db } from "@/Firebase/admin";

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
}

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
