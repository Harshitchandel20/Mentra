export interface Skill {
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  description?: string;
}

export interface Goal {
  subject: string;
  specificObjective: string;
  depth: 'basic' | 'intermediate' | 'advanced' | 'expert';
}

export interface TimeConstraints {
  totalWeeks: number;
  hoursPerWeek: number;
  preferredDays: string[];
  startDate?: string;
}

export interface Resource {
  type: string;
  title: string;
  url?: string;
}

export interface Topic {
  name: string;
  description: string;
  estimatedHours: number;
  prerequisites: string[];
  resources: Resource[];
}

export interface Week {
  weekNumber: number;
  title: string;
  weeklyGoal: string;
  sequencingExplanation: string;
  topics: Topic[];
}

export interface Roadmap {
  totalWeeks: number;
  totalEstimatedHours: number;
  overallGoal: string;
  prerequisiteAnalysis: string;
  weeks: Week[];
}

export interface FormData {
  skills: Skill[];
  goal: Goal;
  timeConstraints: TimeConstraints;
}