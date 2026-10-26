import {
  BETTING_OPTIONS,
  HAND_DISPLAY_NAMES,
  PAYOUTS_PER_BET,
} from "../../../constants/gameConfig";
import "./Paytable.scss";

type PayoutHand = keyof typeof HAND_DISPLAY_NAMES;

const PAYOUT_HANDS = Object.keys(HAND_DISPLAY_NAMES) as PayoutHand[];

function Paytable() {
  return (
    <div className="paytable">
      {PAYOUT_HANDS.map((hand) => (
        <div className="paytable-row" key={hand}>
          <div className="paytable-hand">
            <span>{HAND_DISPLAY_NAMES[hand]}</span>
            <span className="paytable-leader" aria-hidden="true" />
          </div>
          {BETTING_OPTIONS.map((bet) => (
            <div key={bet}>{PAYOUTS_PER_BET[bet][hand]}</div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default Paytable;
