import SegmentedControl from "@/components/Helper/SegmentedControl";
import TextField from "@/components/Helper/TextField";
import FormBlock from "@/components/Wrappers/FormBlock";
import { COLORS } from "@/constants/theme";
import { database } from "@/db";
import { Cutter } from "@/db/models";
import { useInventory } from "@/hooks/useInventory";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddCutterScreen() {
    const { addCutter, updateCutter } = useInventory();
    const { id } = useLocalSearchParams<{ id: string }>();

    const [cutterName, setCutterName] = useState("");
    const [angle, setAngle] = useState("");
    const [hand, setHand] = useState("Right Hand"); // Default to Right Hand or Left Hand
    const [pitch, setPitch] = useState("");
    const [bore, setBore] = useState("");
    const [deep, setDeep] = useState("");
    const [starts, setStarts] = useState("1");
    const [pressureAngle, setPressureAngle] = useState("");
    const [cutterType, setCutterType] = useState("Bore Cutter"); // Shaft or Bore
    const [diameter, setDiameter] = useState("");
    const [notes, setNotes] = useState("");

    useEffect(() => {
        if (id) {
            const fetchCutter = async () => {
                try {
                    const cutter = await database.get<Cutter>("cutters").find(id);
                    setCutterName(cutter.cutterName);
                    setAngle(cutter.angle);
                    setHand(cutter.hand);
                    setPitch(cutter.pitch.toString());
                    setBore(cutter.bore.toString());
                    setDeep(cutter.deep.toString());
                    setStarts(cutter.starts.toString());
                    setPressureAngle(cutter.pressureAngle.toString());
                    setCutterType(cutter.cutterType);
                    if (cutter.diameter) setDiameter(cutter.diameter.toString());
                    if (cutter.notes) setNotes(cutter.notes);
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
            if (!cutterName || !angle || !pitch || !bore || !deep || !starts || !pressureAngle) {
                Alert.alert("Missing Fields", "Please fill in all required fields.");
                return;
            }

            const payload = {
                cutterName: cutterName.trim(),
                angle: angle.trim(),
                hand,
                pitch: parseFloat(pitch),
                bore: parseFloat(bore),
                deep: parseFloat(deep),
                starts: parseInt(starts, 10),
                pressureAngle: parseFloat(pressureAngle),
                cutterType,
                diameter: diameter ? parseFloat(diameter) : undefined,
                notes: notes.trim() || undefined,
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

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                <FormBlock>
                    <TextField
                        label="Cutter Name"
                        placeholder="e.g. Roughing Cutter"
                        value={cutterName}
                        onChangeText={setCutterName}
                        required
                        keyboardType="default"
                    />
                    <SegmentedControl
                        label="Hand"
                        options={[
                            { label: "Right Hand", value: "Right Hand" },
                            { label: "Left Hand", value: "Left Hand" },
                        ]}
                        selectedValue={hand}
                        onChange={(val) => setHand(val as string)}
                    />
                    <SegmentedControl
                        label="Cutter Type"
                        options={[
                            { label: "Bore Cutter", value: "Bore Cutter" },
                            { label: "Shaft Cutter", value: "Shaft Cutter" },
                        ]}
                        selectedValue={cutterType}
                        onChange={(val) => setCutterType(val as string)}
                    />
                    <TextField
                        label="Angle"
                        placeholder="e.g. 20 degrees"
                        value={angle}
                        onChangeText={setAngle}
                        required
                        keyboardType="default"
                    />
                    <TextField
                        label="Circular Pitch (Cp)"
                        placeholder="e.g. 1.5"
                        keyboardType="numeric"
                        value={pitch}
                        onChangeText={setPitch}
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
                        label="Deep"
                        placeholder="e.g. 5.5"
                        keyboardType="numeric"
                        value={deep}
                        onChangeText={setDeep}
                        required
                    />
                    <TextField
                        label="Starts"
                        placeholder="e.g. 1"
                        keyboardType="numeric"
                        value={starts}
                        onChangeText={setStarts}
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
                    <TextField
                        label="Notes (Optional)"
                        placeholder="Additional details..."
                        value={notes}
                        onChangeText={setNotes}
                    />
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
