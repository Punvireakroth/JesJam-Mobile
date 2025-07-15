import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

interface XPProgressBarProps {
    currentXP: number;
    nextLevelXP: number;
    level: number;
}

const XPProgressBar: React.FC<XPProgressBarProps> = ({
    currentXP,
    nextLevelXP,
    level }) => {

    // calculate the progress percentage
    const progressPercentage = Math.min(currentXP / nextLevelXP * 100, 100);

    // Animated progress width
    const progressWidth = useSharedValue(0);

    useEffect(() => {
        progressWidth.value = withTiming(progressPercentage, { duration: 1000 });
    }, [progressPercentage]);

    const progressStyle = useAnimatedStyle(() => {
        return {
            width: `${progressWidth.value}%`,
        };
    });

    return (
        <View style={styles.container}>
            <View style={styles.labelContainer}>
                <Text style={styles.xpText}>{currentXP} XP</Text>
                <Text style={styles.remainingText}>
                    {nextLevelXP - currentXP} XP to level {level + 1}
                </Text>
            </View>

            <View style={styles.progressBarContainer}>
                <Animated.View style={[styles.progressBar, progressStyle]} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginLeft: 12,
    },
    labelContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    xpText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#3B82F6',
    },
    remainingText: {
        fontSize: 12,
        color: '#6B7280',
    },
    progressBarContainer: {
        height: 8,
        backgroundColor: '#E5E7EB',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#3B82F6',
        borderRadius: 4,
    },
});

export default XPProgressBar;