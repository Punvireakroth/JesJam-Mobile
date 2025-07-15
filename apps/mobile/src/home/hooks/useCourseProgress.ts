import { useState, useEffect, useCallback, useRef, RefObject } from 'react';
import { courseService } from '../services/courseService';
import { CourseStructure, UserProgress, CurrentPosition } from '../types/course.types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View } from 'react-native';

export const useCourseProgress = () => {
    const [courseStructure, setCourseStructure] = useState<CourseStructure | null>(null);
    const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
    const [currentPosition, setCurrentPosition] = useState<CurrentPosition | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Create a ref for the current lesson node
    const currentNodeRef = useRef<View>(null);

    // Load course data
    const loadCourseData = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            // First try to load from cache
            const cachedStructure = await AsyncStorage.getItem('COURSE_STRUCTURE');
            const cachedProgress = await AsyncStorage.getItem('USER_PROGRESS');
            const cachedPosition = await AsyncStorage.getItem('CURRENT_POSITION');

            if (cachedStructure && cachedProgress && cachedPosition) {
                setCourseStructure(JSON.parse(cachedStructure));
                setUserProgress(JSON.parse(cachedProgress));
                const parsedPosition = JSON.parse(cachedPosition);
                setCurrentPosition({
                    ...parsedPosition,
                    nodeRef: currentNodeRef
                });
            }

            // Fetch fresh data from API
            const [structure, progress, position] = await Promise.all([
                courseService.getCourseStructure(),
                courseService.getUserProgress(),
                courseService.getCurrentPosition()
            ]);

            // Update state with fresh data
            setCourseStructure(structure);
            setUserProgress(progress);
            setCurrentPosition({
                ...position,
                nodeRef: currentNodeRef as RefObject<View>
            });

            // Update cache
            await AsyncStorage.setItem('COURSE_STRUCTURE', JSON.stringify(structure));
            await AsyncStorage.setItem('USER_PROGRESS', JSON.stringify(progress));
            await AsyncStorage.setItem('CURRENT_POSITION', JSON.stringify(position));

        } catch (error) {
            console.error('Error loading course data:', error);
            setError(error instanceof Error ? error.message : 'Failed to load course data');
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Update lesson progress
    const updateLessonProgress = useCallback(async (lessonId: number, completed: boolean) => {
        try {
            await courseService.updateLessonProgress(lessonId, completed);

            // Refresh course data after updating lesson progress
            await loadCourseData();
        } catch (error) {
            console.error('Error updating lesson progress:', error);
            setError(error instanceof Error ? error.message : 'Failed to update lesson progress');
        }
    }, [loadCourseData]);

    // Refresh course data
    const refreshCourseData = useCallback(async () => {
        await loadCourseData();
    }, [loadCourseData]);

    // Load course data on mount
    useEffect(() => {
        loadCourseData();
    }, [loadCourseData]);

    return {
        courseStructure,
        userProgress,
        currentPosition,
        isLoading,
        error,
        updateLessonProgress,
        refreshCourseData,
        currentNodeRef
    };
}