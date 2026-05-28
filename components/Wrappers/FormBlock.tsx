import { COLORS } from "@/constants/theme";
import { StyleSheet, View } from "react-native";

export default function FormBlock({children}: {children: React.ReactNode}) {
    return (
        <View style={styles.container}>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        borderColor: COLORS.neutralLight,
        borderWidth: 0.7,
        backgroundColor: COLORS.neutralBackground,
        borderRadius: 5,
    }
});