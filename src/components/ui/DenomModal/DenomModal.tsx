import Button from "../Button/Button";
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

interface DenomModalProps {
  handleDenomClick: () => void;
}

function DenomModal({ handleDenomClick }: DenomModalProps) {
  function handleDenomSelection() {
    handleDenomChange();
    handleDenomClick();
  }
  return (
    <div className="denom-wrapper">
      <div className="denom-modal">
        <div>Choose denomination:</div>
        <div className="denom-options">
          {denomOptions.map((denom) => (
            <div className="denom-option">
              <img
                onClick={handleDenomClick}
                src={`/assets/ui/denoms/${denom}.png`}
              />
            </div>
          ))}
          <Button
            disabled={false}
            text="CLOSE"
            onButtonClick={handleDenomClick}
          />
        </div>
      </div>
    </div>
  );
}

export default DenomModal;
