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
      You are an expert career counselor. 
      Your task is to generate a learning roadmap for the user's request: "${role}".
      
      First, validate if "${role}" is a valid career role, job title, technology, skill, or technical field.
      If it is meaningless, gibberish, offensive, or clearly not a career-related topic (e.g. "dhfjsdh", "hello", "I love you"), 
      return this EXACT JSON response:
      {
        "role": "INVALID",
        "steps": []
      }

      If valid, generate a detailed learning roadmap.
      Return the response ONLY as a VALID JSON object with the following structure:
      {
        "role": "${role}" (or a corrected, professional title, e.g. "react" -> "React Developer"),
        "steps": [
          {
            "title": "Phase Name (e.g., Fundamentals)",
            "description": "Brief description of this phase",
            "topics": ["Array of specific topics to learn"]
          }
        ]
      }
      
      Requirements for the roadmap:
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
      
      if (roadmapData.role === "INVALID") {
        return { success: false, message: "Please enter a valid role, skill, or technology." };
      }

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
    good_parts: string[];
    improvements: string[];
    motivation: string;
}

export async function generateInterviewFeedback(transcript: string, jobRole: string, syllabus: string[] = []): Promise<{ success: boolean; data?: FeedbackResponse; message?: string }> {
    try {
        if (!apiKey) {
            return { success: false, message: "Gemini API Key is not configured." };
        }

        const prompt = `
          Analyze the following interview transcript for the role of "${jobRole}".
          Context/Syllabus: ${syllabus.join(", ")}
          
          Transcript:
          "${transcript.substring(0, 5000)}" 
          (Note: Transcript might be truncated if too long)

          Your Task is to provide a detailed evaluation in the following JSON format:
          1. **score**: Rate the candidate's performance on a scale of 1-100 (integer).
          2. **feedback**: A concise 2-3 sentence overall summary of their performance.
          3. **good_parts**: A list of 2-3 specific concepts or skills the candidate demonstrated well.
          4. **improvements**: A list of 3-5 specific actionable areas for improvement or missing concepts.
          5. **motivation**: A very short, punchy motivational quote or phrase (max 5 words) to encourage them.

          Return the response ONLY as a VALID JSON object with this structure:
          {
            "score": 85,
            "feedback": "...",
            "good_parts": ["...", "..."],
            "improvements": ["...", "...", "..."],
            "motivation": "Keep pushing, you're close!"
          }
          
          Do not include markdown formatting.
        `;

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        
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
