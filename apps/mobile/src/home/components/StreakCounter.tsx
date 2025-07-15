import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';

interface StreakCounterProps {
    count: number;
}

const StreakCounter: React.FC<StreakCounterProps> = ({ count }) => {
    // Animation for the flame
    const rotation = useSharedValue(0);
    const scale = useSharedValue(1);

    React.useEffect(() => {
        // Create subtle animation for the flame
        rotation.value = withRepeat(
            withTiming(-5, { duration: 1000, easing: Easing.inOut(Easing.quad) }),
            -1,
            true
        );

        scale.value = withRepeat(
            withTiming(1.1, { duration: 1000, easing: Easing.inOut(Easing.quad) }),
            -1,
            true
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { rotate: `${rotation.value}deg` },
                { scale: scale.value }
            ]
        };
    });

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.flameContainer, animatedStyle]}>
                <Image
                    source={require('../../../assets/streak.png')}
                    style={styles.flameIcon}
                />
            </Animated.View>
            <Text style={styles.streakText}>{count}</Text>
            <Text style={styles.streakLabel}>day{count !== 1 ? 's' : ''}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FEF3C7',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 16,
    },
    flameContainer: {
        height: 24,
        width: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    flameIcon: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
    },
    streakText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#D97706',
        marginLeft: 4,
    },
    streakLabel: {
        fontSize: 14,
        color: '#D97706',
        marginLeft: 4,
    },
});

export default StreakCounter;