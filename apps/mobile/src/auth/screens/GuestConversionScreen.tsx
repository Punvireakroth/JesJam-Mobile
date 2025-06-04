import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Formik } from 'formik';
import { TextInput } from 'react-native-gesture-handler';
import { guestToUserSchema } from '../utils/validationSchemas';
import { useAuth } from '../hooks/useAuth';
import PasswordStrengthIndicator from '../components/PasswordStrengthIndicator';

const GuestConversionScreen: React.FC = () => {
    const navigation = useNavigation();
    const { convertGuestToUser, state, clearError } = useAuth();


    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Image
                    source={require('../../../assets/icon.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />

                <Text style={styles.title}>Create an Account</Text>
                <Text style={styles.subtitle}>
                    Save your progress and unlock all features by creating an account.
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
                    initialValues={{ name: '', email: '', phone: '', password: '', password_confirmation: '' }}
                    validationSchema={guestToUserSchema}
                    onSubmit={async (values) => {
                        try {
                            await convertGuestToUser({
                                name: values.name,
                                email: values.email,
                                phone: values.phone,
                                password: values.password,
                                password_confirmation: values.password_confirmation,
                                guest_migration_token: '', // This is handled in the service
                            });
                        } catch (error) {
                            console.error('Guest conversion error:', error);
                        }
                    }}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
                        <View style={styles.formContainer}>
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Full Name</Text>
                                <TextInput
                                    style={[
                                        styles.input,
                                        touched.name && errors.name ? styles.inputError : null,
                                    ]}
                                    placeholder="Enter your full name"
                                    onChangeText={handleChange('name')}
                                    onBlur={handleBlur('name')}
                                    value={values.name}
                                />
                                {touched.name && errors.name && (
                                    <Text style={styles.errorText}>{errors.name}</Text>
                                )}
                            </View>

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

                            <View style={styles.dividerTextContainer}>
                                <View style={styles.divider} />
                                <Text style={styles.dividerText}>OR</Text>
                                <View style={styles.divider} />
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Phone Number (Optional if email provided)</Text>
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

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Password</Text>
                                <TextInput
                                    style={[
                                        styles.input,
                                        touched.password && errors.password ? styles.inputError : null,
                                    ]}
                                    placeholder="Create a strong password"
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

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Confirm Password</Text>
                                <TextInput
                                    style={[
                                        styles.input,
                                        touched.password_confirmation && errors.password_confirmation ? styles.inputError : null,
                                    ]}
                                    placeholder="Confirm your password"
                                    secureTextEntry
                                    onChangeText={handleChange('password_confirmation')}
                                    onBlur={handleBlur('password_confirmation')}
                                    value={values.password_confirmation}
                                />
                                {touched.password_confirmation && errors.password_confirmation && (
                                    <Text style={styles.errorText}>{errors.password_confirmation}</Text>
                                )}
                            </View>

                            <TouchableOpacity
                                style={styles.convertButton}
                                onPress={() => handleSubmit()}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <ActivityIndicator color="#FFFFFF" size="small" />
                                ) : (
                                    <Text style={styles.convertButtonText}>Create Account & Save Progress</Text>
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.laterButton}
                                onPress={() => navigation.goBack()}
                            >
                                <Text style={styles.laterButtonText}>Continue as Guest</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </Formik>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    scrollContainer: {
        flexGrow: 1,
        padding: 20,
    },
    logo: {
        width: 80,
        height: 80,
        alignSelf: 'center',
        marginTop: 20,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    subtitle: {
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
        fontSize: 16,
    },
    inputError: {
        borderColor: '#DC2626',
    },
    dividerTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 15,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: '#E5E7EB',
    },
    dividerText: {
        paddingHorizontal: 10,
        color: '#6B7280',
    },
    convertButton: {
        backgroundColor: '#3B82F6',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    convertButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    laterButton: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    laterButtonText: {
        color: '#6B7280',
    },
});

export default GuestConversionScreen;
