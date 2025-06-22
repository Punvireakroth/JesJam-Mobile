import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView } from "react-native";
import { useNavigation } from "@react-navigation/native";


const WelcomeScreen: React.FC = () => {
    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.contentContainer}>
                <View style={styles.logoContainer}>
                    <Image source={require('../../../assets/icon.png')}
                        style={styles.logo}
                        resizeMode="contain" />
                    <Text style={styles.appName}>JesJam</Text>
                    <Text style={styles.tagline}>Learn for free. Forever.</Text>
                </View>

                <View style={styles.spacer} />

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.getStartedButton}
                        onPress={() => navigation.navigate('Register' as never)}
                    >
                        <Text style={styles.getStartedButtonText}>GET STARTED</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.loginButton}
                        onPress={() => navigation.navigate('Login' as never)}
                    >
                        <Text style={styles.loginButtonText}>I ALREADY HAVE AN ACCOUNT</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: 20,
        justifyContent: 'space-between',
        paddingBottom: 30,
    },
    logoContainer: {
        alignItems: 'center',
        marginTop: 120,
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: 20,
    },
    appName: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#3B82F6',
        marginBottom: 10,
    },
    tagline: {
        fontSize: 18,
        color: '#3B82F6',
        marginTop: 5,
    },
    spacer: {
        flex: 1,
    },
    buttonContainer: {
        width: '100%',
        marginTop: 20,
    },
    getStartedButton: {
        backgroundColor: '#3B82F6', // Blue button
        paddingVertical: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 12,
    },
    getStartedButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    loginButton: {
        backgroundColor: 'transparent',
        paddingVertical: 16,
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#3B82F6',
    },
    loginButtonText: {
        color: '#3B82F6',
        fontWeight: 'bold',
        fontSize: 16,
    },
})

export default WelcomeScreen;

