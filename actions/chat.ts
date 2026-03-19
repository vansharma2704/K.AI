"use server"

import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemma-3-27b-it" });

export async function chatWithAssistant(message: string, context: any) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const prompt = `
You are an AI Career Assistant. The user has just performed a Job Match analysis.
Context of the latest analysis:
- Role: ${context.detectedRole || "Unknown"}
- Match Score: ${context.matchScore}%
- Missing Skills: ${context.missingSkills?.join(", ") || "None"}
- Matching Skills: ${context.matchingSkills?.join(", ") || "None"}

User Question: "${message}"

Rules:
- Give short, actionable career advice.
- Focus on how to improve the match score for this specific role.
- Be encouraging and professional.
- Use markdown for formatting.
- Keep the response under 150 words.
  `.trim();

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Chat error:", error);
    throw new Error("Failed to get response from AI assistant.");
  }
}
