import SegmentedControl from "@/components/Helper/SegmentedControl";
import TextField from "@/components/Helper/TextField";
import FormBlock from "@/components/Wrappers/FormBlock";
import { COLORS } from "@/constants/theme";
import { database } from "@/db";
import { Machine, MachineChangeGear } from "@/db/models";
import { useInventory } from "@/hooks/useInventory";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Q } from "@nozbe/watermelondb";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface GearItem {
    id?: string;
    teethCount: number;
    quantity: number;
}

export default function AddMachineScreen() {
    const { saveMachineWithGears } = useInventory();
    const { id } = useLocalSearchParams<{ id: string }>();

    // Machine form state
    const [machineName, setMachineName] = useState("");
    const [indexingRatio, setIndexingRatio] = useState("");
    const [status, setStatus] = useState("active");

    // Change gears state
    const [gears, setGears] = useState<GearItem[]>([]);
    const [newTeeth, setNewTeeth] = useState("");
    const [newQuantity, setNewQuantity] = useState("1");

    useEffect(() => {
        if (id) {
            const fetchMachineAndGears = async () => {
                try {
                    const machine = await database.get<Machine>("machines").find(id);
                    setMachineName(machine.name);
                    setIndexingRatio(machine.indexingRatio.toString());
                    setStatus(machine.status || "active");

                    const fetchedGears = await database
                        .get<MachineChangeGear>("machine_change_gears")
                        .query(Q.where("machine_id", id))
                        .fetch();

                    setGears(
                        fetchedGears.map((g) => ({
                            id: g.id,
                            teethCount: g.teethCount,
                            quantity: g.quantity,
                        }))
                    );
                } catch (e) {
                    console.error("Failed to load machine details:", e);
                    Alert.alert("Error", "Could not load machine details.");
                }
            };
            fetchMachineAndGears();
        }
    }, [id]);

    const handleAddGear = () => {
        const teeth = parseInt(newTeeth, 10);
        const qty = parseInt(newQuantity, 10);

        if (isNaN(teeth) || teeth <= 0) {
            Alert.alert("Invalid Input", "Please enter a valid number of teeth.");
            return;
        }

        if (isNaN(qty) || qty <= 0) {
            Alert.alert("Invalid Input", "Please enter a valid quantity.");
            return;
        }

        // Check if gear with same teeth count already exists in state
        const existingIdx = gears.findIndex((g) => g.teethCount === teeth);
        if (existingIdx >= 0) {
            const updated = [...gears];
            updated[existingIdx].quantity += qty;
            setGears(updated);
        } else {
            setGears([...gears, { teethCount: teeth, quantity: qty }]);
        }

        setNewTeeth("");
        setNewQuantity("1");
    };

    const handleRemoveGear = (index: number) => {
        setGears(gears.filter((_, i) => i !== index));
    };

    const handleSave = async () => {
        try {
            if (!machineName.trim() || !indexingRatio.trim()) {
                Alert.alert("Missing Fields", "Please fill in machine name and indexing ratio.");
                return;
            }

            const parsedRatio = parseFloat(indexingRatio);
            if (isNaN(parsedRatio)) {
                Alert.alert("Invalid Input", "Indexing ratio must be a valid number.");
                return;
            }

            await saveMachineWithGears(
                id,
                {
                    name: machineName.trim(),
                    indexingRatio: parsedRatio,
                    status,
                },
                gears
            );

            router.back();
        } catch (e) {
            console.error("Error saving machine:", e);
            Alert.alert("Error", "Failed to save machine. Please try again.");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.black} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{id ? "Edit Machine" : "Add Machine"}</Text>
                <View style={styles.headerRight} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                {/* Machine Details Form */}
                <Text style={styles.sectionTitle}>Machine Information</Text>
                <FormBlock>
                    <TextField
                        label="Machine Name"
                        placeholder="e.g. Barber-Colman No. 16"
                        value={machineName}
                        onChangeText={setMachineName}
                        required
                        keyboardType="default"
                    />
                    <TextField
                        label="Indexing Ratio"
                        placeholder="e.g. 24"
                        keyboardType="numeric"
                        value={indexingRatio}
                        onChangeText={setIndexingRatio}
                        required
                    />
                    <SegmentedControl
                        label="Status"
                        options={[
                            { label: "Active", value: "active" },
                            { label: "Breakdown", value: "breakdown" },
                        ]}
                        selectedValue={status}
                        onChange={(val) => setStatus(val as string)}
                    />
                </FormBlock>

                {/* Change Gears Form Section */}
                <Text style={styles.sectionTitle}>Change Gears Inventory</Text>
                <FormBlock>
                    <View style={styles.gearInputRow}>
                        <View style={{ flex: 1 }}>
                            <TextField
                                label="Teeth Count"
                                placeholder="e.g. 30"
                                keyboardType="numeric"
                                value={newTeeth}
                                onChangeText={setNewTeeth}
                            />
                        </View>
                        <View style={{ width: 100 }}>
                            <TextField
                                label="Quantity"
                                placeholder="e.g. 1"
                                keyboardType="numeric"
                                value={newQuantity}
                                onChangeText={setNewQuantity}
                            />
                        </View>
                        <TouchableOpacity style={styles.addGearBtn} onPress={handleAddGear} activeOpacity={0.8}>
                            <Ionicons name="add" size={22} color={COLORS.white} />
                            <Text style={styles.addGearBtnText}>Add</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Change Gears Table */}
                    <Text style={styles.tableLabel}>Available Change Gears</Text>
                    {gears.length === 0 ? (
                        <View style={styles.emptyTable}>
                            <MaterialCommunityIcons name="cog-outline" size={32} color={COLORS.neutralLight} />
                            <Text style={styles.emptyTableText}>No change gears added yet</Text>
                        </View>
                    ) : (
                        <View style={styles.tableContainer}>
                            <View style={styles.tableHeaderRow}>
                                <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Teeth Count</Text>
                                <Text style={[styles.tableHeaderCell, { flex: 2, textAlign: "center" }]}>Quantity</Text>
                                <Text style={[styles.tableHeaderCell, { width: 60, textAlign: "center" }]}>Action</Text>
                            </View>
                            {gears.map((item, index) => (
                                <View
                                    key={index}
                                    style={[
                                        styles.tableRow,
                                        index % 2 === 1 ? styles.tableRowAlt : null,
                                        index === gears.length - 1 ? { borderBottomWidth: 0 } : null,
                                    ]}
                                >
                                    <Text style={[styles.tableCell, { flex: 2, fontWeight: "600" }]}>
                                        {item.teethCount} T
                                    </Text>
                                    <Text style={[styles.tableCell, { flex: 2, textAlign: "center" }]}>
                                        {item.quantity}
                                    </Text>
                                    <TouchableOpacity
                                        style={[styles.tableCell, { width: 60, alignItems: "center" }]}
                                        onPress={() => handleRemoveGear(index)}
                                    >
                                        <Ionicons name="trash-outline" size={18} color={COLORS.error || "#E53935"} />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    )}
                </FormBlock>

                <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.8}>
                    <Text style={styles.saveBtnText}>{id ? "Update Machine" : "Save Machine"}</Text>
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
        width: 34,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: COLORS.black,
        marginTop: 10,
        marginBottom: 8,
    },
    gearInputRow: {
        flexDirection: "row",
        alignItems: "flex-end",
        gap: 10,
        marginBottom: 16,
    },
    addGearBtn: {
        backgroundColor: COLORS.secondary || COLORS.primary,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 8,
        height: 48,
        marginTop: 22,
    },
    addGearBtnText: {
        color: COLORS.white,
        fontWeight: "bold",
        fontSize: 14,
        marginLeft: 4,
    },
    tableLabel: {
        fontSize: 14,
        fontWeight: "600",
        color: COLORS.neutralDark,
        marginBottom: 8,
    },
    emptyTable: {
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        borderWidth: 1,
        borderColor: COLORS.neutralLight,
        borderRadius: 8,
        borderStyle: "dashed",
    },
    emptyTableText: {
        fontSize: 13,
        color: COLORS.neutralDark,
        marginTop: 6,
    },
    tableContainer: {
        borderWidth: 1,
        borderColor: COLORS.neutralLight,
        borderRadius: 8,
        overflow: "hidden",
    },
    tableHeaderRow: {
        flexDirection: "row",
        backgroundColor: COLORS.neutralBackground,
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.neutralLight,
    },
    tableHeaderCell: {
        fontSize: 13,
        fontWeight: "bold",
        color: COLORS.black,
    },
    tableRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.neutralLight,
        backgroundColor: COLORS.white,
    },
    tableRowAlt: {
        backgroundColor: "#F9FAFB",
    },
    tableCell: {
        fontSize: 14,
        color: COLORS.black,
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
