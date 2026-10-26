import "./CreditsCounter.css";

export function CreditMeter({ amount, creditsMode, onModeChange }) {
  return (
    <div className="credit-meter" onClick={onModeChange}>
      {creditsMode && <span className="credits-font">CREDITS</span>}
      {creditsMode ? (
        <output className="credits-font">{amount}</output>
      ) : (
        <output className="credits-font">${amount.toFixed(2)}</output>
      )}
    </div>
  );
}
