import { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface PasswordStrengthIndicatorProps {
    password: string;
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ password = '' }) => {

    const { strength, color, label } = useMemo(() => {
        if (!password) return { strength: 0, color: '#E5E7EB', label: 'Enter password' };

        let score = 0;

        // Length
        if (password.length >= 8) score++;
        if (password.length >= 12) score++;

        // Character types
        if (/[A-Z]/.test(password)) score += 1;
        if (/[a-z]/.test(password)) score += 1;
        if (/[0-9]/.test(password)) score += 1;
        if (/[^A-Za-z0-9]/.test(password)) score += 1;


        // Password score to color mapping
        if (score <= 2) {
            return { strength: 1, label: 'Weak', color: '#DC2626' };
        } else if (score <= 4) {
            return { strength: 2, label: 'Medium', color: '#F59E0B' };
        } else {
            return { strength: 3, label: 'Strong', color: '#10B981' };
        }
    }, [password]);

    return (
        <View style={styles.container}>
            <View style={styles.strengthBars}>
                <View
                    style={[
                        styles.strengthBar,
                        { backgroundColor: strength >= 1 ? color : '#E5E7EB' },
                    ]}
                />
                <View
                    style={[
                        styles.strengthBar,
                        { backgroundColor: strength >= 2 ? color : '#E5E7EB' },
                    ]}
                />
                <View
                    style={[
                        styles.strengthBar,
                        { backgroundColor: strength >= 3 ? color : '#E5E7EB' },
                    ]}
                />
            </View>
            <Text style={[styles.strengthText, { color }]}>{label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 8,
    },
    strengthBars: {
        flexDirection: 'row',
        height: 4,
        marginBottom: 4,
        gap: 4,
    },
    strengthBar: {
        flex: 1,
        borderRadius: 2,
    },
    strengthText: {
        fontSize: 12,
        fontWeight: '500',
    },
})


export default PasswordStrengthIndicator;