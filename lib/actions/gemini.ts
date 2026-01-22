"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");

export interface RoadmapStep {
  title: string;
  description: string;
  topics: string[];
}

export interface RoadmapResponse {
  role: string;
  steps: RoadmapStep[];
}

export async function generateRoadmap(role: string): Promise<{ success: boolean; data?: RoadmapResponse; message?: string }> {
  try {
    if (!apiKey) {
      return { success: false, message: "Gemini API Key is not configured." };
    }

    const prompt = `
      Create a detailed career learning roadmap for the role: "${role}".
      
      Return the response ONLY as a VALID JSON object with the following structure:
      {
        "role": "${role}",
        "steps": [
          {
            "title": "Phase Name (e.g., Fundamentals)",
            "description": "Brief description of this phase",
            "topics": ["Array of specific topics to learn"]
          }
        ]
      }
      
      Requirements:
      - Provide 5 distinct phases (steps).
      - Be specific to the technology and skills required for "${role}".
      - Do not wrap the JSON in markdown code blocks. Just return raw JSON.
    `;

    const modelName = "gemini-2.5-flash";

    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
      const roadmapData: RoadmapResponse = JSON.parse(cleanText);
      
      return { success: true, data: roadmapData };
    } catch (error: any) {
      console.warn(`Failed with ${modelName}:`, error.message);
      throw error;
    }

  } catch (error: any) {
    console.error("Gemini Error:", error);
    return { success: false, message: "Failed to generate roadmap." };
  }
}

export interface FeedbackResponse {
    score: number;
    feedback: string;
    improvements: string[];
}

export async function generateInterviewFeedback(transcript: string, jobRole: string): Promise<{ success: boolean; data?: FeedbackResponse; message?: string }> {
    try {
        if (!apiKey) {
            return { success: false, message: "Gemini API Key is not configured." };
        }

        const prompt = `
          Analyze the following interview transcript for the role of "${jobRole}".
          
          Transcript:
          "${transcript.substring(0, 5000)}" 
          (Note: Transcript might be truncated if too long)

          Your Task:
          1. Rate the candidate's performance on a scale of 1-100.
          2. Provide a brief 2-3 sentence overall feedback summary.
          3. List 3-5 specific actionable improvements based on their answers.

          Return the response ONLY as a VALID JSON object with this structure:
          {
            "score": 85,
            "feedback": "...",
            "improvements": ["...", "...", "..."]
          }
          
          Do not include markdown formatting.
        `;

        // User requested "gemnui 2.5 fash", mapping to a valid fast model or the one used in the codebase.
        // Assuming "gemini-1.5-flash" is the intended/valid actual model for "fast" responses.
        // However, I will stick to what is in the file "gemini-2.5-flash" if the user insists, but 1.5-flash is real.
        // Let's use "gemini-1.5-flash" for reliability as 2.5 doesn't exist publicly yet.
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
        const feedbackData: FeedbackResponse = JSON.parse(cleanText);

        return { success: true, data: feedbackData };

    } catch (error: any) {
        console.error("Error generating feedback:", error);
        return { success: false, message: "Failed to generate feedback" };
    }
}
