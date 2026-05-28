import { COLORS, } from "@/constants/theme";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Href, router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function CalculatorCard({ title, subtitle, navigateTo }: { title: string, subtitle: string, navigateTo: Href }) {
    return (
        <Pressable onPress={() => router.push(navigateTo)} style={styles.button}>
            <View style={styles.content}>
                <Text style={styles.text}> {title} </Text>
                <Text style={styles.subText}>{subtitle}</Text>
            </View>
            <FontAwesome6 name="angle-right" size={16} color="white" />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: COLORS.primary,
        padding: 15,
        borderRadius: 10,
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    content: {
        flexDirection: 'column',
        gap: 5,
    },
    text: {
        fontSize: 24,
        color: COLORS.white,
        fontWeight: 'bold',
    },
    subText: {
        fontSize: 12,
        color: COLORS.white,
        marginLeft: 5,
    }
});