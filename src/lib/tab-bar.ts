/** Matches `app/(locker)/_layout.tsx` tab bar height for list bottom inset. */
export const TAB_BAR_BODY_HEIGHT = 56;
export const TAB_BAR_MIN_BOTTOM_INSET = 8;

export function tabBarClearance(bottomSafeInset: number): number {
  return TAB_BAR_BODY_HEIGHT + Math.max(bottomSafeInset, TAB_BAR_MIN_BOTTOM_INSET);
}
