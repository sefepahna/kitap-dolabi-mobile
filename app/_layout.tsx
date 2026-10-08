import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { DemoStoreProvider } from "../src/lib/demo-store";
import { EntryNavigationGuard } from "../src/lib/entry-navigation-guard";
import { EntryStateProvider } from "../src/lib/entry-state-context";
import { appFonts } from "../src/lib/fonts";
import { colors } from "../src/theme";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts(appFonts);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <EntryStateProvider>
        <DemoStoreProvider>
          <EntryNavigationGuard />
          <StatusBar style="dark" />
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }} />
        </DemoStoreProvider>
      </EntryStateProvider>
    </SafeAreaProvider>
  );
}
