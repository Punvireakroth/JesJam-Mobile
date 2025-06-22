import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Image, ActivityIndicator, View } from 'react-native';
const FacebookIcon = require('assets/svg/facebook-icon.svg');
interface SocialLoginButtonProps {
    onPress: () => void;
    isLoading?: boolean;
    label?: string;
}

const SocialLoginButton: React.FC<SocialLoginButtonProps> = ({
    onPress,
    isLoading,
    label }) => {

    return (
        <TouchableOpacity style={[
            styles.button,
        ]} onPress={onPress} disabled={isLoading}>
            <Text style={[
                styles.buttonText,
            ]}>{label}</Text>
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
        borderWidth: 1,
        borderColor: '#E5E7EB',
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
        color: '#757575',
        fontWeight: '500',
    },
})

export default SocialLoginButton;
