import { RefObject } from 'react';
import { View } from 'react-native';

export interface Lesson {
  id: number;
  name: string;
  description?: string;
  completed: boolean;
  locked: boolean;
  order: number;
}

export interface Chapter {
  id: number;
  name: string;
  description?: string;
  order: number;
  lessons: Lesson[];
}

export interface Unit {
  id: number;
  name: string;
  description?: string;
  order: number;
  chapters: Chapter[];
}

export interface CourseStructure {
  id: number;
  name: string;
  units: Unit[];
}

export interface UserProgress {
  level: number;
  xp_total: number;
  next_level_xp: number;
  streak_count: number;
  last_study_date: string;
  completed_lessons: number[];
}

export interface CurrentPosition {
  unitId: number;
  chapterId: number;
  lessonId: number;
  nodeRef?: RefObject<View>;
}