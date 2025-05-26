import React, { useEffect } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../hooks/useAuth';

interface AuthGuardProps {
    children: React.ReactNode;
    allowGuest?: boolean;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children, allowGuest = false }) => {
    const { state } = useAuth();
    const navigation = useNavigation();

    useEffect(() => {
        if (!state.isLoading) {
            if (!state.isAuthenticated) {
                // Navigate to login if not authenticated
                navigation.navigate('Login' as never);
            } else if (state.isGuest && !allowGuest) {
                // Navigate to guest conversion screen if guest mode not allowed for this route
                navigation.navigate('GuestConversion' as never);
            }
        }
    }, [state.isLoading, state.isAuthenticated, state.isGuest, allowGuest, navigation]);

    if (state.isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (!state.isAuthenticated) {
        return null;
    }

    if (state.isGuest && !allowGuest) {
        return null;
    }

    return <>{children}</>;
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
