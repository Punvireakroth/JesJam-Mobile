import axios from 'axios';
import { CourseStructure, UserProgress, CurrentPosition } from '../types/course.types';
import tokenService from '@/auth/services/tokenService';
import { API_URL } from '@env';
import { mockCourseStructure, mockUserProgress, mockCurrentPosition } from './mockData';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Add request interceptor to handle token
apiClient.interceptors.request.use(async (config) => {
  const token = await tokenService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Get course structure
const getCourseStructure = async (): Promise<CourseStructure> => {
  try {
    // For development, return mock data
    // TODO: Replace with actual API call when backend is ready
    // const response = await apiClient.get('/api/course/structure');
    // return response.data;
    return Promise.resolve(mockCourseStructure);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to fetch course structure');
    }
    throw new Error('Network error. Please try again.');
  }
};

// Get user progress
const getUserProgress = async (): Promise<UserProgress> => {
  try {
    // For development, return mock data
    // TODO: Replace with actual API call when backend is ready
    // const response = await apiClient.get('/api/course/progress');
    // return response.data;
    return Promise.resolve(mockUserProgress);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to fetch user progress');
    }
    throw new Error('Network error. Please try again.');
  }
};

// Get current position in course
const getCurrentPosition = async (): Promise<CurrentPosition> => {
  try {
    // For development, return mock data
    // TODO: Replace with actual API call when backend is ready
    // const response = await apiClient.get('/api/course/current-position');
    // return response.data;
    return Promise.resolve(mockCurrentPosition);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to fetch current position');
    }
    throw new Error('Network error. Please try again.');
  }
};

// Update lesson completion status
const updateLessonProgress = async (lessonId: number, completed: boolean): Promise<void> => {
  try {
    // For development, just log the update
    // TODO: Replace with actual API call when backend is ready
    // await apiClient.put(`/api/course/progress/${lessonId}`, { completed });
    console.log(`Lesson ${lessonId} marked as ${completed ? 'completed' : 'incomplete'}`);
    return Promise.resolve();
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to update lesson progress');
    }
    throw new Error('Network error. Please try again.');
  }
};

// Get personalized lesson suggestions
const getLessonSuggestions = async () => {
  try {
    // For development, return empty array
    // TODO: Replace with actual API call when backend is ready
    // const response = await apiClient.get('/api/course/suggestions');
    // return response.data;
    return Promise.resolve([]);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to fetch lesson suggestions');
    }
    throw new Error('Network error. Please try again.');
  }
};

export const courseService = {
  getCourseStructure,
  getUserProgress,
  getCurrentPosition,
  updateLessonProgress,
  getLessonSuggestions
};