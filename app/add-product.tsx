import TextField from "@/components/Helper/TextField";
import FormBlock from "@/components/Wrappers/FormBlock";
import { COLORS } from "@/constants/theme";
import { database } from "@/db";
import { Product } from "@/db/models";
import { useInventory } from "@/hooks/useInventory";
import { DateTimePicker } from "@expo/ui/community/datetime-picker";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddProductScreen() {
    const { addProduct, updateProduct } = useInventory();
    const { id } = useLocalSearchParams<{ id: string }>();

    const [customerName, setCustomerName] = useState("");
    const [productName, setProductName] = useState("");
    const [totalQuantity, setTotalQuantity] = useState("");
    const [dispatchedQuantity, setDispatchedQuantity] = useState(0);
    const [createdAt, setCreatedAt] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    useEffect(() => {
        if (id) {
            const fetchProduct = async () => {
                try {
                    const product = await database.get<Product>("products").find(id);
                    setCustomerName(product.customerName);
                    setProductName(product.productName);
                    setTotalQuantity(product.totalQuantity.toString());
                    setDispatchedQuantity(product.dispatchedQuantity);
                    if (product.createdAt) {
                        setCreatedAt(new Date(product.createdAt));
                    }
                } catch (e) {
                    console.error("Failed to load product details:", e);
                    Alert.alert("Error", "Could not load product details.");
                }
            };
            fetchProduct();
        }
    }, [id]);

    const handleSave = async () => {
        try {
            if (!customerName.trim() || !productName.trim() || !totalQuantity.trim()) {
                Alert.alert("Missing Fields", "Please fill in all fields.");
                return;
            }

            const parsedTotal = parseInt(totalQuantity, 10);

            if (isNaN(parsedTotal) || parsedTotal <= 0) {
                Alert.alert("Invalid Input", "Total quantity must be a valid positive number.");
                return;
            }

            const data = {
                customerName: customerName.trim(),
                productName: productName.trim(),
                totalQuantity: parsedTotal,
                dispatchedQuantity: dispatchedQuantity,
                createdAt: createdAt.getTime(),
            };

            if (id) {
                await updateProduct(id, data);
            } else {
                await addProduct(data);
            }

            router.back();
        } catch (e) {
            console.error("Error saving product:", e);
            Alert.alert("Error", "Failed to save product. Please try again.");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.black} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{id ? "Edit Product Lot" : "Add Product Lot"}</Text>
                <View style={styles.headerRight} />
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                <Text style={styles.sectionTitle}>Lot Details</Text>
                <FormBlock>
                    <TextField
                        label="Customer Name"
                        placeholder="e.g. Acme Corp"
                        value={customerName}
                        onChangeText={setCustomerName}
                        required
                        keyboardType="default"
                    />
                    <TextField
                        label="Product / Gear Name"
                        placeholder="e.g. Spur Gear 20T"
                        value={productName}
                        onChangeText={setProductName}
                        required
                        keyboardType="default"
                    />
                    <TextField
                        label="Total Quantity"
                        placeholder="e.g. 500"
                        keyboardType="numeric"
                        value={totalQuantity}
                        onChangeText={setTotalQuantity}
                        required
                    />
                    <View style={styles.dateContainer}>
                        <Text style={styles.dateLabel}>Record Date</Text>
                        <TouchableOpacity
                            style={styles.datePickerBtn}
                            onPress={() => setShowDatePicker(true)}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="calendar-outline" size={20} color={COLORS.primaryLight} />
                            <Text style={styles.datePickerText}>{createdAt.toLocaleDateString()}</Text>
                        </TouchableOpacity>
                        {showDatePicker && (
                            <DateTimePicker
                                value={createdAt}
                                mode="date"
                                display="default"
                                presentation="dialog"
                                onValueChange={(event, selectedDate) => {
                                    setShowDatePicker(Platform.OS === "ios");
                                    if (selectedDate) {
                                        setCreatedAt(selectedDate);
                                    }
                                }}
                            />
                        )}
                    </View>
                </FormBlock>

                <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.8}>
                    <Text style={styles.saveBtnText}>{id ? "Update Product Lot" : "Save Product Lot"}</Text>
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
    dateContainer: {
        marginBottom: 15,
    },
    dateLabel: {
        fontSize: 14,
        fontWeight: "600",
        color: COLORS.black,
        marginBottom: 8,
        marginLeft: 4,
    },
    datePickerBtn: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.neutralLight,
        borderRadius: 12,
        paddingHorizontal: 15,
        paddingVertical: 14,
        gap: 10,
    },
    datePickerText: {
        fontSize: 16,
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
