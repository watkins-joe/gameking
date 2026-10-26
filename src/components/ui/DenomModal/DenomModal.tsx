import { DENOMINATIONS, type Denomination } from "../../../config/gameConfig";
import Button from "../Button/Button";
import "./DenomModal.scss";

interface DenomModalProps {
  selectedDenomination: Denomination;
  onClose: () => void;
  onDenominationChange: (denomination: Denomination) => void;
}

function DenomModal({
  selectedDenomination,
  onClose,
  onDenominationChange,
}: DenomModalProps) {
  function handleDenomSelection(denominationValue: Denomination) {
    onDenominationChange(denominationValue);
    onClose();
  }

  return (
    <div className="denom-wrapper">
      <div className="denom-modal" role="dialog" aria-modal="true" aria-label="Choose denomination">
        <div>Choose denomination:</div>
        <div className="denom-options">
          {Object.entries(DENOMINATIONS).map(([denomValue, denomInfo]) => {
            const denomination = denomValue as Denomination;
            return (
              <button
                aria-label={`Set denomination to ${denomValue}`}
                aria-pressed={selectedDenomination === denomination}
                className={`denom-option${
                  selectedDenomination === denomination ? " is-selected" : ""
                }`}
                key={denomValue}
                onClick={() => handleDenomSelection(denomination)}
                type="button"
              >
                <img
                  alt={denomValue}
                  src={`/assets/ui/denoms/${denomInfo.image}`}
                />
              </button>
            );
          })}
        </div>
        <Button disabled={false} text="CLOSE" onButtonClick={onClose} />
      </div>
    </div>
  );
}

export default DenomModal;
