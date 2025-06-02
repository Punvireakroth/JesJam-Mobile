import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Image, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Formik } from 'formik';
import { TextInput } from 'react-native-gesture-handler';
import { loginSchema } from '../utils/validationSchemas';
import { useAuth } from '../hooks/useAuth';
import SocialLoginButton from '../components/SocialLoginButton';
import { useGoogleAuth, useFacebookAuth, extractAccessToken } from '../services/socialAuthService';

const LoginScreen: React.FC = () => {
    const navigation = useNavigation();
    const { login, socialLogin, guestLogin, state, clearError } = useAuth();
    const [isPhoneLogin, setIsPhoneLogin] = useState(false);

    // Social auth hooks
    const googleAuth = useGoogleAuth();
    const facebookAuth = useFacebookAuth();

    // Formik state
    const [error, setError] = useState<string | null>(null);

    // Google
    const handleGoogleLogin = async () => {
        try {
            const result = await googleAuth.promptAsync();
            const token = extractAccessToken(result);

            if (token) {
                await socialLogin({
                    provider: 'google',
                    access_token: token,
                });
            }
        } catch (error) {
            console.error('Google login error:', error);
            setError('Failed to login with Google');
        }
    }

    // Facebook
    const handleFacebookLogin = async () => {
        try {
            const result = await facebookAuth.promptAsync();
            const token = extractAccessToken(result);

            if (token) {
                await socialLogin({
                    provider: 'facebook',
                    access_token: token,
                });
            }
        } catch (error) {
            console.error('Facebook login error:', error);
            setError('Failed to login with Facebook');
        }
    }

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.logoContainer}>
                    <Image
                        source={require('../../assets/logo.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </View>

                <Text style={styles.title}>Welcome Back</Text>

                {state.error && (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{state.error}</Text>
                        <TouchableOpacity onPress={clearError}>
                            <Text style={styles.dismissText}>Dismiss</Text>
                        </TouchableOpacity>
                    </View>
                )}

                <View style={styles.toggleContainer}>
                    <TouchableOpacity style={[styles.toggleButton, !isPhoneLogin && styles.activeToggle]}
                        onPress={() => setIsPhoneLogin(false)}>
                        <Text style={[styles.toggleText, !isPhoneLogin && styles.activeToggleText]}>Email</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.toggleButton, isPhoneLogin && styles.activeToggle]}
                        onPress={() => setIsPhoneLogin(true)}>
                        <Text style={[styles.toggleText, isPhoneLogin && styles.activeToggleText]}>Phone</Text>
                    </TouchableOpacity>
                </View>

                <Formik initialValues={{ email: '', password: '', phone: '' }}
                    validationSchema={loginSchema}
                    onSubmit={async (values) => {
                        try {
                            await login({
                                email: isPhoneLogin ? undefined : values.email,
                                phone: isPhoneLogin ? values.phone : undefined,
                                password: values.password,
                            });
                        } catch (error) {
                            console.error('Login error:', error);
                            setError('Failed to login');
                        }
                    }}>
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
                        <View style={styles.formContainer}>
                            {isPhoneLogin ? (
                                <>
                                    <View style={styles.inputContainer}>
                                        <Text style={styles.label}>Phone Number</Text>
                                        <TextInput
                                            style={[
                                                styles.input,
                                                touched.phone && errors.phone ? styles.inputError : null,
                                            ]}
                                            placeholder="+855 12 345 678"
                                            keyboardType="phone-pad"
                                            onChangeText={handleChange('phone')}
                                            onBlur={handleBlur('phone')}
                                            value={values.phone}
                                        />
                                        {touched.phone && errors.phone && (
                                            <Text style={styles.errorText}>{errors.phone}</Text>
                                        )}
                                    </View>
                                </>
                            ) : (
                                <>
                                    <View style={styles.inputContainer}>
                                        <Text style={styles.label}>Email</Text>
                                        <TextInput
                                            style={[
                                                styles.input,
                                                touched.email && errors.email ? styles.inputError : null,
                                            ]}
                                            placeholder="your.email@example.com"
                                            keyboardType="email-address"
                                            autoCapitalize="none"
                                            onChangeText={handleChange('email')}
                                            onBlur={handleBlur('email')}
                                            value={values.email}
                                        />
                                        {touched.email && errors.email && (
                                            <Text style={styles.errorText}>{errors.email}</Text>
                                        )}
                                    </View>
                                </>
                            )}

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Password</Text>
                                <TextInput
                                    style={[
                                        styles.input,
                                        touched.password && errors.password ? styles.inputError : null,
                                    ]}
                                    placeholder="Enter your password"
                                    secureTextEntry
                                    onChangeText={handleChange('password')}
                                    onBlur={handleBlur('password')}
                                    value={values.password}
                                />
                                {touched.password && errors.password && (
                                    <Text style={styles.errorText}>{errors.password}</Text>
                                )}
                            </View>

                            <TouchableOpacity
                                style={styles.forgotPasswordButton}
                                onPress={() => navigation.navigate('ForgotPassword' as never)}
                            >
                                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.loginButton}
                                onPress={() => handleSubmit()}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <ActivityIndicator color="#FFFFFF" size="small" />
                                ) : (
                                    <Text style={styles.loginButtonText}>Log In</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    )}
                </Formik>

                <View style={styles.orContainer}>
                    <View style={styles.divider} />
                    <Text style={styles.orText}>OR</Text>
                    <View style={styles.divider} />
                </View>

                <View style={styles.socialButtonsContainer}>
                    <SocialLoginButton
                        provider="google"
                        onPress={handleGoogleLogin}
                        isLoading={googleAuth.isLoading}
                    />
                    <SocialLoginButton
                        provider="facebook"
                        onPress={handleFacebookLogin}
                        isLoading={facebookAuth.isLoading}
                    />
                </View>
                <TouchableOpacity
                    style={styles.guestButton}
                    onPress={guestLogin}
                    disabled={state.isLoading}
                >
                    <Text style={styles.guestButtonText}>Continue as Guest</Text>
                </TouchableOpacity>

                <View style={styles.registerContainer}>
                    <Text style={styles.registerText}>Don't have an account?</Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Register' as never)}
                    >
                        <Text style={styles.registerLink}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
    },
    scrollContainer: {
        flexGrow: 1,
        padding: 20,
    },
    logoContainer: {
        alignItems: 'center',
        marginTop: 40,
        marginBottom: 20,
    },
    logo: {
        width: 120,
        height: 120,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    errorContainer: {
        backgroundColor: '#FEE2E2',
        padding: 10,
        borderRadius: 8,
        marginBottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    errorText: {
        color: '#DC2626',
        fontSize: 12,
        marginTop: 5,
    },
    dismissText: {
        color: '#DC2626',
        fontWeight: 'bold',
    },
    toggleContainer: {
        flexDirection: 'row',
        marginBottom: 20,
        borderRadius: 8,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    toggleButton: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
    },
    activeToggle: {
        backgroundColor: '#3B82F6',
    },
    toggleText: {
        fontWeight: '500',
        color: '#6B7280',
    },
    activeToggleText: {
        color: '#FFFFFF',
    },
    formContainer: {
        marginBottom: 20,
    },
    inputContainer: {
        marginBottom: 15,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 8,
        color: '#374151',
    },
    input: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },
    inputError: {
        borderColor: '#DC2626',
    },
    forgotPasswordButton: {
        alignSelf: 'flex-end',
        marginBottom: 20,
    },
    forgotPasswordText: {
        color: '#3B82F6',
        fontSize: 14,
    },
    loginButton: {
        backgroundColor: '#3B82F6',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    loginButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    orContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: '#E5E7EB',
    },
    orText: {
        paddingHorizontal: 10,
        color: '#6B7280',
    },
    socialButtonsContainer: {
        marginBottom: 20,
        gap: 10,
    },
    guestButton: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 20,
    },
    guestButtonText: {
        color: '#6B7280',
        fontWeight: '500',
        fontSize: 16,
    },
    registerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 30,
    },
    registerText: {
        color: '#6B7280',
    },
    registerLink: {
        marginLeft: 5,
        color: '#3B82F6',
        fontWeight: 'bold',
    },
})

export default LoginScreen;
