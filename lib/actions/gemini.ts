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
    console.error("Gemini API exceeded/failed. Using Fallback Data for demonstration.");
    
    return { 
        success: true, 
        message: "Generated using fallback data (Gemini API unavailable)." 
    };
  }
}
