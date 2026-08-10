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
import { Q } from "@nozbe/watermelondb";
import { router } from "expo-router";
import { FlatList, StyleSheet, Text, TouchableOpacity, View, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";

const filterOptions: SegmentedOption[] = [
    { label: "All", value: "all" },
    { label: "Machines", value: "machine" },
    { label: "Cutters", value: "cutter" },
];

interface InventoryListProps {
    cutters: Cutter[];
    machines: Machine[];
    searchQuery?: string;
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
                    if (isMachine) {
                        router.push(`/add-machine?id=${model.id}`);
                    } else {
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
                    <Text style={styles.cardTitle}>{isMachine ? (model as Machine).name : (model as Cutter).cutterName}</Text>
                    {isMachine ? (
                        <Text style={styles.cardSubtitle}>
                            {`Ratio: ${(model as Machine).indexingRatio} • Status: ${(model as Machine).status || "active"}`}
                        </Text>
                    ) : (
                        <View style={styles.statsGrid}>
                            <Text style={styles.statItem}>Angle: {(model as Cutter).angle}</Text>
                            <Text style={styles.statItem}>Bore: {(model as Cutter).bore}mm</Text>
                            <Text style={styles.statItem}>Deep: {(model as Cutter).deep}</Text>
                            <Text style={styles.statItem}>Starts: {(model as Cutter).starts}</Text>
                            <Text style={styles.statItem}>Pitch: {(model as Cutter).pitch}</Text>
                        </View>
                    )}
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>
                            {isMachine ? "MACHINE" : ((model as Cutter).cutterType || "CUTTER").toUpperCase()}
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
        <View style={styles.listContainer}>
            <View style={styles.headerWrapper}>
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
                    keyboardShouldPersistTaps="handled"
                />
            )}

            <FloatingAddButton onPress={() => setIsAddSheetOpen(true)} />

            <AddInventoryActionSheet visible={isAddSheetOpen} onClose={() => setIsAddSheetOpen(false)} />
        </View>
    );
};

const EnhancedInventoryList = withObservables(['searchQuery'], ({ searchQuery }: { searchQuery: string }) => {
    let cutterQuery = database.get<Cutter>("cutters").query();
    let machineQuery = database.get<Machine>("machines").query();

    if (searchQuery && searchQuery.trim() !== "") {
        const query = searchQuery.trim();

        cutterQuery = database.get<Cutter>("cutters").query(
            Q.or(
                Q.where('cutter_name', Q.like(`%${query}%`)),
                Q.where('pitch', Q.like(`%${query}%`))
            )
        );

        machineQuery = database.get<Machine>("machines").query(
            Q.where('name', Q.like(`%${query}%`))
        );
    }

    return {
        cutters: cutterQuery.observe(),
        machines: machineQuery.observe(),
    };
})(InventoryList);

export default function Inventory() {
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerWrapper}>
                <CalculatorHeader name="Inventory" subtitle="Manage machines and cutters in your shop." />
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color={COLORS.neutralDark} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search cutters by name or pitch..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholderTextColor={COLORS.neutralDark}
                    />
                </View>
            </View>
            <EnhancedInventoryList searchQuery={searchQuery} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.white },
    listContainer: { flex: 1 },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.neutralBackground,
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 8,
        marginTop: 10,
        marginBottom: 10,
    },
    searchInput: {
        flex: 1,
        marginLeft: 8,
        fontSize: 15,
        color: COLORS.black,
    },
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
    statsGrid: { flexDirection: "row", flexWrap: "wrap", marginTop: 4 },
    statItem: { width: "50%", fontSize: 13, color: COLORS.neutralDark, marginBottom: 2 },
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
