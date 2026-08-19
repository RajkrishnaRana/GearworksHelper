import CalculatorHeader from "@/components/Headers/CalculatorHeader";
import SegmentedControl, { SegmentedOption } from "@/components/Helper/SegmentedControl";
import { COLORS } from "@/constants/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { database } from "@/db";
import { Order, Customer } from "@/db/models";
import { withObservables } from "@nozbe/watermelondb/react";
import { Q } from "@nozbe/watermelondb";

const filterOptions: SegmentedOption[] = [
    { label: "All", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Completed", value: "completed" },
];

const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
        case "completed":
        case "delivered":
            return { bg: "#E8F5E9", text: "#2E7D32" };
        case "in_production":
        case "in progress":
            return { bg: "#E3F2FD", text: "#1565C0" };
        case "quoted":
        case "confirmed":
        case "pending":
        default:
            return { bg: "#FFF3E0", text: "#E65100" };
    }
};

const OrderItem = ({ order, customer }: { order: Order; customer: Customer | null }) => {
    const statusStyle = getStatusStyle(order.orderStatus || "quoted");
    
    // Format a pseudo order number from ID
    const orderNumber = `#ORD-${order.id.slice(0, 4).toUpperCase()}`;

    // Format date properly
    const dueDate = order.deliveryDeadline 
        ? new Date(order.deliveryDeadline).toLocaleDateString()
        : "Not Set";

    return (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={styles.clientInfo}>
                    <MaterialCommunityIcons name="clipboard-text-outline" size={22} color={COLORS.primary} />
                    <Text style={styles.orderNumber}>{orderNumber}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                    <Text style={[styles.statusText, { color: statusStyle.text }]}>
                        {order.orderStatus.toUpperCase()}
                    </Text>
                </View>
            </View>

            <Text style={styles.clientName}>{customer ? customer.name : "Unknown Customer"}</Text>
            <Text style={styles.orderDetails}>Total Amount: ₹{order.totalAgreedAmount || 0}</Text>

            <View style={styles.cardFooter}>
                <View style={styles.dateRow}>
                    <Ionicons name="calendar-outline" size={14} color={COLORS.neutralDark} />
                    <Text style={styles.dateText}>Due: {dueDate}</Text>
                </View>
            </View>
        </View>
    );
};

const EnhancedOrderItem = withObservables(['order'], ({ order }: { order: Order }) => ({
    order: order.observe(),
    customer: order.customer.observe(),
}))(OrderItem);

const OrderList = ({ orders, filter }: { orders: Order[], filter: string }) => {
    const router = useRouter();

    const filteredOrders = orders.filter((order) => {
        const status = order.orderStatus?.toLowerCase() || "";
        if (filter === "all") return true;
        if (filter === "pending") return ["quoted", "confirmed", "in_production", "pending", "in progress"].includes(status);
        if (filter === "completed") return ["completed", "delivered"].includes(status);
        return true;
    });

    return (
        <>
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
                    renderItem={({ item }) => <EnhancedOrderItem order={item} />}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                />
            )}
            
            <TouchableOpacity 
                style={styles.fab}
                onPress={() => router.push('/add-order')}
            >
                <Ionicons name="add" size={32} color={COLORS.white} />
            </TouchableOpacity>
        </>
    );
};

const EnhancedOrderList = withObservables([], () => ({
    orders: database.collections.get<Order>('orders').query(
        Q.sortBy('created_at', Q.desc)
    ).observe(),
}))(OrderList);


export default function Orders() {
    const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");

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
            <EnhancedOrderList filter={filter} />
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
        paddingBottom: 80, // Extra padding to not hide behind FAB
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
    fab: {
        position: "absolute",
        bottom: 30,
        right: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: COLORS.primary,
        alignItems: "center",
        justifyContent: "center",
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
});
