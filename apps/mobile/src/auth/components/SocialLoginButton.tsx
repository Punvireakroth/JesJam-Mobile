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
            <Image source={require('assets/facebook-icon.jpg')} style={styles.icon} />
            <Text style={[
                styles.buttonText,
            ]}>{label}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderBottomWidth: 3,
        borderColor: '#3B82F6',
        paddingVertical: 14,
        borderRadius: 8,
        marginTop: 10,
        backgroundColor: '#F3F4F6',
    },
    icon: {
        width: 24,
        height: 24,
        marginRight: 12,
    },
    buttonText: {
        color: '#3B82F6',
        fontWeight: '600',
        fontSize: 16,
    },
})

export default SocialLoginButton;
