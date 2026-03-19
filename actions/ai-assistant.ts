"use server";

import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemma-3-27b-it" });

export async function getKaiAssistantResponse(message: string, history: { role: string, content: string }[]) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const systemPrompt = `
You are K.AI, a professional and encouraging AI career assistant for the "Senpai" platform.
Your goal is to help users with career guidance, resume improvement, skill recommendations, and interview preparation.

Core Personality:
- Professional yet friendly and mentoring.
- Concise and actionable.
- Encouraging and supportive.

Guidelines:
- If asked about careers, provide data-driven insights.
- If asked about resumes, give specific formatting or content tips.
- If asked about interviews, offer behavioral or technical prep advice.
- Use markdown for formatting (bold, lists, etc.).
- Keep responses relatively brief (under 200 words) unless a longer explanation is required.
- Do not make up facts; if you don't know something specific about the platform's features, stick to general career best practices.

User's current message: "${message}"
`.trim();

    try {
        // Prepare chat history for Gemini if needed, or just send a combined prompt
        // For simplicity and better control over the persona, we'll use a single prompt for now
        // including the last few messages for context.
        
        const contextStr = history.slice(-5).map(m => `${m.role === 'user' ? 'User' : 'K.AI'}: ${m.content}`).join("\n");
        
        const finalPrompt = `
${systemPrompt}

Recent Conversation History:
${contextStr}

K.AI Response:
`.trim();

        const result = await model.generateContent(finalPrompt);
        return result.response.text();
    } catch (error: any) {
        console.error("K.AI Assistant Error:", error);
        throw new Error("Failed to get response from K.AI. Please try again.");
    }
}
