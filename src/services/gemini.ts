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
      description: "The final roadmap. ONLY include this when currentPhase is 'roadmap'. ALL fields inside must be fully populated with detailed content.",
      properties: {
        bestSkills: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of 2-3 specific digital skills." },
        whyItFits: { type: Type.STRING, description: "A detailed paragraph explaining why these skills match the user's personality and discovery answers." },
        thirtyDayPlan: {
          type: Type.OBJECT,
          description: "A step-by-step 4-week learning plan.",
          properties: {
            week1: { type: Type.STRING, description: "Focus for week 1." },
            week2: { type: Type.STRING, description: "Focus for week 2." },
            week3: { type: Type.STRING, description: "Focus for week 3." },
            week4: { type: Type.STRING, description: "Focus for week 4." },
          },
          required: ["week1", "week2", "week3", "week4"]
        },
        toolsToLearn: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Specific software, platforms, or tools to master." },
        freeResources: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              description: { type: Type.STRING }
            },
            required: ["name", "description"]
          },
          description: "Links or names of high-quality free learning resources."
        },
        firstIncomeStrategy: { type: Type.STRING, description: "A specific strategy to land the first client or job." },
        mistakesToAvoid: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Common pitfalls for beginners in this specific field." },
        longTermGrowth: { type: Type.STRING, description: "Career progression and earning potential over 1-5 years." }
      },
      required: ["bestSkills", "whyItFits", "thirtyDayPlan", "toolsToLearn", "freeResources", "firstIncomeStrategy", "mistakesToAvoid", "longTermGrowth"]
    }
  },
  required: ["message", "currentPhase"]
};

const systemInstruction = `You are Upskillr, a deep self-discovery and skill-matching AI.
Your goal is to help users who might not know their own strengths or interests find the perfect digital career path.

You must follow these phases in order:
1. 'discovery': Ask 8 to 12 questions, ONE AT A TIME. 
   - Focus on SELF-DISCOVERY: Ask about what makes them lose track of time, how they solve problems (logic vs intuition), their relationship with aesthetics, how they feel about social interaction vs deep work, and their natural curiosity.
   - Use psychological and behavioral questions rather than just "do you like coding?".
   - Provide 3-4 multiple choice options for each question. 
   - Do NOT recommend skills yet. 
   - Keep track of how many questions you have asked.

2. 'analysis': Once you have enough information (after 8-12 questions), transition to the 'analysis' phase. 
   - Provide a deep psychological profile of the user based on their answers.
   - Explain their "Digital Archetype" (e.g., The Visual Architect, The Logical Solver, The Empathic Communicator).

3. 'confirmation': In the same response as the analysis or immediately after, recommend ONE or TWO best-fit digital skills. 
   - Ask: 'Based on your profile as [Archetype], I recommend [Skill]. Does this feel right?'. 
   - Provide options like ['Yes, let's do it!', 'No, I want something else'].

4. 'roadmap': If the user agrees, transition to the 'roadmap' phase.
   - Generate a HIGHLY DETAILED roadmap object. 
   - Every single field in the roadmap MUST be filled with specific, actionable, and personalized content. 
   - Do NOT leave any field empty or generic.
   - If they disagree, go back to 'discovery' or 'confirmation' to refine.

Always respond in the requested JSON format. Keep your 'message' warm, insightful, and encouraging.`;

export async function generateAISurvivalGuide(skill: string) {
  const survivalSchema = {
    type: Type.OBJECT,
    properties: {
      skill: { type: Type.STRING, description: "The skill being analyzed." },
      automationThreat: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Specific mundane/repetitive tasks in this job that AI will automate." },
      humanAdvantage: { type: Type.ARRAY, items: { type: Type.STRING }, description: "High-level, strategic, or empathetic skills AI cannot replicate in this job." },
      multiplierStrategy: { type: Type.STRING, description: "A strategic paragraph on how to merge human skills with AI to do the work of 10 people." },
      toolStack: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            description: { type: Type.STRING }
          },
          required: ["name", "description"]
        },
        description: "3-4 specific AI tools they need to learn immediately for this niche."
      }
    },
    required: ["skill", "automationThreat", "humanAdvantage", "multiplierStrategy", "toolStack"]
  };

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate an AI Survival Guide for the following skill: ${skill}. Focus on how to future-proof this career, what AI will automate, the human advantage, and the essential AI tool stack.`,
    config: {
      systemInstruction: "You are an expert AI strategist and career futurist. Your goal is to empower users by showing them exactly how to leverage AI in their specific field, rather than being replaced by it. Be specific, actionable, and encouraging. Do not give generic advice.",
      responseMimeType: 'application/json',
      responseSchema: survivalSchema,
      temperature: 0.7,
    }
  });

  return response.text;
}
export async function getNextUpskillrResponse(history: { role: string, parts: { text: string }[] }[], userMessage: string) {
  const contents = [...history, { role: 'user', parts: [{ text: userMessage }] }];
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
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
