import { BETTING_OPTIONS, type BetAmount } from "../../../config/gameConfig";
import Button from "../Button/Button";
import "./Controls.scss";

interface ControlsProps {
  currentBet: BetAmount;
  canDeal: boolean;
  isRoundActive: boolean;
  isBetting: boolean;
  isResetConfirmationActive: boolean;
  canDraw: boolean;
  isDrawing: boolean;
  onBetChange: (bet: BetAmount) => void;
  onDeal: () => void;
  onDraw: () => void;
  onResetBalance: () => void;
}

function Controls({
  currentBet,
  canDeal,
  isRoundActive,
  isBetting,
  isResetConfirmationActive,
  canDraw,
  isDrawing,
  onBetChange,
  onDeal,
  onDraw,
  onResetBalance,
}: ControlsProps) {
  const currentBetIndex = BETTING_OPTIONS.indexOf(currentBet);
  const canChangeBet = !isRoundActive;

  return (
    <>
      <div className="controls--container">
        <div className="controls--column">
          <Button
            disabled={
              !canChangeBet || currentBetIndex === BETTING_OPTIONS.length - 1
            }
            text="BET UP"
            onButtonClick={() => {
              const nextBet = BETTING_OPTIONS[currentBetIndex + 1];
              if (nextBet !== undefined) onBetChange(nextBet);
            }}
          />
          <Button disabled text="MENU" onButtonClick={() => undefined} />
        </div>
        <div className="controls--column">
          <div className="bet">BET {currentBet}</div>
          <div className="denom">
            <img src="/assets/ui/denoms/25c.png" />
          </div>
        </div>
        <div className="controls--column">
          <Button
            disabled={
              !canChangeBet || currentBetIndex === BETTING_OPTIONS.length - 1
            }
            text="BET MAX"
            onButtonClick={() =>
              onBetChange(BETTING_OPTIONS[BETTING_OPTIONS.length - 1])
            }
          />
          <Button
            disabled={
              isDrawing ||
              isBetting ||
              (canDraw ? false : !canDeal || isRoundActive)
            }
            text={canDraw ? "DRAW" : "DEAL"}
            onButtonClick={canDraw ? onDraw : onDeal}
          />
        </div>
      </div>
      <div className="game-info">
        <button
          aria-label="Reset balance by clicking twice"
          className={`game-name${isResetConfirmationActive ? " confirming" : ""}`}
          disabled={isRoundActive}
          onClick={onResetBalance}
          type="button"
        >
          {isResetConfirmationActive ? "ARE YOU SURE?" : "DOUBLE DBL BONUS"}
        </button>
        <div>{canDraw ? "SELECT HOLDS" : "GAME OVER"}</div>
      </div>
    </>
  );
}

export default Controls;
