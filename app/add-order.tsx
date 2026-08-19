import React, { useState, useEffect } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { COLORS } from "@/constants/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import Autocomplete from "@/components/Helper/Autocomplete";
import SegmentedControl, { SegmentedOption } from "@/components/Helper/SegmentedControl";
import database from "@/db";
import { Customer } from "@/db/models";

export default function AddOrder() {
    const router = useRouter();

    const [customers, setCustomers] = useState<Customer[]>([]);
    const [customerName, setCustomerName] = useState("");
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

    const [showAddCustomer, setShowAddCustomer] = useState(false);
    const [newPhone, setNewPhone] = useState("");
    const [newAddress, setNewAddress] = useState("");

    const [productType, setProductType] = useState<"Gear" | "Wheel">("Gear");
    const [gearSubType, setGearSubType] = useState<"Straight" | "Helix">("Straight");
    const [gearHand, setGearHand] = useState<"Right" | "Left">("Right");
    const [wheelHand, setWheelHand] = useState<"Right" | "Left">("Right");

    // Gear Fields
    const [gearOutDia, setGearOutDia] = useState("");
    const [gearTeeth, setGearTeeth] = useState("");
    const [gearAngle, setGearAngle] = useState(""); // Now a string
    const [gearCutter, setGearCutter] = useState("");

    // Wheel Fields
    const [wheelOutDia, setWheelOutDia] = useState("");
    const [throatDia, setThroatDia] = useState("");
    const [wheelPitch, setWheelPitch] = useState("");
    const [wheelStarts, setWheelStarts] = useState("");
    const [wormDia, setWormDia] = useState("");
    const [wheelTeeth, setWheelTeeth] = useState("");
    const [wheelAngle, setWheelAngle] = useState(""); // Now a string
    const [wheelCutter, setWheelCutter] = useState("");

    const typeOptions: SegmentedOption[] = [
        { label: "Gear", value: "Gear" },
        { label: "Wheel", value: "Wheel" }
    ];

    const gearSubTypeOptions: SegmentedOption[] = [
        { label: "Straight", value: "Straight" },
        { label: "Helix", value: "Helix" }
    ];

    const handOptions: SegmentedOption[] = [
        { label: "Right", value: "Right" },
        { label: "Left", value: "Left" }
    ];

    useEffect(() => {
        loadCustomers();
    }, []);

    const loadCustomers = async () => {
        const custs = await database.collections.get<Customer>("customers").query().fetch();
        setCustomers(custs);
    };

    const handleCustomerChange = (text: string) => {
        setCustomerName(text);
        const match = customers.find(c => c.name.toLowerCase() === text.toLowerCase());
        if (match) {
            setSelectedCustomer(match);
            setShowAddCustomer(false);
        } else {
            setSelectedCustomer(null);
        }
    };

    const handleAddCustomer = async () => {
        if (!customerName.trim()) {
            Alert.alert("Error", "Please enter a customer name first.");
            return;
        }
        try {
            let newCust: Customer | undefined;
            await database.write(async () => {
                newCust = await database.collections.get<Customer>("customers").create((c) => {
                    c.name = customerName;
                    c.phoneNumber = newPhone;
                    c.businessAddress = newAddress;
                });
            });
            if (newCust) {
                setCustomers([...customers, newCust]);
                setSelectedCustomer(newCust);
                setShowAddCustomer(false);
                Alert.alert("Success", "Customer added successfully");
            }
        } catch (error) {
            console.error("Error adding customer:", error);
            Alert.alert("Error", "Could not add customer.");
        }
    };

    const handleSaveOrder = async () => {
        if (!selectedCustomer) {
            Alert.alert("Error", "Please select or add a customer first.");
            return;
        }

        try {
            await database.write(async () => {
                const order = await database.collections.get("orders").create((o: any) => {
                    o.customer.set(selectedCustomer);
                    o.orderStatus = "quoted";
                    o.quotedRatePerPc = 0;
                    o.finalRatePerPc = 0;
                    o.totalAgreedAmount = 0;
                });

                if (productType === "Gear") {
                    await database.collections.get("gear_specifications").create((g: any) => {
                        g.order.set(order);
                        g.versionNumber = 1;
                        g.isCurrentVersion = true;
                        g.gearType = gearSubType.toLowerCase(); // straight or helix
                        g.moduleOrDp = "module";
                        g.cutterNumber = gearCutter ? parseFloat(gearCutter) : 0;
                        g.teethCount = gearTeeth ? parseInt(gearTeeth) : 0;
                        
                        if (gearSubType === "Helix") {
                            g.helixAngle = gearAngle;
                            g.hand = gearHand;
                        } else {
                            g.helixAngle = "";
                            g.hand = "";
                        }
                        
                        g.outDia = gearOutDia ? parseFloat(gearOutDia) : 0;
                        g.calculatedOd = 0; 
                    });
                } else {
                    await database.collections.get("worm_wheel_specifications").create((w: any) => {
                        w.order.set(order);
                        w.versionNumber = 1;
                        w.isCurrentVersion = true;
                        w.outDia = wheelOutDia ? parseFloat(wheelOutDia) : 0;
                        w.throatDia = throatDia ? parseFloat(throatDia) : 0;
                        w.pitch = wheelPitch ? parseFloat(wheelPitch) : 0;
                        w.moduleOrDp = "module";
                        w.cutterNumber = wheelCutter ? parseFloat(wheelCutter) : 0;
                        w.starts = wheelStarts ? parseInt(wheelStarts) : 0;
                        w.wormDia = wormDia ? parseFloat(wormDia) : 0;
                        w.teethCount = wheelTeeth ? parseInt(wheelTeeth) : 0;
                        w.wheelAngle = wheelAngle;
                        w.hand = wheelHand;
                    });
                }
            });
            
            Alert.alert("Success", "Order saved successfully!");
            router.back();
        } catch (error) {
            console.error("Error saving order:", error);
            Alert.alert("Error", "Could not save order.");
        }
    };

    const isFieldsDisabled = !selectedCustomer;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.black} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>New Order</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.formContainer} keyboardShouldPersistTaps="handled">
                <View style={styles.customerRow}>
                    <View style={{ flex: 1 }}>
                        <Autocomplete
                            label="Customer Name"
                            placeholder="Enter or select customer..."
                            value={customerName}
                            onChangeText={handleCustomerChange}
                            options={customers.map(c => c.name)}
                            required
                            zIndex={2000}
                        />
                    </View>
                    {!selectedCustomer && (
                        <TouchableOpacity 
                            style={styles.addCustomerBtn}
                            onPress={() => setShowAddCustomer(!showAddCustomer)}
                        >
                            <Ionicons name={showAddCustomer ? "remove" : "add"} size={24} color={COLORS.white} />
                        </TouchableOpacity>
                    )}
                </View>

                {showAddCustomer && !selectedCustomer && (
                    <View style={styles.newCustomerCard}>
                        <Text style={styles.sectionTitle}>New Customer Details</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Phone Number (Optional)"
                            value={newPhone}
                            onChangeText={setNewPhone}
                            keyboardType="phone-pad"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Business Address (Optional)"
                            value={newAddress}
                            onChangeText={setNewAddress}
                        />
                        <TouchableOpacity style={styles.saveCustomerBtn} onPress={handleAddCustomer}>
                            <Text style={styles.saveCustomerBtnText}>Save Customer</Text>
                        </TouchableOpacity>
                    </View>
                )}

                <View style={styles.segmentWrapper}>
                    <SegmentedControl
                        options={typeOptions}
                        selectedValue={productType}
                        onChange={(val) => setProductType(val as "Gear" | "Wheel")}
                    />
                </View>

                <View style={[styles.fieldsCard, isFieldsDisabled && styles.disabledCard]}>
                    <Text style={styles.sectionTitle}>{productType} Details (Optional)</Text>
                    {isFieldsDisabled && (
                        <Text style={styles.warningText}>Please select a customer to unlock these fields.</Text>
                    )}
                    
                    {productType === "Gear" ? (
                        <>
                            <View style={styles.innerSegmentWrapper}>
                                <SegmentedControl
                                    options={gearSubTypeOptions}
                                    selectedValue={gearSubType}
                                    onChange={(val) => setGearSubType(val as "Straight" | "Helix")}
                                />
                            </View>

                            <TextInput
                                style={[styles.input, isFieldsDisabled && styles.disabledInput]}
                                placeholder="Outer Diameter (mm)"
                                value={gearOutDia}
                                onChangeText={setGearOutDia}
                                keyboardType="numeric"
                                editable={!isFieldsDisabled}
                            />
                            <TextInput
                                style={[styles.input, isFieldsDisabled && styles.disabledInput]}
                                placeholder="Teeth"
                                value={gearTeeth}
                                onChangeText={setGearTeeth}
                                keyboardType="numeric"
                                editable={!isFieldsDisabled}
                            />

                            {gearSubType === "Helix" && (
                                <>
                                    <TextInput
                                        style={[styles.input, isFieldsDisabled && styles.disabledInput]}
                                        placeholder="Angle (e.g. 9deg 6min)"
                                        value={gearAngle}
                                        onChangeText={setGearAngle}
                                        editable={!isFieldsDisabled}
                                    />
                                    <View style={styles.innerSegmentWrapper}>
                                        <Text style={styles.label}>Hand Direction</Text>
                                        <SegmentedControl
                                            options={handOptions}
                                            selectedValue={gearHand}
                                            onChange={(val) => setGearHand(val as "Right" | "Left")}
                                        />
                                    </View>
                                </>
                            )}
                            
                            <TextInput
                                style={[styles.input, isFieldsDisabled && styles.disabledInput]}
                                placeholder="Cutter Provided"
                                value={gearCutter}
                                onChangeText={setGearCutter}
                                editable={!isFieldsDisabled}
                            />
                        </>
                    ) : (
                        <>
                            <TextInput
                                style={[styles.input, isFieldsDisabled && styles.disabledInput]}
                                placeholder="Outer Diameter (mm)"
                                value={wheelOutDia}
                                onChangeText={setWheelOutDia}
                                keyboardType="numeric"
                                editable={!isFieldsDisabled}
                            />
                            <TextInput
                                style={[styles.input, isFieldsDisabled && styles.disabledInput]}
                                placeholder="Throat Diameter (mm)"
                                value={throatDia}
                                onChangeText={setThroatDia}
                                keyboardType="numeric"
                                editable={!isFieldsDisabled}
                            />
                            <TextInput
                                style={[styles.input, isFieldsDisabled && styles.disabledInput]}
                                placeholder="Pitch"
                                value={wheelPitch}
                                onChangeText={setWheelPitch}
                                keyboardType="numeric"
                                editable={!isFieldsDisabled}
                            />
                            <TextInput
                                style={[styles.input, isFieldsDisabled && styles.disabledInput]}
                                placeholder="Teeth"
                                value={wheelTeeth}
                                onChangeText={setWheelTeeth}
                                keyboardType="numeric"
                                editable={!isFieldsDisabled}
                            />
                            <TextInput
                                style={[styles.input, isFieldsDisabled && styles.disabledInput]}
                                placeholder="Wheel Angle (e.g. 10deg 5min)"
                                value={wheelAngle}
                                onChangeText={setWheelAngle}
                                editable={!isFieldsDisabled}
                            />
                            <View style={styles.innerSegmentWrapper}>
                                <Text style={styles.label}>Hand Direction</Text>
                                <SegmentedControl
                                    options={handOptions}
                                    selectedValue={wheelHand}
                                    onChange={(val) => setWheelHand(val as "Right" | "Left")}
                                />
                            </View>
                            <TextInput
                                style={[styles.input, isFieldsDisabled && styles.disabledInput]}
                                placeholder="Worm Diameter"
                                value={wormDia}
                                onChangeText={setWormDia}
                                keyboardType="numeric"
                                editable={!isFieldsDisabled}
                            />
                            <TextInput
                                style={[styles.input, isFieldsDisabled && styles.disabledInput]}
                                placeholder="Starts"
                                value={wheelStarts}
                                onChangeText={setWheelStarts}
                                keyboardType="numeric"
                                editable={!isFieldsDisabled}
                            />
                            <TextInput
                                style={[styles.input, isFieldsDisabled && styles.disabledInput]}
                                placeholder="Cutter Provided"
                                value={wheelCutter}
                                onChangeText={setWheelCutter}
                                editable={!isFieldsDisabled}
                            />
                        </>
                    )}
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity 
                    style={[styles.saveBtn, isFieldsDisabled && styles.disabledBtn]} 
                    onPress={handleSaveOrder}
                    disabled={isFieldsDisabled}
                >
                    <Text style={styles.saveBtnText}>Save Order</Text>
                </TouchableOpacity>
            </View>
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
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.neutralLight,
        backgroundColor: COLORS.white,
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: COLORS.black,
    },
    formContainer: {
        padding: 20,
    },
    customerRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        zIndex: 2000,
    },
    addCustomerBtn: {
        backgroundColor: COLORS.primary,
        width: 48,
        height: 48,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 10,
        marginTop: 25, 
    },
    newCustomerCard: {
        backgroundColor: COLORS.neutralBackground,
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
        zIndex: 1000,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: COLORS.black,
        marginBottom: 10,
    },
    label: {
        fontSize: 13,
        fontWeight: "600",
        color: COLORS.neutralDark,
        marginBottom: 6,
        marginLeft: 4,
    },
    input: {
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.neutralLight,
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 12,
        fontSize: 16,
        marginBottom: 12,
        color: COLORS.black,
    },
    disabledInput: {
        backgroundColor: COLORS.neutralBackground,
        color: COLORS.neutral,
    },
    saveCustomerBtn: {
        backgroundColor: COLORS.secondary,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
    },
    saveCustomerBtnText: {
        color: COLORS.white,
        fontWeight: "bold",
        fontSize: 15,
    },
    segmentWrapper: {
        marginBottom: 20,
        zIndex: 1000,
    },
    innerSegmentWrapper: {
        marginBottom: 15,
    },
    fieldsCard: {
        backgroundColor: COLORS.white,
        padding: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: COLORS.neutralLight,
        marginBottom: 40,
        zIndex: 1000,
    },
    disabledCard: {
        opacity: 0.6,
    },
    warningText: {
        color: COLORS.error,
        fontSize: 12,
        marginBottom: 10,
    },
    footer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: COLORS.neutralLight,
        backgroundColor: COLORS.white,
    },
    saveBtn: {
        backgroundColor: COLORS.primary,
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: "center",
    },
    disabledBtn: {
        backgroundColor: COLORS.neutral,
    },
    saveBtnText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: "bold",
    },
});
