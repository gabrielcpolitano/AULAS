
export interface Lesson {
  id: number;
  title: string;
  module: string;
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
  features: string[];
}

export interface ProgressData {
  completedLessonIds: number[];
}
