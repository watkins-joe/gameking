import "./WinMeter.scss";

interface WinMeterProps {
  winCredits: number;
}

function WinMeter({ winCredits }: WinMeterProps) {
  return (
    <div className="casino-font">
      WIN {winCredits > 0 ? Math.floor(winCredits).toLocaleString() : ""}
    </div>
  );
}

export default WinMeter;
