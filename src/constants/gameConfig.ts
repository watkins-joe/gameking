export const HAND_TYPES = Object.freeze({
  ROYAL_FLUSH: "royal_flush",
  STRAIGHT_FLUSH: "straight_flush",
  FOUR_ACES_WITH_ANY_TWO_THREE_FOUR: "four_aces_with_any_two_three_four",
  FOUR_TWOS_THREE_FOURS_WITH_ACE_TWO_THREE_FOUR:
    "four_twos_threes_fours_with_ace_two_three_four",
  FOUR_ACES: "four_aces",
  FOUR_TWOS_THREE_FOURS: "four_twos_threes_fours",
  FOUR_FIVES_THRU_KINGS: "four_fives_thru_kings",
  FULL_HOUSE: "full_house",
  FLUSH: "flush",
  STRAIGHT: "straight",
  THREE_OF_A_KIND: "three_of_a_kind",
  TWO_PAIR: "two_pair",
  JACKS_OR_BETTER: "jacks_or_better",
  HIGH_CARD: "high_card", // Losing hand
});

export const HAND_DISPLAY_NAMES = {
  [HAND_TYPES.ROYAL_FLUSH]: "ROYAL FLUSH",
  [HAND_TYPES.STRAIGHT_FLUSH]: "STRAIGHT FLUSH",
  [HAND_TYPES.FOUR_ACES_WITH_ANY_TWO_THREE_FOUR]: "4 ACES WITH ANY 2,3,4",
  [HAND_TYPES.FOUR_TWOS_THREE_FOURS_WITH_ACE_TWO_THREE_FOUR]:
    "4 2s, 3s, 4s W/ ACE,2,3,4",
  [HAND_TYPES.FOUR_ACES]: "4 ACES",
  [HAND_TYPES.FOUR_TWOS_THREE_FOURS]: "4 2s, 3s, 4s",
  [HAND_TYPES.FOUR_FIVES_THRU_KINGS]: "4 5s THRU KINGS",
  [HAND_TYPES.FULL_HOUSE]: "FULL HOUSE",
  [HAND_TYPES.FLUSH]: "FLUSH",
  [HAND_TYPES.STRAIGHT]: "STRAIGHT",
  [HAND_TYPES.THREE_OF_A_KIND]: "3 OF A KIND",
  [HAND_TYPES.TWO_PAIR]: "TWO PAIR",
  [HAND_TYPES.JACKS_OR_BETTER]: "JACKS OR BETTER",
};

interface CardState {
  cardId: number | null;
  isHeld: boolean;
}

export type INITIAL_HAND_STATE_TYPE = CardState[];

export const INITIAL_HAND_STATE: CardState[] = [
  { cardId: null, isHeld: false },
  { cardId: null, isHeld: false },
  { cardId: null, isHeld: false },
  { cardId: null, isHeld: false },
  { cardId: null, isHeld: false },
];
