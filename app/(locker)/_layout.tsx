import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors, fontFamily, fontSize } from "../../src/theme";

export default function LockerTabsLayout() {
  const insets = useSafeAreaInsets();
  const tabBarBottom = Math.max(insets.bottom, 8);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: colors.background },
        tabBarActiveTintColor: colors.foreground,
        tabBarInactiveTintColor: colors.mutedForeground,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          paddingTop: 8,
          paddingBottom: tabBarBottom,
          height: 56 + tabBarBottom,
        },
        tabBarLabelStyle: {
          fontFamily: fontFamily.sansRegular,
          fontSize: fontSize.xs,
        },
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Dolap" }} />
      <Tabs.Screen name="books" options={{ title: "Kitaplar" }} />
      <Tabs.Screen name="rentals" options={{ title: "Kiralamalarım" }} />
    </Tabs>
  );
}
