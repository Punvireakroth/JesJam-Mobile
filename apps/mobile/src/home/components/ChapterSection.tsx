import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Chapter } from '../types/course.types';
import LessonNode from './LessonNode';

interface ChapterSectionProps {
    chapter: Chapter;
    isCurrentChapter: boolean;
    currentLessonId: number | null;
    isLastUnit: boolean;
}

const ChapterSection: React.FC<ChapterSectionProps> = ({
    chapter,
    isCurrentChapter,
    currentLessonId,
    isLastUnit
}) => {
    return (
        <View style={[
            styles.container,
            isLastUnit && styles.lastUnitContainer
        ]}>
            <View style={styles.headerContainer}>
                <Text style={styles.chapterTitle}>{chapter.name}</Text>
                <Text style={styles.lessonCount}>
                    {chapter.lessons.length} lesson{chapter.lessons.length !== 1 ? 's' : ''}
                </Text>
            </View>

            <View style={styles.pathContainer}>
                {chapter.lessons.map((lesson, index) => {
                    const isLast = index === chapter.lessons.length - 1;
                    const isCurrent = lesson.id === currentLessonId;

                    return (
                        <LessonNode
                            key={lesson.id}
                            lesson={lesson}
                            isLast={isLast}
                            isCurrent={isCurrent}
                            isCompleted={lesson.completed}
                            isLocked={lesson.locked}
                        />
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
    },
    lastUnitContainer: {
        marginBottom: 0,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    chapterTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    lessonCount: {
        fontSize: 14,
        color: '#6B7280',
    },
    pathContainer: {
        borderLeftWidth: 2,
        borderLeftColor: '#E5E7EB',
        paddingLeft: 24,
        marginLeft: 12,
    },
});

export default ChapterSection;