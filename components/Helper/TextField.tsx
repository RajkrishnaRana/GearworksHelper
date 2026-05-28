import { COLORS } from "@/constants/theme";
import { KeyboardTypeOptions, ReturnKeyTypeOptions, StyleSheet, Text, TextInput, View } from "react-native";

export default function TextField({
    label,
    placeholder,
    value,
    onChangeText,
    keyboardType = "numeric",
    returnKeyType = "done",
    required = false,
    rightElement,
}: {
    label: string;
    placeholder?: string;
    value: string;
    onChangeText: (text: string) => void;
    keyboardType?: KeyboardTypeOptions;
    returnKeyType?: ReturnKeyTypeOptions;
    required?: boolean;
    rightElement?: React.ReactNode;
}) {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>
                {label.toUpperCase()} :{required && <Text style={styles.required}> *</Text>}
            </Text>
            <View style={styles.textInputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    value={value}
                    onChangeText={onChangeText}
                    keyboardType={keyboardType}
                    returnKeyType={returnKeyType}
                />
                {rightElement && rightElement}
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
        marginBottom: 5,
    },
    required: {
        color: "red",
        fontSize: 8,
    },
    textInputContainer: {
        borderWidth: 1,
        borderColor: COLORS.neutralLight,
        backgroundColor: COLORS.white,
        borderRadius: 2,
        padding: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    input: {
        fontSize: 20,
        color: COLORS.black,
        fontWeight: "bold",
        paddingTop: 0,
        paddingBottom: 0,
        flex: 1,
    },
});
