
export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  createdAt: string;
}

export interface StudyHistory {
  date: string; // YYYY-MM-DD
  taskIds: string[];
}

export interface DebriefAnswer {
  id: string;
  question: string;
  answer: string;
}

export interface ProgressData {
  tasks: Task[];
  history: StudyHistory[];
  debriefAnswers: DebriefAnswer[];
  isCleared: boolean;
}

export interface Lesson {
  id: number;
  course: string;
  title: string;
  module: string;
}

export enum MilestoneStatus {
  COMPLETED = 'COMPLETED',
  IN_PROGRESS = 'IN_PROGRESS',
  NOT_STARTED = 'NOT_STARTED',
}

export interface Milestone {
  id: number;
  name: string;
  description: string;
  course: string;
  maxLessonId: number;
  features: string[];
}
