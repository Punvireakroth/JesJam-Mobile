import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CourseStructure, CurrentPosition } from '../types/course.types';
import ChapterSection from './ChapterSection';

interface CoursePathProps {
    courseStructure: CourseStructure;
    currentPosition: CurrentPosition | null;
}

const CoursePath: React.FC<CoursePathProps> = ({
    courseStructure,
    currentPosition
}) => {
    return (
        <View style={styles.container}>
            {courseStructure.units.map((unit, index) => (
                <View key={unit.id} style={styles.unitContainer}>
                    <View style={styles.unitHeader}>
                        <Text style={styles.unitTitle}>Unit {unit.order}</Text>
                        <Text style={styles.unitName}>{unit.name}</Text>
                        <View style={styles.lessonCountContainer}>
                            <Text style={styles.lessonCount}>
                                {unit.chapters.length} lesson{unit.chapters.length !== 1 ? 's' : ''}
                            </Text>
                        </View>
                    </View>

                    {unit.chapters.map((chapter) => (
                        <ChapterSection
                            key={chapter.id}
                            chapter={chapter}
                            isCurrentChapter={currentPosition?.chapterId === chapter.id}
                            currentLessonId={currentPosition?.lessonId ?? null}
                            isLastUnit={index === courseStructure.units.length - 1}
                        />
                    ))}
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 16,
    },
    unitContainer: {
        marginBottom: 32,
    },
    unitHeader: {
        backgroundColor: '#EBF5FF',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderRadius: 12,
        marginBottom: 24,
        marginHorizontal: 16,
    },
    unitTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#3B82F6',
        marginBottom: 4,
    },
    unitName: {
        fontSize: 18,
        color: '#4B5563',
    },
    lessonCount: {
        fontSize: 14,
        color: '#6B7280',
    },
    lessonCountContainer: {
        marginTop: 8,
    },
});

export default CoursePath;