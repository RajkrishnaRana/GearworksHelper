import "@/db";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { SheetProvider } from "react-native-actions-sheet";

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
    useEffect(() => {
        SplashScreen.hideAsync().catch(() => {});
    }, []);

    return (
        <SheetProvider>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="(calculator)" />
            </Stack>
            <StatusBar style="dark" />
        </SheetProvider>
    );
}
