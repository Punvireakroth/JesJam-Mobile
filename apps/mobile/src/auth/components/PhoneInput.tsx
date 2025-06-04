import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';
import Flag from 'react-flagpack'


interface CountryCode {
    code: string;
    name: string;
    dialCode: string;
    flag: React.ReactNode;
}

const FlagComponent = ({ code }: { code: string }) => {
    return <Flag code={code} />
}

const countryCodes: CountryCode[] = [
    { code: 'KH', name: 'Cambodia', dialCode: '+855', flag: <FlagComponent code="KH" /> },
];

interface PhoneInputProps {
    value: string;
    onChangeText: (text: string) => void;
    onBlur?: () => void;
    placeholder?: string;
    error?: string;
}

const PhoneInput: React.FC<PhoneInputProps> = ({
    value,
    onChangeText,
    onBlur,
    placeholder = 'Enter phone number',
    error,
}) => {
    const [selectedCountry, setSelectedCountry] = useState(countryCodes[0]);
    const [modalVisible, setModalVisible] = useState(false);

    // Format phone number
    const formatPhoneNumber = (input: string, country: CountryCode) => {
        let formatted = input
            .replace(country.dialCode, '') // Remove dial code if typed
            .replace(/\\D/g, ''); // Remove non-digits

        return formatted;
    };

    const handleSelectCountry = (country: CountryCode) => {
        setSelectedCountry(country);
        setModalVisible(false);
    };

    const handlePhoneInput = (input: string) => {
        const formatted = formatPhoneNumber(input, selectedCountry);
        onChangeText(formatted);
    };

    // Calculate full phone number
    const getFullPhoneNumber = () => {
        if (value) {
            return `${selectedCountry.dialCode}${value}`;
        }
        return '';
    };

    // Render country list item
    const renderCountryItem = ({ item }: { item: CountryCode }) => (
        <TouchableOpacity
            style={styles.countryItem}
            onPress={() => handleSelectCountry(item)}
        >
            <Text style={styles.countryFlag}>{item.flag}</Text>
            <Text style={styles.countryName}>{item.name}</Text>
            <Text style={styles.countryDialCode}>{item.dialCode}</Text>
        </TouchableOpacity>
    );

    return (
        <View>
            <View
                style={[
                    styles.inputContainer,
                    error ? styles.inputContainerError : null,
                ]}
            >
                <TouchableOpacity
                    style={styles.countrySelector}
                    onPress={() => setModalVisible(true)}
                >
                    <Text style={styles.countryFlag}>{selectedCountry.flag}</Text>
                    <Text style={styles.countryDialCode}>{selectedCountry.dialCode}</Text>
                    <Text style={styles.dropdownArrow}>▼</Text>
                </TouchableOpacity>

                <TextInput
                    style={styles.input}
                    value={value}
                    onChangeText={handlePhoneInput}
                    onBlur={onBlur}
                    placeholder={placeholder}
                    keyboardType="phone-pad"
                    maxLength={15}
                />
            </View>

            {error && <Text style={styles.errorText}>{error}</Text>}

            <Modal
                visible={modalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select Country</Text>
                            <TouchableOpacity
                                onPress={() => setModalVisible(false)}
                                style={styles.closeButton}
                            >
                                <Text style={styles.closeButtonText}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        <FlatList
                            data={countryCodes}
                            renderItem={renderCountryItem}
                            keyExtractor={(item) => item.code}
                            style={styles.countryList}
                        />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        overflow: 'hidden',
    },
    inputContainerError: {
        borderColor: '#DC2626',
    },
    countrySelector: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 12,
        borderRightWidth: 1,
        borderRightColor: '#E5E7EB',
        backgroundColor: '#F9FAFB',
    },
    countryFlag: {
        fontSize: 18,
        marginRight: 5,
    },
    countryDialCode: {
        fontSize: 14,
        color: '#374151',
    },
    dropdownArrow: {
        fontSize: 10,
        color: '#9CA3AF',
        marginLeft: 5,
    },
    input: {
        flex: 1,
        paddingHorizontal: 12,
        paddingVertical: 12,
        fontSize: 16,
    },
    errorText: {
        color: '#DC2626',
        fontSize: 12,
        marginTop: 5,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        maxHeight: '70%',
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    closeButton: {
        padding: 5,
    },
    closeButtonText: {
        fontSize: 16,
        color: '#6B7280',
    },
    countryList: {
        paddingHorizontal: 16,
    },
    countryItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    countryName: {
        flex: 1,
        fontSize: 16,
        color: '#1F2937',
        marginLeft: 10,
    },
});

export default PhoneInput;