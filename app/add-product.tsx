import Autocomplete from "@/components/Helper/Autocomplete";
import SegmentedControl from "@/components/Helper/SegmentedControl";
import TextField from "@/components/Helper/TextField";
import FormBlock from "@/components/Wrappers/FormBlock";
import { COLORS } from "@/constants/theme";
import { database } from "@/db";
import { Product } from "@/db/models";
import { useInventory } from "@/hooks/useInventory";
import { DateTimePicker } from "@expo/ui/community/datetime-picker";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Q } from "@nozbe/watermelondb";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddProductScreen() {
    const { addProduct, updateProduct } = useInventory();
    const { id } = useLocalSearchParams<{ id: string }>();

    const [customerName, setCustomerName] = useState("");
    const [productName, setProductName] = useState("");
    const [quantity, setQuantity] = useState("");
    const [actionType, setActionType] = useState("in");
    const [createdAt, setCreatedAt] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    const [customerOptions, setCustomerOptions] = useState<string[]>([]);
    const [productOptions, setProductOptions] = useState<string[]>([]);

    useEffect(() => {
        const fetchOptions = async () => {
            const products = await database.get<Product>("products").query().fetch();
            const cNames = Array.from(new Set(products.map((p) => p.customerName)));
            const pNames = Array.from(new Set(products.map((p) => p.productName)));
            setCustomerOptions(cNames);
            setProductOptions(pNames);
        };
        fetchOptions();
    }, []);

    useEffect(() => {
        if (id) {
            const fetchProduct = async () => {
                try {
                    const product = await database.get<Product>("products").find(id);
                    setCustomerName(product.customerName);
                    setProductName(product.productName);
                    // When editing, we don't know the exact past transaction, so we leave quantity blank or use total
                    // Since it's mostly a transactional form now, maybe we leave quantity empty
                    setQuantity("");
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
            if (!customerName.trim() || !productName.trim() || !quantity.trim()) {
                Alert.alert("Missing Fields", "Please fill in all fields.");
                return;
            }

            const parsedQty = parseInt(quantity, 10);

            if (isNaN(parsedQty) || parsedQty <= 0) {
                Alert.alert("Invalid Input", "Quantity must be a valid positive number.");
                return;
            }

            if (id) {
                // Edit existing product directly
                const existingProduct = await database.get<Product>("products").find(id);
                const newTotal = actionType === "in" ? existingProduct.totalQuantity + parsedQty : existingProduct.totalQuantity;
                const newDispatched =
                    actionType === "out" ? existingProduct.dispatchedQuantity + parsedQty : existingProduct.dispatchedQuantity;

                await updateProduct(id, {
                    customerName: customerName.trim(),
                    productName: productName.trim(),
                    totalQuantity: newTotal,
                    dispatchedQuantity: newDispatched,
                    createdAt: createdAt.getTime(),
                });
            } else {
                // Find if this product lot already exists
                const existingProducts = await database
                    .get<Product>("products")
                    .query(Q.where("customer_name", customerName.trim()), Q.where("product_name", productName.trim()))
                    .fetch();

                const existingProduct = existingProducts[0];

                if (existingProduct) {
                    const newTotal =
                        actionType === "in" ? existingProduct.totalQuantity + parsedQty : existingProduct.totalQuantity;
                    const newDispatched =
                        actionType === "out"
                            ? existingProduct.dispatchedQuantity + parsedQty
                            : existingProduct.dispatchedQuantity;

                    await updateProduct(existingProduct.id, {
                        customerName: existingProduct.customerName,
                        productName: existingProduct.productName,
                        totalQuantity: newTotal,
                        dispatchedQuantity: newDispatched,
                        createdAt: createdAt.getTime(),
                    });
                } else {
                    await addProduct({
                        customerName: customerName.trim(),
                        productName: productName.trim(),
                        totalQuantity: actionType === "in" ? parsedQty : 0,
                        dispatchedQuantity: actionType === "out" ? parsedQty : 0,
                        createdAt: createdAt.getTime(),
                    });
                }
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
                <SegmentedControl
                    label="Transaction Type"
                    options={[
                        { label: "IN (Receive)", value: "in" },
                        { label: "OUT (Dispatch)", value: "out" },
                    ]}
                    selectedValue={actionType}
                    onChange={setActionType}
                />

                <Text style={styles.sectionTitle}>Lot Details</Text>
                <FormBlock>
                    <Autocomplete
                        label="Customer Name"
                        placeholder="e.g. Acme Corp"
                        value={customerName}
                        onChangeText={setCustomerName}
                        options={customerOptions}
                        required
                        zIndex={2000}
                    />
                    <Autocomplete
                        label="Product / Gear Name"
                        placeholder="e.g. Spur Gear 20T"
                        value={productName}
                        onChangeText={setProductName}
                        options={productOptions}
                        required
                        zIndex={1000}
                    />
                    <TextField
                        label={actionType === "in" ? "Quantity Received (IN)" : "Quantity Dispatched (OUT)"}
                        placeholder="e.g. 50"
                        keyboardType="numeric"
                        value={quantity}
                        onChangeText={setQuantity}
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
