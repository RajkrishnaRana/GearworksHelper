import CalculatorHeader from "@/components/Headers/CalculatorHeader";
import SegmentedControl, { SegmentedOption } from "@/components/Helper/SegmentedControl";
import { COLORS } from "@/constants/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React, { useState } from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export interface ClientOrder {
    id: string;
    orderNumber: string;
    clientName: string;
    details: string;
    dueDate: string;
    status: "Pending" | "In Progress" | "Completed";
}

export default function Orders() {
    const [orders, setOrders] = useState<ClientOrder[]>([
        {
            id: "1",
            orderNumber: "#ORD-2041",
            clientName: "Apex Motion Tech",
            details: "15x Helical Gears (Module 3.0)",
            dueDate: "Aug 15, 2026",
            status: "In Progress",
        },
        {
            id: "2",
            orderNumber: "#ORD-2040",
            clientName: "Precision Drive Corp",
            details: "8x Worm Wheel & Shaft Sets",
            dueDate: "Aug 20, 2026",
            status: "Pending",
        },
        {
            id: "3",
            orderNumber: "#ORD-2038",
            clientName: "Industrial Gear Works",
            details: "50x Standard Spur Gears",
            dueDate: "Aug 02, 2026",
            status: "Completed",
        },
    ]);

    const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");

    const filterOptions: SegmentedOption[] = [
        { label: "All", value: "all" },
        { label: "Pending", value: "pending" },
        { label: "Completed", value: "completed" },
    ];

    const filteredOrders = orders.filter((order) => {
        if (filter === "all") return true;
        if (filter === "pending") return order.status === "Pending" || order.status === "In Progress";
        if (filter === "completed") return order.status === "Completed";
        return true;
    });

    const getStatusStyle = (status: ClientOrder["status"]) => {
        switch (status) {
            case "Completed":
                return { bg: "#E8F5E9", text: "#2E7D32" };
            case "In Progress":
                return { bg: "#E3F2FD", text: "#1565C0" };
            case "Pending":
            default:
                return { bg: "#FFF3E0", text: "#E65100" };
        }
    };

    const renderOrderItem = ({ item }: { item: ClientOrder }) => {
        const statusStyle = getStatusStyle(item.status);
        return (
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <View style={styles.clientInfo}>
                        <MaterialCommunityIcons name="clipboard-text-outline" size={22} color={COLORS.primary} />
                        <Text style={styles.orderNumber}>{item.orderNumber}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                        <Text style={[styles.statusText, { color: statusStyle.text }]}>{item.status}</Text>
                    </View>
                </View>

                <Text style={styles.clientName}>{item.clientName}</Text>
                <Text style={styles.orderDetails}>{item.details}</Text>

                <View style={styles.cardFooter}>
                    <View style={styles.dateRow}>
                        <Ionicons name="calendar-outline" size={14} color={COLORS.neutralDark} />
                        <Text style={styles.dateText}>Due: {item.dueDate}</Text>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerWrapper}>
                <CalculatorHeader
                    name="Client Orders"
                    subtitle="Manage client orders, specifications, and delivery schedules."
                />

                <SegmentedControl
                    options={filterOptions}
                    selectedValue={filter}
                    onChange={(val) => setFilter(val as "all" | "pending" | "completed")}
                />
            </View>

            {filteredOrders.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <MaterialCommunityIcons name="clipboard-text-off-outline" size={60} color={COLORS.neutralLight} />
                    <Text style={styles.emptyTitle}>No Orders Found</Text>
                    <Text style={styles.emptySubtitle}>
                        There are no client orders under this filter category.
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={filteredOrders}
                    keyExtractor={(item) => item.id}
                    renderItem={renderOrderItem}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    headerWrapper: {
        paddingHorizontal: 15,
    },
    listContent: {
        paddingHorizontal: 15,
        paddingBottom: 30,
        paddingTop: 5,
    },
    card: {
        backgroundColor: COLORS.white,
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: COLORS.neutralLight,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 1,
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    clientInfo: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    orderNumber: {
        fontSize: 14,
        fontWeight: "bold",
        color: COLORS.neutralDark,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 11,
        fontWeight: "bold",
    },
    clientName: {
        fontSize: 18,
        fontWeight: "bold",
        color: COLORS.black,
        marginBottom: 4,
    },
    orderDetails: {
        fontSize: 14,
        color: COLORS.neutralDark,
        marginBottom: 12,
    },
    cardFooter: {
        borderTopWidth: 0.7,
        borderTopColor: COLORS.neutralBackground,
        paddingTop: 8,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    dateRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
    },
    dateText: {
        fontSize: 12,
        color: COLORS.neutralDark,
    },
    emptyContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 30,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: COLORS.black,
        marginTop: 12,
    },
    emptySubtitle: {
        fontSize: 14,
        color: COLORS.neutral,
        textAlign: "center",
        marginTop: 6,
    },
});
