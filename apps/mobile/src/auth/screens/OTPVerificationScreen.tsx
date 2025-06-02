import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../hooks/useAuth';
import { Formik } from 'formik';
import { otpVerificationSchema } from '../utils/validationSchemas';

const OTPVerificationScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { verifyOtp, state, clearError } = useAuth();
    const [countdown, setCountdown] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const [isResending, setIsResending] = useState(false);

    const { phone } = route.params as { phone: string };

    // Reference to timer
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Hide phone number's middle digits
    const formatPhone = (phoneNumber: string) => {
        if (!phoneNumber) return '';

        const digits = phoneNumber.replace(/\\D/g, '');
        if (digits.length <= 4) return phoneNumber;
        return `${digits.substring(0, 3)}****${digits.substring(digits.length - 3)}`;
    }

    // Display time as (mm:ss)
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    // Start countdown timer
    useEffect(() => {
        timerRef.current = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    if (timerRef.current) clearInterval(timerRef.current);
                    setCanResend(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [])

    // Handle OTP resend
    const handleResendOTP = async () => {
        try {
            setIsResending(true);

            // Call resend OTP API
            // TODO: Implemented in authService
            // await authService.resendOtp({ phone });

            // For demo, just show alert
            Alert.alert('OTP Sent', `A new verification code has been sent to ${formatPhone(phone)}`);

            // Reset countdown
            setCountdown(300);
            setCanResend(false);

            // Restart timer
            if (timerRef.current) clearInterval(timerRef.current);
            timerRef.current = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        if (timerRef.current) clearInterval(timerRef.current);
                        setCanResend(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } catch (error) {
            Alert.alert('Error', 'Failed to resend OTP. Please try again.');
        } finally {
            setIsResending(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <View style={styles.content}>
                <Text style={styles.title}>Verify Your Phone</Text>

                <Text style={styles.description}>
                    We've sent a verification code to {formatPhone(phone)}
                </Text>

                {state.error && (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{state.error}</Text>
                        <TouchableOpacity onPress={clearError}>
                            <Text style={styles.dismissText}>Dismiss</Text>
                        </TouchableOpacity>
                    </View>
                )}

                <Formik
                    initialValues={{ phone, code: '' }}
                    validationSchema={otpVerificationSchema}
                    onSubmit={async (values) => {
                        try {
                            await verifyOtp({
                                phone: values.phone,
                                code: values.code,
                            });
                        } catch (error) {
                            console.error('OTP verification error:', error);
                        }
                    }}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
                        <View style={styles.formContainer}>
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Verification Code</Text>
                                <TextInput
                                    style={[
                                        styles.input,
                                        touched.code && errors.code ? styles.inputError : null,
                                    ]}
                                    placeholder="Enter 6-digit code"
                                    keyboardType="number-pad"
                                    maxLength={6}
                                    onChangeText={handleChange('code')}
                                    onBlur={handleBlur('code')}
                                    value={values.code}
                                />
                                {touched.code && errors.code && (
                                    <Text style={styles.errorText}>{errors.code}</Text>
                                )}
                            </View>

                            <TouchableOpacity
                                style={styles.verifyButton}
                                onPress={() => handleSubmit()}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <ActivityIndicator color="#FFFFFF" size="small" />
                                ) : (
                                    <Text style={styles.verifyButtonText}>Verify</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    )}
                </Formik>

                <View style={styles.countdownContainer}>
                    <Text style={styles.countdownText}>
                        {canResend ? "Didn't receive the code?" : `Code expires in ${formatTime(countdown)}`}
                    </Text>
                    {canResend ? (
                        <TouchableOpacity
                            onPress={handleResendOTP}
                            disabled={isResending}
                            style={styles.resendButton}
                        >
                            {isResending ? (
                                <ActivityIndicator size="small" color="#3B82F6" />
                            ) : (
                                <Text style={styles.resendText}>Resend Code</Text>
                            )}
                        </TouchableOpacity>
                    ) : null}
                </View>

                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.backButtonText}>Change Phone Number</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    content: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    description: {
        textAlign: 'center',
        color: '#6B7280',
        marginBottom: 30,
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
        fontSize: 24,
        letterSpacing: 8,
        textAlign: 'center',
    },
    inputError: {
        borderColor: '#DC2626',
    },
    verifyButton: {
        backgroundColor: '#3B82F6',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    verifyButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    countdownContainer: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20,
    },
    countdownText: {
        color: '#6B7280',
        marginBottom: 5,
    },
    resendButton: {
        padding: 5,
    },
    resendText: {
        color: '#3B82F6',
        fontWeight: 'bold',
    },
    backButton: {
        paddingVertical: 10,
        alignItems: 'center',
    },
    backButtonText: {
        color: '#6B7280',
        textDecorationLine: 'underline',
    },
});

export default OTPVerificationScreen;

