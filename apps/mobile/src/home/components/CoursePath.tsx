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
        paddingVertical: 10,
    },
    unitContainer: {
        marginBottom: 20,
    },
});

export default CoursePath;