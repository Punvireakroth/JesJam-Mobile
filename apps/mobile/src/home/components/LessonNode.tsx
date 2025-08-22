import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Lesson } from '../types/course.types';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

interface LessonNodeProps {
    lesson: Lesson;
    isLast: boolean;
    isCurrent: boolean;
    isCompleted: boolean;
    isLocked: boolean;
    isReward?: boolean;
}

const LessonNode: React.FC<LessonNodeProps> = ({
    lesson,
    isLast,
    isCurrent,
    isCompleted,
    isLocked,
}) => {
    const navigation = useNavigation();
    const nodeRef = useRef(null);

    // Animation for current node highlight
    const scale = useSharedValue(isCurrent ? 1.1 : 1);

    useEffect(() => {
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
        if (isCurrent) return 'play';
        return 'play';
    };

    // if its the learning node
    if (isCurrent) {
        return (
            <Animated.View
                ref={nodeRef}
                style={[
                    styles.containerVertical,
                    isLast && styles.lastContainer,
                    isCurrent && animatedStyle
                ]}
            >
                {!isLast && <View style={styles.connectionLine} />}

                <TouchableOpacity
                    style={styles.currentLessonContainer}
                    onPress={handlePress}
                    disabled={isLocked}
                >
                    <MaterialCommunityIcons name="gift" size={24} color="#FFD700" />
                </TouchableOpacity>

                <View style={styles.labelBubble}>
                    <Text style={styles.labelText}>Start</Text>
                </View>
            </Animated.View>
        );
    }

    return (
        <Animated.View
            ref={nodeRef}
            style={[
                styles.containerVertical,
                isLast && styles.lastContainer,
                // isCurrent && animatedStyle
            ]}
        >
            {!isLast && <View style={styles.connectionLine} />}

            <TouchableOpacity
                style={[
                    styles.nodeContainer,
                    { backgroundColor: getNodeColor() }
                ]}
                onPress={handlePress}
                disabled={isLocked}
            >
                {getNodeIcon() && <Ionicons name={getNodeIcon()} size={20} color="#FFFFFF" />}
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
    containerVertical: {
        alignItems: 'center',
        marginBottom: 40,
        position: 'relative',
    },
    lastContainer: {
        marginBottom: 0,
    },
    nodeContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#6B7280',
        marginBottom: 8,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    currentLessonContainer: {
        width: 70,
        height: 70,
        backgroundColor: '#FEF3C7',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        marginBottom: 8,
        elevation: 3,
        borderWidth: 4,
        borderColor: 'lightpink',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    connectionLine: {
        position: 'absolute',
        width: 6,
        height: 100,
        backgroundColor: 'lightpink',
        opacity: 0.5,
        borderStyle: 'dashed',
        borderWidth: 2,
        borderColor: '#green',
        top: 60,
        zIndex: -1,
    },
    contentContainer: {
        backgroundColor: 'lightpink',
        alignItems: 'center',
        borderRadius: 10,
        paddingHorizontal: 16,
        maxWidth: 200,
    },
    lessonTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ffff',
        marginBottom: 4,
        textAlign: 'center',
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
    },
    labelBubble: {
        backgroundColor: 'white',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    labelText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#6366F1',
    },
});

export default LessonNode;