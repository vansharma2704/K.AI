"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const MODELS = ['gemma-3-27b-it', 'gemini-2.5-flash'];

export async function generateQuizQuestions(topic: string, mode: string) {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    const prompt = `
        You are an expert technical interviewer and educator.
        Generate a 20-question mock quiz on the topic of "${topic}" at an "${mode}" difficulty level.
        
        CRITICAL QUESTION MIX REQUIREMENT:
        - 15 questions should be theoretical conceptual questions.
        - EXACTLY 5 questions must be practical coding/logic/scenario-based questions where the user must predict output, identify a bug, or choose the correct algorithm snippet.

        You MUST output ONLY valid JSON using exactly this format:
        [
            {
                "question": "The question text...",
                "options": ["Option A", "Option B", "Option C", "Option D"],
                "answer": "The EXACT string of the correct option from the options array",
                "explanation": "A short, 1-2 sentence explanation of why this is correct."
            }
        ]

        Important rules:
        1. Produce exactly 20 array items.
        2. Provide exactly 4 options per question.
        3. The "answer" MUST perfectly string-match one of the "options".
        4. Do NOT include any markdown wrappers (like \`\`\`json). Just the raw JSON array.
    `;

    let text = "";
    
    // Retry logic
    for (let attempt = 0; attempt < 3; attempt++) {
        for (const modelName of MODELS) {
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent(prompt);
                text = result.response.text();
                text = text.replace(/```json/g, '').replace(/```/g, '').trim();
                
                // Validate parseable and length
                const parsed = JSON.parse(text);
                if (!Array.isArray(parsed) || parsed.length !== 20) {
                    throw new Error("Did not generate exactly 20 questions.");
                }
                break; // Break model loop
            } catch (err: any) {
                console.warn(`Model ${modelName} failed on attempt ${attempt + 1}: ${err.message.slice(0, 50)}`);
                text = ""; // Reset
            }
        }
        if (text) break; // Break retry loop
    }

    if (!text) {
        throw new Error("Failed to generate quiz from AI. Please try again.");
    }

    try {
        const parsedJson = JSON.parse(text);
        return {
            success: true,
            questions: parsedJson
        };
    } catch (e: any) {
        throw new Error("AI returned invalid data format.");
    }
}

export async function submitQuizAndGetFeedback(
    topic: string, 
    mode: string, 
    score: number, 
    questionsAndAnswers: any[]
) {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    const user = await db.user.findUnique({
        where: { clerkUserId: userId }
    });

    if (!user) {
        throw new Error("User not found");
    }

    // Filter to only WRONG answers for AI feedback context
    const wrongAnswers = questionsAndAnswers.filter(q => !q.isCorrect).map(q => ({
        question: q.question,
        userAnswer: q.userAnswer,
        correctAnswer: q.answer
    }));

    let improvementTip = "Great job! Keep practicing.";

    if (wrongAnswers.length > 0) {
        const feedbackPrompt = `
            You are a technical mentor analyzing a student's quiz results.
            Topic: ${topic}
            Difficulty: ${mode}
            Score: ${score}/20
            
            The student got the following questions WRONG:
            ${JSON.stringify(wrongAnswers, null, 2)}

            Provide a concise, highly specific 2-4 sentence paragraph of constructive feedback pointing out specific concepts they should restudy based on these exact mistakes. Do not be overly generic. No markdown formatting.
        `;

        try {
            const model = genAI.getGenerativeModel({ model: "gemma-3-27b-it" });
            const result = await model.generateContent(feedbackPrompt);
            improvementTip = result.response.text().trim();
        } catch (e) {
            console.error("Feedback generation failed, using fallback.");
            improvementTip = "You missed some questions. Review the concepts you got wrong to improve next time.";
        }
    }

    // Save to Database mapping to existing Assessment schema
    const categoryName = `Prep Quiz: ${topic} - ${mode}`;
    
    const assessment = await db.assessment.create({
        data: {
            userId: user.id,
            quizScore: (score / 20) * 100, // Percentage
            questions: questionsAndAnswers,
            category: categoryName,
            improvementTip: improvementTip
        }
    });

    return {
        success: true,
        assessmentId: assessment.id
    };
}

export async function getRecentQuizzes() {
    const { userId } = await auth();

    if (!userId) {
        return { success: false, data: [] };
    }

    const user = await db.user.findUnique({
        where: { clerkUserId: userId }
    });

    if (!user) {
         return { success: false, data: [] };
    }

    const recents = await db.assessment.findMany({
        where: { 
            userId: user.id,
            category: { startsWith: 'Prep Quiz' }
        },
        orderBy: { createdAt: 'desc' },
        take: 6
    });

    return { success: true, data: recents };
}

export async function deleteQuiz(assessmentId: string) {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    const user = await db.user.findUnique({
        where: { clerkUserId: userId }
    });

    if (!user) {
        throw new Error("User not found");
    }

    try {
        const assessment = await db.assessment.findUnique({
            where: { 
                id: assessmentId,
                userId: user.id
            }
        });

        if (!assessment) {
            throw new Error("Quiz not found or unauthorized");
        }

        await db.assessment.delete({
            where: { id: assessmentId }
        });

        return { success: true };
    } catch (error: any) {
        console.error("Failed to delete quiz:", error?.message || error);
        throw new Error(`Failed to delete quiz: ${error?.message || "Unknown error"}`);
    }
}
