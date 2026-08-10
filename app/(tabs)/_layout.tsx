import { HapticTab } from "@/components/Buttons/HapticTab";
import { COLORS } from "@/constants/theme";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Tabs } from "expo-router";

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: COLORS.primary,
                tabBarStyle: {
                    backgroundColor: COLORS.white,
                    borderTopColor: COLORS.neutralLight,
                    borderTopWidth: 1,
                    paddingBottom: 5,
                },
                headerShown: false,
                tabBarButton: HapticTab,
                animation: "shift",
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Dashboard",
                    tabBarIcon: ({ color, focused }) => (
                        <MaterialCommunityIcons
                            name={focused ? "view-dashboard" : "view-dashboard-outline"}
                            size={24}
                            color={focused ? color : COLORS.neutral}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="Orders"
                options={{
                    title: "Orders",
                    tabBarIcon: ({ color, focused }) => (
                        <FontAwesome6
                            name={focused ? "clipboard-list" : "clipboard"}
                            size={24}
                            color={focused ? color : COLORS.neutral}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="Calculator"
                options={{
                    title: "Calculator",
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={focused ? "calculator" : "calculator-outline"}
                            size={24}
                            color={focused ? color : COLORS.neutral}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="Inventory"
                options={{
                    title: "Inventory",
                    tabBarIcon: ({ color, focused }) => (
                        <MaterialCommunityIcons name="truck-cargo-container" size={24} color={focused ? color : COLORS.neutral} />
                    ),
                }}
            />
            <Tabs.Screen
                name="Settings"
                options={{
                    title: "Settings",
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={focused ? "settings" : "settings-outline"}
                            size={24}
                            color={focused ? color : COLORS.neutral}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}
