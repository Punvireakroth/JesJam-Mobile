import { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface PasswordStrengthIndicatorProps {
    password: string;
}


const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ password = '' }) => {
    const [strength, setStrength] = useState<number>(0);

    useEffect(() => {
        const calculateStrength = () => {
            const length = password.length;
            const hasUpperCase = /[A-Z]/.test(password);
            const hasLowerCase = /[a-z]/.test(password);
            const hasNumbers = /\d/.test(password);
            const hasSpecialChars = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(password);

            let strength = 0;

        }
    }, [password]);

    return (
        <View style={styles.container}>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 10,
    },

})


export default PasswordStrengthIndicator;