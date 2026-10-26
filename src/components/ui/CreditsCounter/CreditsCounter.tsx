import "./CreditsCounter.css";

export function CreditMeter({ amount, creditsMode, onModeChange }) {
  return (
    <div className="credit-meter" onClick={onModeChange}>
      {creditsMode && <span className="casino-font">CREDITS</span>}
      {creditsMode ? (
        <output className="casino-font">{amount}</output>
      ) : (
        <output className="casino-font">${amount.toFixed(2)}</output>
      )}
    </div>
  );
}
