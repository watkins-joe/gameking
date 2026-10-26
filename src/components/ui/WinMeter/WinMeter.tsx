import "./WinMeter.scss";

interface WinMeterProps {
  winAmount: number;
}

function WinMeter({ winAmount }: WinMeterProps) {
  return (
    <div className="casino-font">
      WIN {winAmount > 0 ? `$${winAmount.toFixed(2)}` : ""}
    </div>
  );
}

export default WinMeter;
