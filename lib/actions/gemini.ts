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

    const models = ["gemini-1.5-flash", "gemini-pro"];
    let finalError;

    for (const modelName of models) {
        try {
            console.log(`Attempting with model: ${modelName}`);
            const model = genAI.getGenerativeModel({ model: modelName });
            
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            console.log(`Success with ${modelName}`);
            
            const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
            const roadmapData: RoadmapResponse = JSON.parse(cleanText);
            
            return { success: true, data: roadmapData };
        } catch (error: any) {
            console.warn(`Failed with ${modelName}:`, error.message);
            finalError = error;
            // Continue to next model
        }
    }
    
    throw finalError;

  } catch (error: any) {
    console.error("Gemini API exceeded/failed. Using Fallback Data for demonstration.");
    
    // FALLBACK MOCK DATA to ensure UI works for the user
    // This allows them to see the feature even if their API key doesn't have the right permissions
    const mockRoadmap: RoadmapResponse = {
        role: role,
        steps: [
            {
                title: "Fundamentals (Fallback)",
                description: "Master the core concepts required for " + role + ". (Note: This is a placeholder because the AI API failed).",
                topics: ["Core Concepts", "Basic Syntax", "Environment Setup"]
            },
            {
                title: "Advanced Topics",
                description: "Deep dive into complex areas.",
                topics: ["Advanced Patterns", "Performance", "Security"]
            },
            {
                title: "Frameworks & Tools",
                description: "Industry standard tools.",
                topics: ["Popular Frameworks", "Testing", "Deployment"]
            },
            {
                title: "Real-world Projects",
                description: "Build something specific.",
                topics: ["Full Stack App", "API Integration", "Database Design"]
            },
            {
                title: "Interview Prep",
                description: "Get ready for the job.",
                topics: ["System Design", "Behavioral Questions", "Mock Interviews"]
            }
        ]
    };
    
    return { 
        success: true, 
        data: mockRoadmap,
        message: "Generated using fallback data (Gemini API unavailable)." 
    };
  }
}
