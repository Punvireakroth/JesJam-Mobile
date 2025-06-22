import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Image, ActivityIndicator, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SocialLoginButtonProps {
    provider: 'google' | 'facebook';
    onPress: () => void;
    isLoading?: boolean;
    label?: string;
}

const SocialLoginButton: React.FC<SocialLoginButtonProps> = ({
    provider,
    onPress,
    isLoading,
    label }) => {

    // Default labels
    const defaultLabels = {
        google: 'Continue with Google',
        facebook: 'Continue with Facebook',
    };

    // Icon sources
    const icons = {
        google: require('../../../assets/facebook-icon.svg'),
        facebook: require('../../../assets/facebook-icon.svg'),
    };


    return (
        <TouchableOpacity style={[
            styles.button,
            provider === 'facebook' && styles.socialButton,
            provider === 'google' && styles.socialButton
        ]} onPress={onPress} disabled={isLoading}>
            <Image source={icons[provider]} style={styles.icon} />
            <Text style={[
                styles.buttonText,
                provider === 'facebook' && styles.socialText,
                provider === 'google' && styles.socialText
            ]}>{label || defaultLabels[provider]}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        minHeight: 48,
    },
    socialButton: {
        backgroundColor: '#FFFFFF',
        borderWidth: 3,
        borderColor: '#E5E7EB',
    },
    facebookButton: {
        backgroundColor: '#1877F2',
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        width: 24,
        height: 24,
        marginRight: 12,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '500',
    },
    socialText: {
        color: '#757575',
    },
})

export default SocialLoginButton;
