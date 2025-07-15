import { CourseStructure, UserProgress, CurrentPosition } from '../types/course.types';

// Mock course structure for testing
export const mockCourseStructure: CourseStructure = {
  id: 1,
  name: "Khmer Grade 12 BACII Prep",
  units: [
    {
      id: 1,
      name: "Unit 1: Foundations",
      description: "Basic concepts and fundamentals",
      order: 1,
      chapters: [
        {
          id: 1,
          name: "Chapter 1: Getting Started",
          description: "Introduction to the course",
          order: 1,
          lessons: [
            {
              id: 1,
              name: "Lesson 1: Course Overview",
              description: "Learn about the course structure",
              completed: true,
              locked: false,
              order: 1
            },
            {
              id: 2,
              name: "Lesson 2: Study Techniques",
              description: "Effective study methods for exam prep",
              completed: true,
              locked: false,
              order: 2
            },
            {
              id: 3,
              name: "Lesson 3: Time Management",
              description: "How to manage your study time effectively",
              completed: false,
              locked: false,
              order: 3
            }
          ]
        },
        {
          id: 2,
          name: "Chapter 2: Core Concepts",
          description: "Essential knowledge for the exam",
          order: 2,
          lessons: [
            {
              id: 4,
              name: "Lesson 1: Key Terminology",
              description: "Important terms you need to know",
              completed: false,
              locked: true,
              order: 1
            },
            {
              id: 5,
              name: "Lesson 2: Foundational Principles",
              description: "Basic principles that will be tested",
              completed: false,
              locked: true,
              order: 2
            }
          ]
        }
      ]
    },
    {
      id: 2,
      name: "Unit 2: Advanced Topics",
      description: "More complex subjects and practice",
      order: 2,
      chapters: [
        {
          id: 3,
          name: "Chapter 1: Advanced Concepts",
          description: "Deeper dive into complex topics",
          order: 1,
          lessons: [
            {
              id: 6,
              name: "Lesson 1: Complex Problem Solving",
              description: "Strategies for solving difficult problems",
              completed: false,
              locked: true,
              order: 1
            },
            {
              id: 7,
              name: "Lesson 2: Critical Analysis",
              description: "How to analyze complex scenarios",
              completed: false,
              locked: true,
              order: 2
            }
          ]
        }
      ]
    }
  ]
};

// Mock user progress for testing
export const mockUserProgress: UserProgress = {
  level: 2,
  xp_total: 150,
  next_level_xp: 300,
  streak_count: 5,
  last_study_date: new Date().toISOString(),
  completed_lessons: [1, 2]
};

// Mock current position for testing
export const mockCurrentPosition: CurrentPosition = {
  unitId: 1,
  chapterId: 1,
  lessonId: 3,
};