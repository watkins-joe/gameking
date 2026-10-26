import "./DenomModal.scss";

const denomOptions = [
  "1c",
  "2c",
  "5c",
  "10c",
  "25c",
  "1d",
  "5d",
  "10d",
  "25d",
  "50d",
  "100d",
  "250d",
  "500d",
  "1000d",
  "2000d",
  "5000d",
];

function DenomModal() {
  return (
    <div className="denom-modal">
      {denomOptions.map((denom) => (
        <div className="denom-option">
          <img src={`/assets/ui/denoms/${denom}.png`} />
        </div>
      ))}
    </div>
  );
}

export default DenomModal;
