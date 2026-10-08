import { DEFAULT_LOCKER_ID } from "../data/mock";
import { validateLockerId } from "./entry-state";

/** Locker ID encoded in the demo QR simulation. */
export const DEMO_QR_LOCKER_ID = DEFAULT_LOCKER_ID;

export function resolveMockQrScan(): string | null {
  return validateLockerId(DEMO_QR_LOCKER_ID);
}
