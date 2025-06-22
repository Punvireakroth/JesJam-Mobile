import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

interface AuthHeaderProps {
    title: string;
    showSkip?: boolean;
    onSkip?: () => void;
}

const AuthHeader: React.FC<AuthHeaderProps> = ({ title, showSkip = false, onSkip }) => {
    const navigation = useNavigation();

    return (
        <View style={styles.headerContainer}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="chevron-back" size={24} color="#3B82F6" />
                <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>

            <Text style={styles.title}>{title}</Text>

            {showSkip && (
                <TouchableOpacity style={styles.skipButton} onPress={onSkip}>
                    <Text style={styles.skipText}>Skip</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFFFFF',
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    backText: {
        color: '#3B82F6',
        fontSize: 16,
        fontWeight: '500',
        marginLeft: 4,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#3B82F6',
        textAlign: 'center',
        flex: 2,
    },
    skipButton: {
        paddingHorizontal: 8,
        flex: 1,
        alignItems: 'flex-end',
    },
    skipText: {
        color: '#3B82F6',
        fontSize: 16,
        fontWeight: '500',
    },
});

export default AuthHeader;