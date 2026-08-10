import { COLORS } from "@/constants/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useEffect, useRef } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import { router } from "expo-router";

interface AddInventoryActionSheetProps {
    visible: boolean;
    onClose: () => void;
}

export default function AddInventoryActionSheet({ visible, onClose }: AddInventoryActionSheetProps) {
    const actionSheetRef = useRef<ActionSheetRef>(null);
    const isFirstRender = useRef(true);

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

    const handleSelectOption = (type: "machine" | "cutter") => {
        actionSheetRef.current?.hide();
        if (type === "machine") {
            router.push("/add-machine");
        } else {
            router.push("/add-cutter");
        }
    };

    return (
        <ActionSheet
            ref={actionSheetRef}
            onClose={onClose}
            gestureEnabled={true}
            indicatorStyle={styles.dragHandle}
            containerStyle={styles.sheetContainer}
        >
            <View style={styles.contentPadding}>
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
                </View>
            </View>
        </ActionSheet>
    );
}

const styles = StyleSheet.create({
    sheetContainer: {
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
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
});
