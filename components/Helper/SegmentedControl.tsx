import { COLORS } from "@/constants/theme";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export interface SegmentedOption {
    label: string;
    value: string;
    icon?: (color: string) => React.ReactNode;
}

interface SegmentedControlProps {
    label?: string;
    options: SegmentedOption[];
    selectedValue: string;
    onChange: (value: string) => void;
}

export default function SegmentedControl({
    label,
    options,
    selectedValue,
    onChange,
}: SegmentedControlProps) {
    return (
        <View style={styles.container}>
            {label && (
                <Text style={styles.label}>
                    {label.toUpperCase()}
                </Text>
            )}
            <View style={styles.controlContainer}>
                {options.map((option) => {
                    const isSelected = option.value === selectedValue;
                    const activeColor = COLORS.black;
                    const inactiveColor = COLORS.neutralDark;
                    const currentIconColor = isSelected ? activeColor : inactiveColor;

                    return (
                        <TouchableOpacity
                            key={option.value}
                            style={[
                                styles.segmentButton,
                                isSelected && styles.segmentButtonActive,
                            ]}
                            onPress={() => onChange(option.value)}
                            activeOpacity={0.8}
                        >
                            {option.icon && (
                                <View style={styles.iconContainer}>
                                    {option.icon(currentIconColor)}
                                </View>
                            )}
                            <Text
                                style={[
                                    styles.segmentText,
                                    isSelected ? styles.segmentTextActive : styles.segmentTextInactive,
                                ]}
                            >
                                {option.label.toUpperCase()}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
    },
    label: {
        fontSize: 12,
        fontWeight: "600",
        color: COLORS.neutralDark,
        letterSpacing: 0.8,
        marginBottom: 8,
    },
    controlContainer: {
        flexDirection: "row",
        backgroundColor: COLORS.neutralBackground,
        borderWidth: 0.7,
        borderColor: COLORS.neutralLight,
        borderRadius: 4,
        padding: 4,
    },
    segmentButton: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 12,
        borderRadius: 3,
        backgroundColor: "transparent",
    },
    segmentButtonActive: {
        backgroundColor: COLORS.white,
        borderWidth: 0.7,
        borderColor: COLORS.neutralLight,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        elevation: 1,
    },
    iconContainer: {
        marginRight: 8,
        alignItems: "center",
        justifyContent: "center",
    },
    segmentText: {
        fontSize: 14,
        fontWeight: "700",
        letterSpacing: 0.5,
    },
    segmentTextActive: {
        color: COLORS.black,
    },
    segmentTextInactive: {
        color: COLORS.neutralDark,
    },
});