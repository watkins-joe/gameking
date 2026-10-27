import { evaluateDeucesWildHand } from "../utils/evaluateDeucesWildHand";
import { evaluateHand } from "../utils/evaluateHands";
import {
  DEUCES_WILD_HAND_DISPLAY_NAMES,
  DEUCES_WILD_PAYOUTS_PER_BET,
} from "./deucesWildConfig";
import {
  HAND_DISPLAY_NAMES,
  PAYOUTS_PER_BET,
  type BetAmount,
} from "./gameConfig";

export type GameId = "double-double-bonus" | "deuces-wild-double-bonus";
export type HandRank = string;
export type GamePayoutTable = Record<
  BetAmount,
  Readonly<Record<HandRank, number>>
>;

export interface GameDefinition {
  id: GameId;
  name: string;
  image: string;
  handNames: Readonly<Record<HandRank, string>>;
  payoutsPerBet: GamePayoutTable;
  evaluateHand: (cardIds: readonly number[]) => HandRank;
}

export const DEFAULT_GAME_ID: GameId = "double-double-bonus";

export const GAMES: Record<GameId, GameDefinition> = {
  "double-double-bonus": {
    id: "double-double-bonus",
    name: "DOUBLE DBL BONUS",
    image: "DDB.png",
    handNames: HAND_DISPLAY_NAMES,
    payoutsPerBet: PAYOUTS_PER_BET,
    evaluateHand,
  },
  "deuces-wild-double-bonus": {
    id: "deuces-wild-double-bonus",
    name: "DEUCES WILD DOUBLE BONUS",
    image: "DWDB.png",
    handNames: DEUCES_WILD_HAND_DISPLAY_NAMES,
    payoutsPerBet: DEUCES_WILD_PAYOUTS_PER_BET,
    evaluateHand: evaluateDeucesWildHand,
  },
};
