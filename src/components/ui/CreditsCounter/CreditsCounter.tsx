import "./CreditsCounter.css";

interface CreditMeterProps {
  balanceCents: number;
  creditsMode: boolean;
  denominationValueCents: number;
  onModeChange: () => void;
}

export function CreditMeter({
  balanceCents,
  creditsMode,
  denominationValueCents,
  onModeChange,
}: CreditMeterProps) {
  const amountDollars = balanceCents / 100;
  const credits =
    balanceCents === 0 ? 0 : Math.floor(balanceCents / denominationValueCents);

  return (
    <button className="credit-meter" type="button" onClick={onModeChange}>
      {creditsMode && <span className="casino-font">CREDITS</span>}
      {creditsMode ? (
        <output className="casino-font">{credits}</output>
      ) : (
        <output className="casino-font">${amountDollars.toFixed(2)}</output>
      )}
    </button>
  );
}
