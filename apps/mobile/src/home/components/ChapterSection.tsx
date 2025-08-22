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
    currentLessonId,
    isLastUnit
}) => {
    return (
        <View style={[
            styles.container,
            isLastUnit && styles.lastUnitContainer
        ]}>
            <View>
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
});

export default ChapterSection;