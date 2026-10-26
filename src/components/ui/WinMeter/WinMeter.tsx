import "./WinMeter.scss";

interface WinMeterProps {
  winAmount: number;
}

function WinMeter({ winAmount }: WinMeterProps) {
  return (
    <div className="casino-font">{winAmount && `WIN ${{ winAmount }}`}</div>
  );
}

export default WinMeter;
