import { DENOMINATIONS, type Denomination } from "../../../config/gameConfig";
import Button from "../Button/Button";
import "./DenomModal.scss";

interface DenomModalProps {
  handleDenomClick: () => void;
}

function DenomModal({ handleDenomClick }: DenomModalProps) {
  function handleDenomSelection(denominationValue: Denomination) {
    handleDenomChange(denominationValue);
    handleDenomClick();
  }
  return (
    <div className="denom-wrapper">
      <div className="denom-modal">
        <div>Choose denomination:</div>
        <div className="denom-options">
          {Object.entries(DENOMINATIONS).map(([denomValue, denomInfo]) => (
            <div className="denom-option">
              <img
                onClick={() => handleDenomSelection(denomValue as Denomination)}
                src={`/assets/ui/denoms/${denomInfo.image}`}
              />
            </div>
          ))}
        </div>
        <Button
          disabled={false}
          text="CLOSE"
          onButtonClick={handleDenomClick}
        />
      </div>
    </div>
  );
}

export default DenomModal;
