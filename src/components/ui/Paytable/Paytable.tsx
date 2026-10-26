import { HAND_DISPLAY_NAMES } from "../../../constants/gameConfig";
import "./Paytable.scss";

type PayoutHand = keyof typeof HAND_DISPLAY_NAMES;

const PAYOUT_HANDS = Object.keys(HAND_DISPLAY_NAMES) as PayoutHand[];

function Paytable() {
  return (
    <div className="paytable">
      <div className="hands">
        {PAYOUT_HANDS.map((hand) => (
          <div>{HAND_DISPLAY_NAMES[hand]}</div>
        ))}
      </div>
      <div></div>
    </div>
  );
}

export default Paytable;
