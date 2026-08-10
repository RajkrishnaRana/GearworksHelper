import TextField from "@/components/Helper/TextField";
import FormBlock from "@/components/Wrappers/FormBlock";
import { COLORS } from "@/constants/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import { useInventory } from "@/hooks/useInventory";
import { router } from "expo-router";

interface AddInventoryActionSheetProps {
    visible: boolean;
    onClose: () => void;
}

export default function AddInventoryActionSheet({ visible, onClose }: AddInventoryActionSheetProps) {
    const actionSheetRef = useRef<ActionSheetRef>(null);
    const isFirstRender = useRef(true);
    const { addMachine } = useInventory();

    const [step, setStep] = useState<"select" | "form">("select");
    const [itemType, setItemType] = useState<"machine" | "cutter">("machine");

    // Machine state
    const [machineName, setMachineName] = useState("");
    const [indexingRatio, setIndexingRatio] = useState("");
    const [feedConstant, setFeedConstant] = useState("");

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            if (visible) {
                actionSheetRef.current?.show();
            }
            return;
        }

        if (visible) {
            actionSheetRef.current?.show();
        } else {
            actionSheetRef.current?.hide();
        }
    }, [visible]);

    const resetState = () => {
        setStep("select");
        setItemType("machine");
        
        // Reset Machine
        setMachineName("");
        setIndexingRatio("");
        setFeedConstant("");
    };

    const handleClose = () => {
        resetState();
        onClose();
    };

    const handleSelectOption = (type: "machine" | "cutter") => {
        if (type === "cutter") {
            // Navigate directly to add cutter screen
            actionSheetRef.current?.hide();
            router.push('/add-cutter');
        } else {
            setItemType(type);
            setStep("form");
        }
    };

    const handleAdd = async () => {
        try {
            if (itemType === "machine") {
                if (!machineName.trim() || !indexingRatio || !feedConstant) return;
                
                await addMachine({
                    name: machineName.trim(),
                    indexingRatio: parseFloat(indexingRatio),
                    feedConstant: parseFloat(feedConstant)
                });
            }
            
            actionSheetRef.current?.hide();
            resetState();
        } catch (e) {
            console.error("Error adding machine:", e);
        }
    };

    return (
        <ActionSheet
            ref={actionSheetRef}
            onClose={handleClose}
            gestureEnabled={true}
            indicatorStyle={styles.dragHandle}
            containerStyle={styles.sheetContainer}
        >
            <View style={styles.contentPadding}>
                {step === "select" ? (
                    <View style={styles.selectContent}>
                        <Text style={styles.sheetTitle}>Add to Inventory</Text>
                        <Text style={styles.sheetSubtitle}>Choose what you would like to add:</Text>

                        <TouchableOpacity
                            style={styles.optionCard}
                            onPress={() => handleSelectOption("machine")}
                            activeOpacity={0.7}
                        >
                            <View style={[styles.iconContainer, styles.machineIconBg]}>
                                <MaterialCommunityIcons name="cog" size={26} color={COLORS.primary} />
                            </View>
                            <View style={styles.optionTextContainer}>
                                <Text style={styles.optionTitle}>Add Machine</Text>
                                <Text style={styles.optionDesc}>Register a new hobber, shaper or milling machine</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color={COLORS.neutralDark} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.optionCard}
                            onPress={() => handleSelectOption("cutter")}
                            activeOpacity={0.7}
                        >
                            <View style={[styles.iconContainer, styles.cutterIconBg]}>
                                <MaterialCommunityIcons name="content-cut" size={26} color={COLORS.secondary} />
                            </View>
                            <View style={styles.optionTextContainer}>
                                <Text style={styles.optionTitle}>Add Cutter</Text>
                                <Text style={styles.optionDesc}>Add module or DP hobs, gear cutters, or wheels</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color={COLORS.neutralDark} />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.cancelButton} onPress={() => actionSheetRef.current?.hide()}>
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={styles.formHeader}>
                            <TouchableOpacity onPress={() => setStep("select")} style={styles.backBtn}>
                                <Ionicons name="arrow-back" size={20} color={COLORS.black} />
                            </TouchableOpacity>
                            <Text style={styles.sheetTitle}>Add Machine</Text>
                        </View>

                        <FormBlock>
                            <TextField
                                label="Machine Name"
                                placeholder="e.g. Barber-Colman No. 16"
                                value={machineName}
                                onChangeText={setMachineName}
                                required
                            />
                            <TextField
                                label="Indexing Ratio"
                                placeholder="e.g. 24"
                                keyboardType="numeric"
                                value={indexingRatio}
                                onChangeText={setIndexingRatio}
                                required
                            />
                            <TextField
                                label="Feed Constant"
                                placeholder="e.g. 0.05"
                                keyboardType="numeric"
                                value={feedConstant}
                                onChangeText={setFeedConstant}
                                required
                            />
                        </FormBlock>

                        <View style={styles.actionRow}>
                            <TouchableOpacity style={styles.cancelButton} onPress={() => actionSheetRef.current?.hide()}>
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.submitBtn} onPress={handleAdd}>
                                <Text style={styles.submitBtnText}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                )}
            </View>
        </ActionSheet>
    );
}

const styles = StyleSheet.create({
    sheetContainer: {
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: "75%",
    },
    contentPadding: {
        paddingHorizontal: 20,
        paddingBottom: 30,
        paddingTop: 10,
    },
    dragHandle: {
        width: 40,
        height: 5,
        borderRadius: 2.5,
        backgroundColor: COLORS.neutralLight,
    },
    selectContent: {
        paddingBottom: 10,
    },
    sheetTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: COLORS.black,
    },
    sheetSubtitle: {
        fontSize: 14,
        color: COLORS.neutralDark,
        marginTop: 4,
        marginBottom: 16,
    },
    optionCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.neutralLight,
        borderRadius: 12,
        padding: 14,
        marginBottom: 12,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 14,
    },
    machineIconBg: {
        backgroundColor: "#E6F4FE",
    },
    cutterIconBg: {
        backgroundColor: "#FFF8E1",
    },
    optionTextContainer: {
        flex: 1,
    },
    optionTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: COLORS.black,
    },
    optionDesc: {
        fontSize: 12,
        color: COLORS.neutralDark,
        marginTop: 2,
    },
    cancelButton: {
        paddingVertical: 14,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.neutralLight,
        alignItems: "center",
        marginTop: 10,
        flex: 1,
    },
    cancelButtonText: {
        fontSize: 15,
        fontWeight: "600",
        color: COLORS.neutralDark,
    },
    formHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 15,
        gap: 10,
    },
    backBtn: {
        padding: 4,
    },
    actionRow: {
        flexDirection: "row",
        gap: 12,
        marginTop: 20,
        marginBottom: 30,
    },
    submitBtn: {
        flex: 1,
        backgroundColor: COLORS.primary,
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 10,
    },
    submitBtnText: {
        fontSize: 15,
        fontWeight: "bold",
        color: COLORS.white,
    },
});
