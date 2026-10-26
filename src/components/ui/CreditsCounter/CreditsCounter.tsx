import "./CreditsCounter.css";

interface CreditMeterProps {
  amount: number;
  creditsMode: boolean;
  onModeChange: () => void;
}

export function CreditMeter({
  amount,
  creditsMode,
  onModeChange,
}: CreditMeterProps) {
  return (
    <button className="credit-meter" type="button" onClick={onModeChange}>
      {creditsMode && <span className="casino-font">CREDITS</span>}
      {creditsMode ? (
        <output className="casino-font">{(amount * 4).toFixed(0)}</output>
      ) : (
        <output className="casino-font">${amount.toFixed(2)}</output>
      )}
    </button>
  );
}
