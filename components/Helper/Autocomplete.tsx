import { COLORS } from "@/constants/theme";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

interface AutocompleteProps {
    label: string;
    placeholder?: string;
    value: string;
    onChangeText: (text: string) => void;
    options: string[];
    required?: boolean;
    zIndex?: number;
}

export default function Autocomplete({
    label,
    placeholder,
    value,
    onChangeText,
    options,
    required,
    zIndex = 1,
}: AutocompleteProps) {
    const [isFocused, setIsFocused] = useState(false);

    const filteredOptions = options.filter(
        (opt) => opt.toLowerCase().includes(value.toLowerCase()) && opt.toLowerCase() !== value.toLowerCase()
    );

    const showDropdown = isFocused && filteredOptions.length > 0;

    return (
        <View style={[styles.container, { zIndex }]}>
            <Text style={styles.label}>
                {label} {required && <Text style={styles.asterisk}>*</Text>}
            </Text>
            <View style={[styles.inputContainer, isFocused && styles.inputFocused]}>
                <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    placeholderTextColor={COLORS.neutral}
                    value={value}
                    onChangeText={onChangeText}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setTimeout(() => setIsFocused(false), 200)} // Delay to allow press on suggestion
                />
            </View>
            {showDropdown && (
                <View style={styles.dropdownContainer}>
                    <ScrollView keyboardShouldPersistTaps="handled" style={styles.scrollView}>
                        {filteredOptions.map((opt, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.optionItem}
                                onPress={() => {
                                    onChangeText(opt);
                                    setIsFocused(false);
                                }}
                            >
                                <Text style={styles.optionText}>{opt}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 15,
        position: "relative",
        zIndex: 1, // Needed for dropdown overlap
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        color: COLORS.black,
        marginBottom: 8,
        marginLeft: 4,
    },
    asterisk: {
        color: COLORS.error,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.neutralLight,
        borderRadius: 12,
        paddingHorizontal: 15,
        minHeight: 50,
    },
    inputFocused: {
        borderColor: COLORS.primary,
        backgroundColor: COLORS.white,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: COLORS.black,
        paddingVertical: 12,
    },
    dropdownContainer: {
        position: "absolute",
        top: 80,
        left: 0,
        right: 0,
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.neutralLight,
        borderRadius: 10,
        maxHeight: 150,
        zIndex: 1000,
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    scrollView: {
        width: "100%",
    },
    optionItem: {
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.neutralLight,
    },
    optionText: {
        fontSize: 15,
        color: COLORS.black,
    },
});
