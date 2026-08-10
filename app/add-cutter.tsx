import SegmentedControl from "@/components/Helper/SegmentedControl";
import TextField from "@/components/Helper/TextField";
import FormBlock from "@/components/Wrappers/FormBlock";
import { COLORS } from "@/constants/theme";
import { useInventory } from "@/hooks/useInventory";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { database } from "@/db";
import { Cutter } from "@/db/models";

export default function AddCutterScreen() {
    const { addCutter, updateCutter } = useInventory();
    const { id } = useLocalSearchParams<{ id: string }>();

    const [cutterType, setCutterType] = useState<"module" | "dp">("module");
    const [moduleOrDp, setModuleOrDp] = useState("");
    const [pressureAngle, setPressureAngle] = useState("");
    const [angle, setAngle] = useState("");
    const [bore, setBore] = useState("");
    const [diameter, setDiameter] = useState("");
    const [material, setMaterial] = useState("");

    useEffect(() => {
        if (id) {
            const fetchCutter = async () => {
                try {
                    const cutter = await database.get<Cutter>("cutters").find(id);
                    setCutterType((cutter.cutterType as "module" | "dp") || "module");
                    setModuleOrDp(cutter.moduleOrDp.toString());
                    setPressureAngle(cutter.pressureAngle.toString());
                    setAngle(cutter.angle.toString());
                    setBore(cutter.bore.toString());
                    if (cutter.diameter) setDiameter(cutter.diameter.toString());
                    if (cutter.material) setMaterial(cutter.material);
                } catch (e) {
                    console.error("Failed to load cutter:", e);
                    Alert.alert("Error", "Could not load cutter details.");
                }
            };
            fetchCutter();
        }
    }, [id]);

    const handleSave = async () => {
        try {
            if (!moduleOrDp || !pressureAngle || !angle || !bore) {
                Alert.alert("Missing Fields", "Please fill in all required fields.");
                return;
            }

            const payload = {
                cutterType,
                moduleOrDp: parseFloat(moduleOrDp),
                pressureAngle: parseFloat(pressureAngle),
                angle: parseFloat(angle),
                bore: parseFloat(bore),
                diameter: diameter ? parseFloat(diameter) : undefined,
                material: material.trim() || undefined,
            };

            if (id) {
                await updateCutter(id, payload);
            } else {
                await addCutter(payload);
            }

            router.back();
        } catch (e) {
            console.error("Error saving cutter:", e);
            Alert.alert("Error", "Failed to save the cutter. Please try again.");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.black} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{id ? "Edit Cutter" : "Add Cutter"}</Text>
                <View style={styles.headerRight} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <FormBlock>
                    <SegmentedControl
                        label="Cutter Type"
                        options={[
                            { label: "Module (m)", value: "module" },
                            { label: "DP", value: "dp" },
                        ]}
                        selectedValue={cutterType}
                        onChange={(val) => setCutterType(val as "module" | "dp")}
                    />
                    <TextField
                        label={cutterType === "dp" ? "DP Value" : "Module Value (m)"}
                        placeholder="e.g. 2.5"
                        keyboardType="numeric"
                        value={moduleOrDp}
                        onChangeText={setModuleOrDp}
                        required
                    />
                    <TextField
                        label="Angle (°)"
                        placeholder="e.g. 2"
                        keyboardType="default"
                        value={angle}
                        onChangeText={setAngle}
                        required
                    />
                    <TextField
                        label="Bore (mm)"
                        placeholder="e.g. 22"
                        keyboardType="numeric"
                        value={bore}
                        onChangeText={setBore}
                        required
                    />
                    <TextField
                        label="Pressure Angle (°)"
                        placeholder="e.g. 20"
                        keyboardType="numeric"
                        value={pressureAngle}
                        onChangeText={setPressureAngle}
                        required
                    />
                    <TextField
                        label="Diameter (Optional)"
                        placeholder="e.g. 70"
                        keyboardType="numeric"
                        value={diameter}
                        onChangeText={setDiameter}
                    />
                    <TextField label="Material (Optional)" placeholder="e.g. HSS" value={material} onChangeText={setMaterial} />
                </FormBlock>

                <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                    <Text style={styles.saveBtnText}>Save Cutter</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.neutralLight,
    },
    backBtn: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: COLORS.black,
    },
    headerRight: {
        width: 34, // to balance the back button
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    saveBtn: {
        backgroundColor: COLORS.primary,
        paddingVertical: 16,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 20,
    },
    saveBtnText: {
        fontSize: 16,
        fontWeight: "bold",
        color: COLORS.white,
    },
});
