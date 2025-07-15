import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    RefreshControl
} from 'react-native';
import { useAuth } from '@/auth/hooks/useAuth';
import { SafeAreaView } from 'react-native-safe-area-context';
import WelcomeHeader from '../components/WelcomeHeader';
import CoursePath from '../components/CoursePath';
import { useCourseProgress } from '../hooks/useCourseProgress';
import StreakCounter from '../components/StreakCounter';
import XPProgressBar from '../components/XPProgressBar';
import { courseService } from '../services/courseService';

const HomeScreen = () => {
    const { state } = useAuth();
    const scrollViewRef = useRef<ScrollView>(null);
    const {
        courseStructure,
        userProgress,
        currentPosition,
        isLoading,
        error,
        refreshCourseData
    } = useCourseProgress();
    const [refreshing, setRefreshing] = useState(false);

    // pull to refresh
    const onRefresh = async () => {
        setRefreshing(true);
        await refreshCourseData();
        setRefreshing(false);
    };

    // Auto scroll to current lesson
    useEffect(() => {
        if (currentPosition && scrollViewRef.current) {
            // Add a small delay to ensure the course path is rendered
            const timer = setTimeout(() => {
                if (currentPosition.nodeRef?.current) {
                    currentPosition.nodeRef.current.measureLayout(
                        scrollViewRef.current as any,
                        (x, y) => {
                            scrollViewRef.current?.scrollTo({
                                y: y - 150, // Offset to position the current node in view
                                animated: true
                            });
                        },
                        () => console.log('Failed to measure')
                    );
                }
            }, 500);

            return () => clearTimeout(timer);
        }
    }, [currentPosition, courseStructure]);

    if (isLoading && !courseStructure) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3B82F6" />
                <Text style={styles.loadingText}>Loading your learning journey...</Text>
            </View>
        );
    }


    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>
                    Something went wrong. Please try again.
                </Text>
                <TouchableOpacity
                    style={styles.retryButton}
                    onPress={refreshCourseData}
                >
                    <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <WelcomeHeader
                name={state.user?.name || 'Learner'}
                level={userProgress?.level || 1}
                profilePicture={state.user?.profile_picture}
            />

            <View style={styles.statsContainer}>
                <StreakCounter count={userProgress?.streak_count || 0} />
                <XPProgressBar
                    currentXP={userProgress?.xp_total || 0}
                    nextLevelXP={userProgress?.next_level_xp || 100}
                    level={userProgress?.level || 1}
                />
            </View>

            <ScrollView
                ref={scrollViewRef}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#3B82F6']}
                    />
                }
            >
                {courseStructure && (
                    <CoursePath
                        courseStructure={courseStructure}
                        currentPosition={currentPosition}
                    />
                )}

                <View style={styles.bottomSpace} />
            </ScrollView>

            {currentPosition && (
                <View style={styles.continueButtonContainer}>
                    <TouchableOpacity
                        style={styles.continueButton}
                        onPress={() => {
                            // Handle navigation to the current lesson
                            //  TODO: Implemented when I add the study session screens
                            console.log('Continue to lesson:', currentPosition.lessonId);
                        }}
                    >
                        <Text style={styles.continueButtonText}>Continue Learning</Text>
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#6B7280',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#FFFFFF',
    },
    errorText: {
        fontSize: 16,
        color: '#DC2626',
        textAlign: 'center',
        marginBottom: 16,
    },
    retryButton: {
        backgroundColor: '#3B82F6',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    retryButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    statsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    bottomSpace: {
        height: 100,
    },
    continueButtonContainer: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
    },
    continueButton: {
        backgroundColor: '#3B82F6',
        paddingVertical: 16,
        borderRadius: 8,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    continueButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default HomeScreen;