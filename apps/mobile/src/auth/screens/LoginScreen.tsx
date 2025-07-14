import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator, SafeAreaView, ScrollView, KeyboardAvoidingView, Platform, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Formik } from 'formik';
import { loginSchema } from '../utils/validationSchemas';
import { useAuth } from '../hooks/useAuth';
import SocialLoginButton from '../components/SocialLoginButton';
import { useGoogleAuth, useFacebookAuth, extractAccessToken } from '../services/socialAuthService';
import AuthHeader from '../components/AuthHeader';

const LoginScreen: React.FC = () => {
    const navigation = useNavigation();
    const { login, socialLogin, guestLogin, state, clearError } = useAuth();
    const [isPhoneLogin, setIsPhoneLogin] = useState(false);

    // Social auth hooks
    const facebookAuth = useFacebookAuth();

    // Formik state
    const [error, setError] = useState<string | null>(null);

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
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
                <AuthHeader
                    title="Log in"
                    showSkip={true}
                    onSkip={guestLogin}
                />

                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    {state.error && (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>{state.error}</Text>
                            <TouchableOpacity onPress={clearError}>
                                <Text style={styles.dismissText}>Dismiss</Text>
                            </TouchableOpacity>
                        </View>
                    )}

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

                    <View style={styles.spacer} />

                    <View style={styles.orContainer}>
                        <View style={styles.divider} />
                        <Text style={styles.orText}>OR</Text>
                        <View style={styles.divider} />
                    </View>

                    <View style={styles.socialButtonsContainer}>
                        <SocialLoginButton
                            onPress={handleFacebookLogin}
                            isLoading={facebookAuth.isLoading}
                            label="Continue with Facebook"
                        />

                        {/* New Phone Number Button */}
                        <TouchableOpacity
                            style={styles.phoneButton}
                            onPress={() => setIsPhoneLogin(true)}
                        >
                            <Image source={require('assets/phone-icon.jpg')} style={styles.icon} />
                            <Text style={styles.phoneButtonText}>Sign in with Phone Number</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    spacer: {
        flex: 1,
    },
    formContainer: {
        marginBottom: 20,
    },
    inputContainer: {
        marginBottom: 15,
    },
    input: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        paddingVertical: 16,
        paddingHorizontal: 16,
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
        fontWeight: '600',
        fontSize: 16,
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
    phoneButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        borderWidth: 1,
        borderBottomWidth: 3,
        borderColor: '#E5E7EB',
        minHeight: 48,
    },
    phoneButtonText: {
        fontSize: 16,
        color: '#303030',
        opacity: 0.8,
        fontWeight: '600',
    },
    icon: {
        width: 24,
        height: 24,
        marginRight: 10,
    },
})

export default LoginScreen;
