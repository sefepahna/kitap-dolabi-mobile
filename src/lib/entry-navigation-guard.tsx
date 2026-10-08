import { usePathname, useRouter } from "expo-router";
import { useEffect } from "react";

import { resolveInitialRoute } from "./entry-state";
import { useEntryState } from "./entry-state-context";

function isActiveFlowPath(pathname: string): boolean {
  return pathname.includes("/book") || pathname.includes("/iade") || pathname.includes("/kirala");
}

/** Keeps entry routes aligned with persisted state after reload (Expo keeps the current URL). */
export function EntryNavigationGuard() {
  const { isHydrated, entryState } = useEntryState();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isHydrated || isActiveFlowPath(pathname)) return;

    if (!entryState.hasCompletedOnboarding) {
      if (!pathname.includes("onboarding")) {
        router.replace("/onboarding");
      }
      return;
    }

    if (!entryState.selectedLockerId) {
      if (!pathname.includes("qr") && !pathname.includes("onboarding")) {
        router.replace("/qr");
      }
      return;
    }

    if (pathname === "/" || pathname === "") {
      router.replace(resolveInitialRoute(entryState));
    }
  }, [isHydrated, entryState, pathname, router]);

  return null;
}
