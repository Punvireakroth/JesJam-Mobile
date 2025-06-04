import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, SafeAreaView, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');


const slides = [
    {
        id: '1',
        image: require('../../../assets/icon.png'),
        title: 'Welcome to JesJam',
        description: 'Your personal Khmer Biology learning app designed for Grade 12 students.',
    },
    {
        id: '2',
        image: require('../../../assets/icon.png'),
        title: 'Spaced Repetition',
        description: 'Learn efficiently with our smart flashcard system that helps you remember what you learn.',
    },
    {
        id: '3',
        image: require('../../../assets/icon.png'),
        title: 'Practice for Exams',
        description: 'Build confidence with exercises designed to match the national exam format.',
    },
    {
        id: '4',
        image: require('../../../assets/icon.png'),
        title: 'Study Anywhere',
        description: 'Full offline functionality lets you study even without internet access.',
    },
];

const OnboardingScreen: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);
    const navigation = useNavigation();

    // Animation values
    const fadeAnim = useSharedValue(1);

    // Animated styles
    const fadeStyle = useAnimatedStyle(() => {
        return {
            opacity: fadeAnim.value,
        };
    });

    // Handle next slide
    const goToNextSlide = () => {
        if (currentIndex < slides.length - 1) {
            flatListRef.current?.scrollToIndex({
                index: currentIndex + 1,
                animated: true,
            });
        } else {
            completeOnboarding();
        }
    };

    // Handle skip onboarding
    const completeOnboarding = async () => {
        try {
            // Animate fade out
            fadeAnim.value = withTiming(0, {
                duration: 400,
                easing: Easing.out(Easing.ease),
            });

            // Save onboarding completion status
            await AsyncStorage.setItem('HAS_COMPLETED_ONBOARDING', 'true');

            // Navigate to appropriate screen based on auth state
            // TODO: Implement auth state check if user is already logged in
            setTimeout(() => {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Login' as never }],
                });
            }, 500);
        } catch (error) {
            console.error('Failed to save onboarding status:', error);
        }
    };

    // Handle slide change
    const handleViewableItemsChanged = ({ viewableItems }: any) => {
        if (viewableItems.length > 0) {
            setCurrentIndex(viewableItems[0].index);
        }
    };

    // Render dot indicator
    const renderDotIndicator = () => {
        return (
            <View style={styles.paginationContainer}>
                {slides.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.paginationDot,
                            index === currentIndex ? styles.paginationDotActive : {},
                        ]}
                    />
                ))}
            </View>
        );
    };

    // Render slide item
    const renderItem = ({ item }: { item: typeof slides[0] }) => {
        return (
            <View style={styles.slide}>
                <Image source={item.image} style={styles.image} resizeMode="contain" />
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <Animated.View style={[styles.content, fadeStyle]}>
                <TouchableOpacity
                    style={styles.skipButton}
                    onPress={completeOnboarding}
                >
                    <Text style={styles.skipText}>Skip</Text>
                </TouchableOpacity>

                <FlatList
                    ref={flatListRef}
                    data={slides}
                    renderItem={renderItem}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={item => item.id}
                    onViewableItemsChanged={handleViewableItemsChanged}
                    viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
                    initialNumToRender={1}
                    maxToRenderPerBatch={1}
                    windowSize={3}
                    style={styles.flatList}
                />

                {renderDotIndicator()}

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.nextButton}
                        onPress={goToNextSlide}
                    >
                        <Text style={styles.nextButtonText}>
                            {currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    content: {
        flex: 1,
    },
    skipButton: {
        position: 'absolute',
        top: 10,
        right: 20,
        zIndex: 10,
        padding: 10,
    },
    skipText: {
        color: '#6B7280',
        fontWeight: '500',
    },
    flatList: {
        flex: 1,
    },
    slide: {
        width,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    image: {
        width: width * 0.8,
        height: height * 0.4,
        marginBottom: 40,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        color: '#1F2937',
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        color: '#6B7280',
        paddingHorizontal: 20,
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#D1D5DB',
        marginHorizontal: 5,
    },
    paginationDotActive: {
        backgroundColor: '#3B82F6',
        width: 20,
    },
    buttonContainer: {
        paddingHorizontal: 20,
        paddingBottom: 30,
    },
    nextButton: {
        backgroundColor: '#3B82F6',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    nextButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default OnboardingScreen;