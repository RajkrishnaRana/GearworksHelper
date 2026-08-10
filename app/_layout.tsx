import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { SheetProvider } from "react-native-actions-sheet";
import "@/db";

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
            <StatusBar style="auto" />
        </SheetProvider>
    );
}


