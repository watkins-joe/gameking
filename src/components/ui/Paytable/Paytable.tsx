import {
  BETTING_OPTIONS,
  HAND_DISPLAY_NAMES,
  PAYOUTS_PER_BET,
  type BetAmount,
} from "../../../config/gameConfig";
import "./Paytable.scss";

type PayoutHand = keyof typeof HAND_DISPLAY_NAMES;

const PAYOUT_HANDS = Object.keys(HAND_DISPLAY_NAMES) as PayoutHand[];

interface PaytableProps {
  activeBet: BetAmount | null;
  winningHand: PayoutHand | null;
}

function Paytable({ activeBet, winningHand }: PaytableProps) {
  return (
    <div className="paytable">
      <div className="paytable-columns">
        <div className="paytable-column paytable-hands">
          {PAYOUT_HANDS.map((hand) => (
            <div className="paytable-hand" key={hand}>
              <span className={winningHand === hand ? "is-winning" : ""}>
                {HAND_DISPLAY_NAMES[hand]}
              </span>
              <span className="paytable-leader" aria-hidden="true" />
            </div>
          ))}
        </div>
        {BETTING_OPTIONS.map((bet) => (
          <div
            className={`paytable-column${activeBet === bet ? " is-active-bet" : ""}`}
            key={bet}
          >
            {PAYOUT_HANDS.map((hand) => (
              <div
                className={`paytable-payout${
                  winningHand === hand && activeBet === bet
                    ? " is-winning"
                    : ""
                }`}
                key={hand}
              >
                {PAYOUTS_PER_BET[bet][hand]}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Paytable;
