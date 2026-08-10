import AddInventoryActionSheet from "@/components/ActionSheets/AddInventoryActionSheet";
import FloatingAddButton from "@/components/Buttons/FloatingAddButton";
import CalculatorHeader from "@/components/Headers/CalculatorHeader";
import SegmentedControl, { SegmentedOption } from "@/components/Helper/SegmentedControl";
import { COLORS } from "@/constants/theme";
import { database } from "@/db";
import { Cutter, Machine } from "@/db/models";
import { useInventory } from "@/hooks/useInventory";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { withObservables } from "@nozbe/watermelondb/react";
import { router } from "expo-router";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const filterOptions: SegmentedOption[] = [
    { label: "All", value: "all" },
    { label: "Machines", value: "machine" },
    { label: "Cutters", value: "cutter" },
];

interface InventoryListProps {
    cutters: Cutter[];
    machines: Machine[];
}

const InventoryList = ({ cutters, machines }: InventoryListProps) => {
    const { filter, setFilter, isAddSheetOpen, setIsAddSheetOpen, deleteCutter, deleteMachine } = useInventory();

    const allItems = [
        ...machines.map((m) => ({ model: m, itemType: "machine" as const, uniqueId: `machine-${m.id}` })),
        ...cutters.map((c) => ({ model: c, itemType: "cutter" as const, uniqueId: `cutter-${c.id}` })),
    ];

    const filteredItems = allItems.filter((item) => {
        if (filter === "all") return true;
        return item.itemType === filter;
    });

    const renderItem = ({ item }: { item: any }) => {
        const isMachine = item.itemType === "machine";
        const model = item.model;

        return (
            <TouchableOpacity
                style={styles.card}
                activeOpacity={0.7}
                onPress={() => {
                    if (!isMachine) {
                        router.push(`/add-cutter?id=${model.id}`);
                    }
                }}
            >
                <View style={[styles.iconBox, isMachine ? styles.machineIconBg : styles.cutterIconBg]}>
                    <MaterialCommunityIcons
                        name={isMachine ? "cog" : "content-cut"}
                        size={24}
                        color={isMachine ? COLORS.primary : COLORS.secondary}
                    />
                </View>

                <View style={styles.cardContent}>
                    <Text style={styles.cardTitle}>
                        {isMachine
                            ? (model as Machine).name
                            : `${(model as Cutter).moduleOrDp} ${(model as Cutter).cutterType === "dp" ? "DP" : "Module"} Cutter`}
                    </Text>
                    <Text style={styles.cardSubtitle}>
                        {isMachine
                            ? `Ratio: ${(model as Machine).indexingRatio} • Feed: ${(model as Machine).feedConstant}`
                            : `Angle: ${(model as Cutter).angle}° • Bore: ${(model as Cutter).bore}mm • PA: ${(model as Cutter).pressureAngle}°`}
                    </Text>

                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>
                            {isMachine ? "MACHINE" : `Status: ${(model as Cutter).currentStatus}`}
                        </Text>
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => (isMachine ? deleteMachine(model) : deleteCutter(model))}
                >
                    <Ionicons name="trash-outline" size={20} color={COLORS.neutralDark} />
                </TouchableOpacity>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerWrapper}>
                <CalculatorHeader name="Inventory" subtitle="Manage machines and cutters in your shop." />

                <SegmentedControl options={filterOptions} selectedValue={filter} onChange={(val) => setFilter(val as any)} />
            </View>

            {filteredItems.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <MaterialCommunityIcons name="cube-outline" size={60} color={COLORS.neutralLight} />
                    <Text style={styles.emptyTitle}>No Items Found</Text>
                    <Text style={styles.emptySubtitle}>Tap the + button below to add a new machine or cutter.</Text>
                </View>
            ) : (
                <FlatList
                    data={filteredItems}
                    keyExtractor={(item) => item.uniqueId}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            )}

            <FloatingAddButton onPress={() => setIsAddSheetOpen(true)} />

            <AddInventoryActionSheet visible={isAddSheetOpen} onClose={() => setIsAddSheetOpen(false)} />
        </SafeAreaView>
    );
};

const EnhancedInventoryList = withObservables([], () => ({
    cutters: database.get<Cutter>("cutters").query().observe(),
    machines: database.get<Machine>("machines").query().observe(),
}))(InventoryList);

export default function Inventory() {
    return <EnhancedInventoryList />;
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.white },
    headerWrapper: { paddingHorizontal: 15 },
    listContent: { paddingHorizontal: 15, paddingBottom: 90, paddingTop: 5 },
    card: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.white,
        padding: 14,
        borderRadius: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: COLORS.neutralLight,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    iconBox: {
        width: 44,
        height: 44,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },
    machineIconBg: { backgroundColor: "#E6F4FE" },
    cutterIconBg: { backgroundColor: "#FFF8E1" },
    cardContent: { flex: 1 },
    cardTitle: { fontSize: 16, fontWeight: "bold", color: COLORS.black },
    cardSubtitle: { fontSize: 13, color: COLORS.neutralDark, marginTop: 2 },
    badge: {
        alignSelf: "flex-start",
        backgroundColor: COLORS.neutralBackground,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        marginTop: 6,
    },
    badgeText: { fontSize: 10, fontWeight: "bold", color: COLORS.neutralDark },
    deleteBtn: { padding: 6 },
    emptyContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 30,
        paddingBottom: 80,
    },
    emptyTitle: { fontSize: 18, fontWeight: "bold", color: COLORS.black, marginTop: 12 },
    emptySubtitle: { fontSize: 14, color: COLORS.neutral, textAlign: "center", marginTop: 6 },
});
