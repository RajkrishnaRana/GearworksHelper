import CalculatorHeader from "@/components/Headers/CalculatorHeader";
import TextField from "@/components/Helper/TextField";
import FormBlock from "@/components/Wrappers/FormBlock";
import { COLORS } from "@/constants/theme";
import useWheelCalculator from "@/hooks/useWheelCalculator";
import { Button, KeyboardAvoidingView, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WheelCalculator() {
    const {
        pitch,
        setPitch,
        wormDia,
        setWormDia,
        teeth,
        setTeeth,
        outDia,
        setOutDia,
        wheelAngle,
        setWheelAngle,
        calculate,
    } = useWheelCalculator();

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <CalculatorHeader
                        name="Wheel Calculator"
                        subtitle="Compute critical dimensions for worm wheels."
                    />

                    <FormBlock>
                        <TextField
                            label="Outer Diameter (OD)"
                            placeholder="--"
                            value={outDia}
                            onChangeText={setOutDia}
                            rightElement={<Text style={styles.unitText}>mm</Text>}
                        />
                        <TextField
                            label="Pitch (in inch)"
                            placeholder="--"
                            value={pitch}
                            onChangeText={setPitch}
                            rightElement={<Text style={styles.unitText}>in</Text>}
                        />
                        <TextField
                            label="Worm Dia"
                            placeholder="--"
                            value={wormDia}
                            onChangeText={setWormDia}
                            rightElement={<Text style={styles.unitText}>mm</Text>}
                        />
                        <TextField
                            label="Number of teeth (Z)"
                            placeholder="--"
                            value={teeth}
                            onChangeText={setTeeth}
                        />
                        <TextField
                            label="Wheel Angle"
                            placeholder="--"
                            value={wheelAngle}
                            onChangeText={setWheelAngle}
                        />
                    </FormBlock>

                    <View style={styles.buttonContainer}>
                        <Button title="Calculate" onPress={calculate} />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 15,
    },
    scrollContent: { flexGrow: 1, paddingBottom: 20 },
    buttonContainer: {
        marginTop: 20,
        marginHorizontal: 10,
    },
    unitText: {
        fontSize: 15,
        color: COLORS.neutralDark,
    },
});