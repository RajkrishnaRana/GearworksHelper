import { COLORS } from "@/constants/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface FloatingAddButtonProps {
    onPress: () => void;
}

export default function FloatingAddButton({ onPress }: FloatingAddButtonProps) {
    return (
        <View style={styles.container} pointerEvents="box-none">
            <TouchableOpacity style={styles.fab} onPress={onPress} activeOpacity={0.85}>
                <Ionicons name="add" size={32} color={COLORS.white} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        bottom: 20,
        left: 0,
        right: 0,
        alignItems: "center",
        justifyContent: "center",
    },
    fab: {
        width: 58,
        height: 58,
        borderRadius: 29,
        backgroundColor: COLORS.primary,
        alignItems: "center",
        justifyContent: "center",
        elevation: 6,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
});
