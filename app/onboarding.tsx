import { useLocalSearchParams } from "expo-router";

import { OnboardingScreen } from "../src/components/onboarding/OnboardingScreen";

export default function OnboardingRoute() {
  const { replay } = useLocalSearchParams<{ replay?: string }>();
  const isReplay = replay === "1" || replay === "true";
  return <OnboardingScreen replay={isReplay} />;
}
