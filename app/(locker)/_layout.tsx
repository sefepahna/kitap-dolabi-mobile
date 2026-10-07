import { Tabs } from "expo-router";
import { BookOpen, Clock, LayoutGrid } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors, fontFamily, fontSize } from "../../src/theme";

const ICON_SIZE = 20;
const ICON_STROKE = 1.6;

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
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dolap",
          tabBarIcon: ({ color }) => <LayoutGrid color={color} size={ICON_SIZE} strokeWidth={ICON_STROKE} />,
        }}
      />
      <Tabs.Screen
        name="books"
        options={{
          title: "Kitaplar",
          tabBarIcon: ({ color }) => <BookOpen color={color} size={ICON_SIZE} strokeWidth={ICON_STROKE} />,
        }}
      />
      <Tabs.Screen
        name="rentals"
        options={{
          title: "Kiralamalarım",
          tabBarIcon: ({ color }) => <Clock color={color} size={ICON_SIZE} strokeWidth={ICON_STROKE} />,
        }}
      />
    </Tabs>
  );
}
