import CalculatorHeader from "@/components/Headers/CalculatorHeader";
import SegmentedControl, { SegmentedOption } from "@/components/Helper/SegmentedControl";
import TextField from "@/components/Helper/TextField";
import FormBlock from "@/components/Wrappers/FormBlock";
import { COLORS } from "@/constants/theme";
import useGearCalculator from "@/hooks/useGearCalculator";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Button, KeyboardAvoidingView, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function GearCalculator() {
    const {
        gearType,
        setGearType,
        outDia,
        setOutDia,
        module,
        setModule,
        teeth,
        setTeeth,
        cutterType,
        setCutterType,
        angle,
        setAngle,
        calculate,
    } = useGearCalculator();

    const gearTypeOptions: SegmentedOption[] = [
        {
            label: "Straight",
            value: "straight",
            icon: (color) => <MaterialCommunityIcons name="cog-outline" size={20} color={color} />,
        },
        {
            label: "Helical",
            value: "helical",
            icon: (color) => <MaterialCommunityIcons name="sine-wave" size={20} color={color} />,
        },
    ];

    const cutterTypeOptions: SegmentedOption[] = [
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
                    <CalculatorHeader
                        name="Gear Calculator"
                        subtitle="Compute critical dimensions for standard spur and helical gears."
                    />

                    <SegmentedControl
                        label="Gear Type"
                        options={gearTypeOptions}
                        selectedValue={gearType}
                        onChange={setGearType}
                    />

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
                            label={cutterType === "dp" ? "DP" : "Module (m)"}
                            placeholder="--"
                            value={module}
                            onChangeText={setModule}
                        />
                        <TextField label="Number of teeth (Z)" placeholder="--" value={teeth} onChangeText={setTeeth} />
                        {gearType === "helical" && (
                            <TextField label="Helix Angle (degrees)" placeholder="--" value={angle} onChangeText={setAngle} />
                        )}
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
