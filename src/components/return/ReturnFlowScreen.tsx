// Native return flow: intro → checking → lockerOk → opened → verifying → verified → done.
import { Stack } from "expo-router";

import { DEFAULT_LOCKER_ID, getLocker } from "../../data/mock";
import { useReturnFlow } from "../../hooks/useReturnFlow";
import { getLockerSlots } from "../../lib/rental-flow";
import { buildReturnSummary } from "../../lib/return-flow";
import { CompartmentStep } from "../rental/CompartmentStep";
import { RentalNotice } from "../rental/RentalNotice";
import { StatusStep } from "../rental/StatusStep";
import { ReturnDoneStep } from "./ReturnDoneStep";
import { ReturnIntroStep } from "./ReturnIntroStep";

const RENTALS_ACTION = "Kiralamalarıma Dön";

export function ReturnFlowScreen() {
  const ret = useReturnFlow();
  const { flow, busy, eligibility, context } = ret;

  // Swipe-back only before the locker simulation starts or on guard screens.
  const canSwipeBack = flow.step === "intro";
  const options = <Stack.Screen options={{ gestureEnabled: canSwipeBack }} />;
  const notice = (title: string, text?: string) => (
    <>
      {options}
      <RentalNotice title={title} text={text} actionLabel={RENTALS_ACTION} onAction={ret.goToRentals} />
    </>
  );

  if (flow.step === "intro") {
    switch (eligibility.status) {
      case "missing":
        return notice("Kiralama bulunamadı");
      case "returned":
        return notice("Bu kitap zaten iade edildi");
      case "invalidData":
        return notice("Kiralama bilgisi eksik", "Bu kiralamanın kitap veya dolap bilgisi bulunamadı.");
      case "wrongLocker":
        return notice("Yanlış dolap", "Bu kitap yalnızca aldığın dolaba iade edilebilir.");
    }
  }

  const currentLocker = getLocker(DEFAULT_LOCKER_ID);
  if (!context || !currentLocker) return notice("Kiralama bilgisi eksik");
  const { rental, book, rentalLocker } = context;

  const renderStep = () => {
    switch (flow.step) {
      case "intro":
        return (
          <ReturnIntroStep
            book={book}
            summary={buildReturnSummary(rental, rentalLocker, currentLocker)}
            busy={busy}
            onStart={ret.start}
            onBack={ret.goBack}
          />
        );
      case "checking":
        return <StatusStep title="Dolap doğrulanıyor" text={currentLocker.name} />;
      case "lockerOk":
        return <StatusStep done title="Dolap doğrulandı" text="İade bölmesi açılıyor" />;
      case "opened":
      case "verifying":
      case "verified":
        return (
          <CompartmentStep
            phase={flow.step}
            slot={rental.slot}
            slots={getLockerSlots(rental.lockerId)}
            busy={busy}
            openedHint="Kitabı bölmeye yerleştir ve kapağı kapat."
            confirmLabel="Kitabı yerleştirdim, kapağı kapattım"
            onConfirm={ret.confirmBookPlaced}
          />
        );
      case "done":
        return <ReturnDoneStep title={book.title} onGoToRentals={ret.goToRentals} />;
      case "failed":
        return notice("İşlem tamamlanamadı", flow.error ?? undefined);
    }
  };

  return (
    <>
      {options}
      {renderStep()}
    </>
  );
}
