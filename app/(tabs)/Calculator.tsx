import CalculatorCard from "@/components/Cards/CalculatorCards";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Calculator() {
    return (
        <SafeAreaView style={styles.container}>
            <CalculatorCard title="Gear" subtitle="Check gear ratio and more" navigateTo="/GearCalculator" />
            <CalculatorCard title="Wheel" subtitle="Check wheel size and offset" navigateTo="/WheelCalculator" />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 15,
    }
});
