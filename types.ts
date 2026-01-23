
export interface Lesson {
  id: number;
  title: string;
  module: string;
  course: 'Laravel' | 'PostgreSQL';
}

export enum MilestoneStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}

export interface Milestone {
  id: number;
  name: string;
  description: string;
  maxLessonId: number;
  course: 'Laravel' | 'PostgreSQL';
  features: string[];
}

export interface StudyHistory {
  date: string; // YYYY-MM-DD
  lessonIds: number[];
}

export interface ProgressData {
  completedLessonIds: number[];
  history: StudyHistory[];
}