// Leaves a finished/aborted flow screen without keeping it in navigation history.
import { useRouter, type Href } from "expo-router";
import { useCallback } from "react";

export function useFlowExit() {
  const router = useRouter();

  return useCallback(
    (href: Href) => {
      if (router.canDismiss()) router.dismissAll();
      router.replace(href);
    },
    [router],
  );
}
