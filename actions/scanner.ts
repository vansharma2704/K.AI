"use server"

import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import pdf from "pdf-parse";
import mammoth from "mammoth";
import { db } from "@/lib/prisma";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemma-3-27b-it" });

export async function analyzeResume(formData: FormData) {
  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) throw new Error("User not authenticated");

  const user = await db.user.findUnique({ where: { clerkUserId } });
  if (!user) throw new Error("User not found");

  const file = formData.get("file") as File;
  if (!file) throw new Error("No file uploaded");

  const buffer = Buffer.from(await file.arrayBuffer());
  let resumeText = "";

  if (file.type === "application/pdf") {
    try {
      const data = await pdf(buffer);
      resumeText = data.text;
    } catch (e: any) {
      throw new Error("Failed to read PDF file. It might be corrupted or protected.");
    }
  } else if (
    file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    try {
      const data = await mammoth.extractRawText({ buffer });
      resumeText = data.value;
    } catch (e: any) {
      throw new Error("Failed to read DOCX file. It might be corrupted or protected.");
    }
  } else {
    throw new Error("Unsupported file type. Please upload a PDF or DOCX.");
  }

  if (!resumeText || resumeText.trim().length < 50) {
    throw new Error("The resume appears to be empty or too short for analysis.");
  }

  const prompt = `
You are an expert ATS (Applicant Tracking System) analyst and career coach.
Analyze the following resume and return a comprehensive JSON analysis.

Resume Text:
"""
${resumeText.substring(0, 8000)}
"""

Industry: ${user.industry || "General"}

Return ONLY a raw JSON object with EXACTLY this structure (no markdown, no explanation):
{
  "atsScore": <overall number 0-100>,
  "breakdown": {
    "formatting": <number 0-100>,
    "keywords": <number 0-100>,
    "experience": <number 0-100>,
    "skills": <number 0-100>
  },
  "missingKeywords": [<string>, <string>, ...],
  "skillGaps": [<string>, ...],
  "improvementTips": [<string>, ...],
  "strengths": [<string>, ...],
  "weaknesses": [<string>, ...],
  "bulletSuggestions": [
    { "original": "<exact bullet text from resume>", "improved": "<enhanced version with metrics and action verbs>" },
    { "original": "<exact bullet text from resume>", "improved": "<enhanced version with metrics and action verbs>" },
    { "original": "<exact bullet text from resume>", "improved": "<enhanced version with metrics and action verbs>" }
  ]
}

Guidelines:
- atsScore and breakdown scores must be realistic (not all above 90).
- missingKeywords: 5-8 specific tech keywords/tools missing from the resume.
- bulletSuggestions: pick 3 actual bullets from the resume and rewrite them with quantified results, strong action verbs, and STAR format. If no bullets found, suggest 3 generic improvements.
- Keep all arrays concise (3-6 items each).
- Return ONLY the JSON, nothing else.
  `.trim();

  try {
    const result = await model.generateContent(prompt);
    const rawText = result.response.text().trim();

    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("No JSON in AI response:", rawText.substring(0, 500));
      throw new Error("AI returned an unexpected format. Please try again.");
    }

    const analysis = JSON.parse(jsonMatch[0]);

    // Normalize all fields with fallbacks
    if (typeof analysis.atsScore !== "number") analysis.atsScore = 0;
    analysis.breakdown = analysis.breakdown || { formatting: 0, keywords: 0, experience: 0, skills: 0 };
    analysis.breakdown.formatting = analysis.breakdown.formatting || 0;
    analysis.breakdown.keywords = analysis.breakdown.keywords || 0;
    analysis.breakdown.experience = analysis.breakdown.experience || 0;
    analysis.breakdown.skills = analysis.breakdown.skills || 0;
    analysis.missingKeywords = analysis.missingKeywords || [];
    analysis.skillGaps = analysis.skillGaps || [];
    analysis.improvementTips = analysis.improvementTips || [];
    analysis.strengths = analysis.strengths || [];
    analysis.weaknesses = analysis.weaknesses || [];
    analysis.bulletSuggestions = analysis.bulletSuggestions || [];

    // Try to save to DB silently
    try {
      const dbAny = db as any;
      const modelRef = dbAny.resumeAnalysis || dbAny.atsAnalysis || dbAny.aTSAnalysis;
      if (modelRef) {
        await modelRef.create({
          data: {
            userId: user.id,
            score: analysis.atsScore,
            missingKeywords: analysis.missingKeywords,
            skillGaps: analysis.skillGaps,
            suggestions: analysis.improvementTips,
            strengths: analysis.strengths,
            weaknesses: analysis.weaknesses,
          },
        });
      }
    } catch (dbError: any) {
      console.warn("DB save skipped:", dbError.message);
    }

    return { success: true, analysis };
  } catch (error: any) {
    console.error("analyzeResume error:", error);
    throw new Error(error.message || "Failed to analyze resume. Please try again.");
  }
}

export async function getLatestAnalysis() {
  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) throw new Error("User not authenticated");
  const user = await db.user.findUnique({ where: { clerkUserId } });
  if (!user) throw new Error("User not found");
  try {
    const dbAny = db as any;
    const modelRef = dbAny.resumeAnalysis || dbAny.atsAnalysis || dbAny.aTSAnalysis;
    if (!modelRef) return null;
    return await modelRef.findFirst({ where: { userId: user.id }, orderBy: { createdAt: "desc" } });
  } catch {
    return null;
  }
}
