export interface AISurvivalGuide {
  skill: string;
  automationThreat: string[];
  humanAdvantage: string[];
  multiplierStrategy: string;
  toolStack: { name: string; description: string }[];
}

export interface RoadmapData {
  bestSkills: string[];
  whyItFits: string;
  thirtyDayPlan: {
    week1: string;
    week2: string;
    week3: string;
    week4: string;
  };
  toolsToLearn: string[];
  freeResources: { name: string; description: string }[];
  firstIncomeStrategy: string;
  mistakesToAvoid: string[];
  longTermGrowth: string;
}

export interface UpskillrResponse {
  message: string;
  options?: string[];
  currentPhase: 'discovery' | 'analysis' | 'confirmation' | 'roadmap';
  roadmap?: RoadmapData;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  options?: string[];
  roadmap?: RoadmapData;
}
