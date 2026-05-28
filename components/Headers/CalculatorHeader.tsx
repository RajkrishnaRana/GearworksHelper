import { StyleSheet, Text, View } from 'react-native';

interface CalculatorHeaderProps {
    name: string;
    subtitle: string;
}

export default function CalculatorHeader({ name, subtitle }: CalculatorHeaderProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{name}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 15,
        gap: 7,
        marginBottom: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: "700",
        color: "#000",
    },
    subtitle: {
        fontSize: 15,
        color: "#666",
    }
});