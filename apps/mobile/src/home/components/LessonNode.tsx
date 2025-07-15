import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Lesson } from '../types/course.types';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

interface LessonNodeProps {
    lesson: Lesson;
    isLast: boolean;
    isCurrent: boolean;
    isCompleted: boolean;
    isLocked: boolean;
}

const LessonNode: React.FC<LessonNodeProps> = ({
    lesson,
    isLast,
    isCurrent,
    isCompleted,
    isLocked
}) => {
    const navigation = useNavigation();
    const nodeRef = useRef(null);

    // Animation for current node highlight
    const scale = useSharedValue(isCurrent ? 1.1 : 1);

    React.useEffect(() => {
        if (isCurrent) {
            scale.value = withSpring(1.1);
        } else {
            scale.value = withSpring(1);
        }
    }, [isCurrent]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }]
        };
    });

    const handlePress = () => {
        if (!isLocked) {
            // This will be implemented when we add the study session screens
            console.log('Navigate to lesson:', lesson.id);
        }
    };

    const getNodeColor = () => {
        if (isLocked) return '#9CA3AF'; // Gray for locked
        if (isCompleted) return '#10B981'; // Green for completed
        if (isCurrent) return '#3B82F6'; // Blue for current
        return '#6B7280'; // Default gray
    };

    const getNodeIcon = () => {
        if (isLocked) return 'lock-closed';
        if (isCompleted) return 'checkmark';
        return 'arrow-forward';
    };

    return (
        <Animated.View
            ref={nodeRef}
            style={[
                styles.container,
                isLast && styles.lastContainer,
                isCurrent && animatedStyle
            ]}
        >
            <TouchableOpacity
                style={[
                    styles.nodeContainer,
                    { backgroundColor: getNodeColor() }
                ]}
                onPress={handlePress}
                disabled={isLocked}
            >
                <Ionicons name={getNodeIcon()} size={16} color="#FFFFFF" />
            </TouchableOpacity>

            <View style={styles.contentContainer}>
                <Text
                    style={[
                        styles.lessonTitle,
                        isLocked && styles.lockedText,
                        isCurrent && styles.currentText
                    ]}
                >
                    {lesson.name}
                </Text>

                {lesson.description && (
                    <Text
                        style={[
                            styles.lessonDescription,
                            isLocked && styles.lockedText
                        ]}
                        numberOfLines={2}
                    >
                        {lesson.description}
                    </Text>
                )}

                {isCurrent && (
                    <View style={styles.currentIndicator}>
                        <Text style={styles.currentText}>Current Lesson</Text>
                    </View>
                )}
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginBottom: 24,
        alignItems: 'flex-start',
    },
    lastContainer: {
        marginBottom: 0,
    },
    nodeContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: -16,
        marginRight: 12,
        backgroundColor: '#6B7280',
    },
    contentContainer: {
        flex: 1,
        paddingRight: 16,
    },
    lessonTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 4,
    },
    lessonDescription: {
        fontSize: 14,
        color: '#6B7280',
    },
    lockedText: {
        color: '#9CA3AF',
    },
    currentText: {
        color: '#3B82F6',
        fontWeight: 'bold',
    },
    currentIndicator: {
        marginTop: 4,
        backgroundColor: '#EBF5FF',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        alignSelf: 'flex-start',
    },
});

export default LessonNode;