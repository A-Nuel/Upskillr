import { GoogleGenAI, Type } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    message: { type: Type.STRING, description: "The conversational message to display to the user." },
    options: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Multiple choice options for the user's next response. Provide 3-4 options during discovery phase. Provide confirmation options during confirmation phase." },
    currentPhase: { type: Type.STRING, description: "The current phase: 'discovery', 'analysis', 'confirmation', or 'roadmap'." },
    roadmap: {
      type: Type.OBJECT,
      description: "The final roadmap. ONLY include this when currentPhase is 'roadmap'.",
      properties: {
        bestSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
        whyItFits: { type: Type.STRING },
        thirtyDayPlan: {
          type: Type.OBJECT,
          properties: {
            week1: { type: Type.STRING },
            week2: { type: Type.STRING },
            week3: { type: Type.STRING },
            week4: { type: Type.STRING },
          }
        },
        toolsToLearn: { type: Type.ARRAY, items: { type: Type.STRING } },
        freeResources: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              description: { type: Type.STRING }
            }
          }
        },
        firstIncomeStrategy: { type: Type.STRING },
        mistakesToAvoid: { type: Type.ARRAY, items: { type: Type.STRING } },
        longTermGrowth: { type: Type.STRING }
      }
    }
  },
  required: ["message", "currentPhase"]
};

const systemInstruction = `You are Upskillr, a career mentor and structured decision engine.
Your goal is to help the user discover the best digital skill for them and generate a learning roadmap.

You must follow these phases in order:
1. 'discovery': Ask 8 to 12 questions, ONE AT A TIME. Mix questions about personality, interests, goals (money urgency), work style, technical comfort, and output preference. Provide 3-4 multiple choice options for each question. Do NOT recommend skills yet. Keep track of how many questions you have asked.
2. 'analysis': Once you have enough information (after 8-12 questions), transition to the 'analysis' phase. Briefly explain your analysis of their traits.
3. 'confirmation': In the same response as the analysis or immediately after, recommend ONE or TWO best-fit digital skills. Ask: 'Based on your answers, I recommend [Skill]. Does this feel right?'. Provide options like ['Yes, let's do it!', 'No, I want something else'].
4. 'roadmap': If the user agrees, transition to the 'roadmap' phase and generate the detailed roadmap object. If they disagree, go back to 'discovery' or 'confirmation' to refine.

Always respond in the requested JSON format. Keep your 'message' friendly, clear, and mentor-like.`;

export async function getNextUpskillrResponse(history: { role: string, parts: { text: string }[] }[], userMessage: string) {
  const contents = [...history, { role: 'user', parts: [{ text: userMessage }] }];
  
  const response = await ai.models.generateContent({
    model: 'gemini-3.1-pro-preview',
    contents,
    config: {
      systemInstruction,
      responseMimeType: 'application/json',
      responseSchema,
      temperature: 0.7,
    }
  });

  return response.text;
}
