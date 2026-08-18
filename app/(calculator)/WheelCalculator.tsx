import CalculatorHeader from "@/components/Headers/CalculatorHeader";
import SegmentedControl, { SegmentedOption } from "@/components/Helper/SegmentedControl";
import TextField from "@/components/Helper/TextField";
import FormBlock from "@/components/Wrappers/FormBlock";
import { COLORS } from "@/constants/theme";
import useWheelCalculator from "@/hooks/useWheelCalculator";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Button, KeyboardAvoidingView, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WheelCalculator() {
    const {
        cutterType,
        setCutterType,
        cutterValue,
        setCutterValue,
        wormDia,
        setWormDia,
        starts,
        setStarts,
        teeth,
        setTeeth,
        outDia,
        setOutDia,
        throatDia,
        setThroatDia,
        wheelAngle,
        setWheelAngle,
        calculate,
    } = useWheelCalculator();

    const cutterTypeOptions: SegmentedOption[] = [
        {
            label: "Pitch",
            value: "pitch",
            icon: (color) => <MaterialCommunityIcons name="cog-outline" size={20} color={color} />,
        },
        {
            label: "Module",
            value: "module",
            icon: (color) => <MaterialCommunityIcons name="cog-outline" size={20} color={color} />,
        },
        {
            label: "DP",
            value: "dp",
            icon: (color) => <MaterialCommunityIcons name="cog-outline" size={20} color={color} />,
        },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <CalculatorHeader name="Wheel Calculator" subtitle="Compute critical dimensions for worm wheels." />

                    <SegmentedControl
                        label="Cutter Type"
                        options={cutterTypeOptions}
                        selectedValue={cutterType}
                        onChange={setCutterType}
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
                            label="Throat Diameter (TD)"
                            placeholder="--"
                            value={throatDia}
                            onChangeText={setThroatDia}
                            rightElement={<Text style={styles.unitText}>mm</Text>}
                        />
                        <TextField
                            label={cutterType === "pitch" ? "Pitch (in inch)" : cutterType === "module" ? "Module (m)" : "DP"}
                            placeholder="--"
                            value={cutterValue}
                            onChangeText={setCutterValue}
                            rightElement={cutterType === "pitch" && <Text style={styles.unitText}>in</Text>}
                        />
                        <TextField label="Starts of cutter" placeholder="--" value={starts} onChangeText={setStarts} />
                        <TextField
                            label="Worm Dia"
                            placeholder="--"
                            value={wormDia}
                            onChangeText={setWormDia}
                            rightElement={<Text style={styles.unitText}>mm</Text>}
                        />
                        <TextField label="Number of teeth (Z)" placeholder="--" value={teeth} onChangeText={setTeeth} />
                        <TextField label="Wheel Angle" placeholder="--" value={wheelAngle} onChangeText={setWheelAngle} />
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
