// Native rental flow: phone → otp → summary → paying → preparing → opened → verifying → verified → done.
import { Stack } from "expo-router";

import { DEFAULT_LOCKER_ID } from "../../data/mock";
import { useRentalFlow } from "../../hooks/useRentalFlow";
import { buildRentalSummary, getLockerSlots, isPrePaymentStep } from "../../lib/rental-flow";
import { CompartmentStep } from "./CompartmentStep";
import { DoneStep } from "./DoneStep";
import { OtpStep } from "./OtpStep";
import { PhoneStep } from "./PhoneStep";
import { RentalNotice } from "./RentalNotice";
import { StatusStep } from "./StatusStep";
import { SummaryStep } from "./SummaryStep";

export function RentalFlowScreen() {
  const rental = useRentalFlow();
  const { flow, busy, eligibility, book, createdRental } = rental;

  // Swipe-back is only allowed on the first step or on guard screens; later steps use the in-flow back button.
  const canSwipeBack = flow.step === "phone" || (isPrePaymentStep(flow.step) && eligibility.status !== "ready");
  const options = <Stack.Screen options={{ gestureEnabled: canSwipeBack }} />;

  if (!book) {
    return (
      <>
        {options}
        <RentalNotice title="Bu kitap bu dolapta bulunmuyor." actionLabel="Kitaplara dön" onAction={rental.goToBooks} />
      </>
    );
  }

  if (isPrePaymentStep(flow.step) && eligibility.status === "unavailable") {
    return (
      <>
        {options}
        <RentalNotice
          title="Bu kitap şu anda kirada"
          text="Müsait olduğunda tekrar kiralayabilirsin."
          actionLabel="Kitaplara dön"
          onAction={rental.goToBooks}
        />
      </>
    );
  }

  const summary = buildRentalSummary(book, DEFAULT_LOCKER_ID);

  const renderStep = () => {
    switch (flow.step) {
      case "phone":
        return (
          <PhoneStep
            phone={flow.phone}
            error={flow.error}
            busy={busy}
            onChange={rental.changePhone}
            onSubmit={rental.submitPhone}
            onBack={rental.goBack}
          />
        );
      case "otp":
        return (
          <OtpStep
            phone={flow.phone}
            otp={flow.otp}
            error={flow.error}
            busy={busy}
            onChange={rental.changeOtp}
            onSubmit={() => rental.submitOtp()}
            onBack={rental.goBack}
          />
        );
      case "summary":
        return (
          <SummaryStep
            book={book}
            summary={summary}
            error={flow.error}
            busy={busy}
            onPay={rental.confirmPayment}
            onBack={rental.goBack}
          />
        );
      case "paying":
        return <StatusStep title="Ödeme işleniyor" text="Lütfen bekle, bu birkaç saniye sürebilir." />;
      case "preparing":
        return <StatusStep title="Kitabın hazırlanıyor" text={summary.lockerName} />;
      case "opened":
      case "verifying":
      case "verified":
        return (
          <CompartmentStep
            phase={flow.step}
            slot={book.slot}
            slots={getLockerSlots(DEFAULT_LOCKER_ID)}
            busy={busy}
            openedHint="Kitabını al ve kapağı kapat."
            confirmLabel="Kitabı aldım, kapağı kapattım"
            onConfirm={rental.confirmBookTaken}
          />
        );
      case "done":
        return (
          <DoneStep
            title={book.title}
            dueDate={createdRental?.dueDate ?? summary.returnOn}
            onGoToRentals={rental.goToRentals}
            onGoToLocker={rental.goToLocker}
          />
        );
      case "failed":
        return (
          <RentalNotice
            title="İşlem tamamlanamadı"
            text={flow.error ?? undefined}
            actionLabel="Dolaba dön"
            onAction={rental.goToLocker}
          />
        );
    }
  };

  return (
    <>
      {options}
      {renderStep()}
    </>
  );
}
