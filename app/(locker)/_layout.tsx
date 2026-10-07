import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function LockerTabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          paddingTop: 8,
          paddingBottom: Math.max(insets.bottom, 8),
          height: 56 + Math.max(insets.bottom, 8),
        },
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Dolap" }} />
      <Tabs.Screen name="books" options={{ title: "Kitaplar" }} />
      <Tabs.Screen name="rentals" options={{ title: "Kiralamalarım" }} />
    </Tabs>
  );
}
