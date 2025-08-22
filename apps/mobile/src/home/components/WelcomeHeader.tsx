import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

interface WelcomeHeaderProps {
    name: string;
    level: number;
    profilePicture?: string | null;
}

const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({
    name,
    level,
    profilePicture
}) => {
    // Generate personalized welcome message based on time of day
    const welcomeMessage = useMemo(() => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    }, []);

    // Get first name only
    const firstName = name.split(' ')[0];

    return (
        <View style={styles.container}>
            <View style={styles.textContainer}>
                <Text style={styles.welcomeText}>{welcomeMessage},</Text>
                <Text style={styles.nameText}>{firstName}!</Text>
            </View>

            <View style={styles.profileContainer}>
                <View style={styles.levelBadge}>
                    <Text style={styles.levelText}>{level}</Text>
                </View>

                <Image
                    source={
                        profilePicture
                            ? { uri: profilePicture }
                            : { uri: 'https://i.pravatar.cc/300' }
                    }
                    style={styles.profileImage}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#FFFFFF',
    },
    textContainer: {
        flex: 1,
    },
    welcomeText: {
        fontSize: 14,
        color: '#6B7280',
    },
    nameText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    profileContainer: {
        position: 'relative',
    },
    profileImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#E5E7EB',
    },
    levelBadge: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: '#3B82F6',
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    levelText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: 'bold',
    },
});

export default WelcomeHeader;