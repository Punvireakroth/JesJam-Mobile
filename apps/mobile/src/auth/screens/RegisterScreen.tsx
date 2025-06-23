import React, { useState } from 'react';
import {
    View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator, SafeAreaView,
    ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Formik } from 'formik';
import { TextInput } from 'react-native-gesture-handler';
import { registerSchema } from '../utils/validationSchemas';
import { useAuth } from '../hooks/useAuth';
import SocialLoginButton from '../components/SocialLoginButton';
import { useGoogleAuth, useFacebookAuth, extractAccessToken } from '../services/socialAuthService';
import PasswordStrengthIndicator from '../components/PasswordStrengthIndicator';
import AuthHeader from '../components/AuthHeader';

const RegisterScreen: React.FC = () => {
    const navigation = useNavigation();
    const { register, socialLogin, guestLogin, state, clearError } = useAuth();
    const [isPhoneRegistration, setIsPhoneRegistration] = useState(false);

    // Social registation
    const googleAuth = useGoogleAuth();
    const facebookAuth = useFacebookAuth();

    // Google auth
    const handleGoogleRegister = async () => {
        try {
            const result = await googleAuth.promptAsync();
            const token = extractAccessToken(result);

            if (token) {
                await socialLogin({ provider: 'google', access_token: token });
            }
        } catch (error) {
            console.error('Google auth error: ', error);
        }
    }

    // Facebook auth
    const handleFacebookRegister = async () => {
        try {
            const result = await facebookAuth.promptAsync();
            const token = extractAccessToken(result);

            if (token) {
                await socialLogin({ provider: 'facebook', access_token: token });
            }
        } catch (error) {
            console.error('Facebook auth error: ', error);
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <AuthHeader
                    title="Create Account"
                    showSkip={true}
                    onSkip={guestLogin}
                />

                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    {/* Error Registration */}
                    {state.error && (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>{state.error}</Text>
                            <TouchableOpacity onPress={clearError}>
                                <Text style={styles.dismissText}>Dismiss</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Form Container */}
                    <Formik
                        initialValues={{ name: '', email: '', phone: '', password: '', password_confirmation: '' }}
                        validationSchema={registerSchema}
                        onSubmit={async (values) => {
                            try {
                                await register({
                                    name: values.name,
                                    email: isPhoneRegistration ? undefined : values.email,
                                    phone: isPhoneRegistration ? values.phone : undefined,
                                    password: values.password,
                                    password_confirmation: values.password_confirmation,
                                });
                            } catch (error) {
                                console.error('Registration form error:', error);
                            }
                        }}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
                            <View style={styles.formContainer}>
                                {/* Full Name */}
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        style={[
                                            styles.input,
                                            touched.name && errors.name ? styles.inputError : null,
                                        ]}
                                        placeholder="Your Name"
                                        onChangeText={handleChange('name')}
                                        onBlur={handleBlur('name')}
                                        value={values.name}
                                    />
                                    {touched.name && errors.name && (
                                        <Text style={styles.errorText}>{errors.name}</Text>
                                    )}
                                </View>

                                {/* Phone Registration */}
                                {isPhoneRegistration ? (
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
                                ) : (
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
                                )}

                                {/* Password */}
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        style={[
                                            styles.input,
                                            touched.password && errors.password ? styles.inputError : null,
                                        ]}
                                        placeholder="Password"
                                        secureTextEntry
                                        onChangeText={handleChange('password')}
                                        onBlur={handleBlur('password')}
                                        value={values.password}
                                    />
                                    {values.password.length > 0 && (
                                        <PasswordStrengthIndicator password={values.password} />
                                    )}
                                    {touched.password && errors.password && (
                                        <Text style={styles.errorText}>{errors.password}</Text>
                                    )}
                                </View>

                                {/* PW confirmation */}
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        style={[
                                            styles.input,
                                            touched.password_confirmation && errors.password_confirmation ? styles.inputError : null,
                                        ]}
                                        placeholder="Confirm Password"
                                        secureTextEntry
                                        onChangeText={handleChange('password_confirmation')}
                                        onBlur={handleBlur('password_confirmation')}
                                        value={values.password_confirmation}
                                    />
                                    {touched.password_confirmation && errors.password_confirmation && (
                                        <Text style={styles.errorText}>{errors.password_confirmation}</Text>
                                    )}
                                </View>
                                {/* Submit Button */}
                                <TouchableOpacity
                                    style={styles.registerButton}
                                    onPress={() => handleSubmit()}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <ActivityIndicator size="small" color="#FFFFFF" />
                                    ) : (
                                        <Text style={styles.registerButtonText}>Register</Text>
                                    )}
                                </TouchableOpacity>
                            </View>
                        )}
                    </Formik>

                    <View style={styles.spacer} />

                    <View style={styles.orContainer}>
                        <View style={styles.divider} />
                        <Text style={styles.orText}>Or</Text>
                        <View style={styles.divider} />
                    </View>

                    {/* Social Buttons */}
                    <View style={styles.socialButtonsContainer}>
                        <SocialLoginButton
                            onPress={handleFacebookRegister}
                            isLoading={facebookAuth.isLoading}
                            label="Sign up with Facebook"
                        />

                        {/* New Phone Number Button */}
                        <TouchableOpacity
                            style={styles.phoneButton}
                            onPress={() => setIsPhoneRegistration(true)}
                        >
                            <Image source={require('assets/phone-icon.jpg')} style={styles.icon} />
                            <Text style={styles.phoneButtonText}>Sign up with Phone Number</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView >
            </KeyboardAvoidingView >
        </SafeAreaView>
    )
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
        marginTop: 20,
        marginBottom: 10,
    },
    logo: {
        width: 100,
        height: 100,
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
    registerButton: {
        backgroundColor: '#3B82F6',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    registerButtonText: {
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
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 30,
    },
    loginText: {
        color: '#6B7280',
    },
    loginLink: {
        marginLeft: 5,
        color: '#3B82F6',
        fontWeight: 'bold',
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

export default RegisterScreen;


