import { useEffect, useRef, useState } from "react";
import {
  BETTING_OPTIONS,
  DEFAULT_BETTING_INDEX,
  GAME_STATES,
  HAND_DISPLAY_NAMES,
  HAND_TYPES,
  PAYOUTS_PER_BET,
  type BetAmount,
  type GameState,
} from "../../../config/gameConfig";
import {
  INITIAL_HAND_STATE,
  type INITIAL_HAND_STATE_TYPE,
} from "../../../config/hands";
import { CARDS, shuffle } from "../../../utils/cards";
import { evaluateHand } from "../../../utils/evaluateHands";
import Controls from "../Controls/Controls";
import { CreditMeter } from "../CreditsCounter/CreditsCounter";
import HandTitle from "../HandTitle/HandTitle";
import InteractiveHand from "../InteractiveHand/InteractiveHand";
import Paytable from "../Paytable/Paytable";
import WinMeter from "../WinMeter/WinMeter";
import "./Main.scss";

const CREDIT_VALUE_CENTS = 25;
const STARTING_BALANCE_CENTS = 10_000;
const DEAL_CARD_DELAY_MS = 120;

interface HandResult {
  title: string;
  payoutCredits: number;
}

function Main() {
  const [isCreditsMode, setIsCreditsMode] = useState(false);
  const [currentBetIndex, setCurrentBetIndex] = useState(DEFAULT_BETTING_INDEX);
  const [balanceCents, setBalanceCents] = useState(STARTING_BALANCE_CENTS);
  const [winCents, setWinCents] = useState(0);
  const [gameState, setGameState] = useState<GameState>(GAME_STATES.Game_Over);
  const [handState, setHandState] = useState<INITIAL_HAND_STATE_TYPE>(() =>
    INITIAL_HAND_STATE.map((card) => ({ ...card })),
  );
  const [handResult, setHandResult] = useState<HandResult | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const dealTimeoutRef = useRef<number | null>(null);

  const currentBet = BETTING_OPTIONS[currentBetIndex];
  const betCostCents = currentBet * CREDIT_VALUE_CENTS;
  const canAffordBet = balanceCents >= betCostCents;

  useEffect(
    () => () => {
      if (dealTimeoutRef.current !== null) {
        window.clearTimeout(dealTimeoutRef.current);
      }
    },
    [],
  );

  function changeBet(amount: BetAmount) {
    if (gameState !== GAME_STATES.Game_Over || isDrawing) return;
    const index = BETTING_OPTIONS.indexOf(amount);
    if (index >= 0) setCurrentBetIndex(index);
  }

  function toggleCreditsMode() {
    setIsCreditsMode((previous) => !previous);
  }

  function showCards(
    cards: INITIAL_HAND_STATE_TYPE,
    onComplete: (finalCards: INITIAL_HAND_STATE_TYPE) => void,
  ) {
    const hiddenCards = cards.map((card) =>
      card.isHeld ? { ...card } : { cardId: null, isHeld: false },
    );
    const cardsToReveal = cards.flatMap((card, index) =>
      card.isHeld ? [] : [index],
    );

    setHandState(hiddenCards);
    setIsDrawing(true);

    let revealIndex = 0;
    const revealNext = () => {
      const cardIndex = cardsToReveal[revealIndex];
      if (cardIndex === undefined) {
        dealTimeoutRef.current = null;
        setIsDrawing(false);
        onComplete(cards);
        return;
      }

      setHandState((current) =>
        current.map((card, index) =>
          index === cardIndex ? { ...cards[cardIndex] } : card,
        ),
      );
      revealIndex += 1;
      dealTimeoutRef.current = window.setTimeout(
        revealNext,
        DEAL_CARD_DELAY_MS,
      );
    };

    revealNext();
  }

  function handleDeal() {
    if (gameState !== GAME_STATES.Game_Over || isDrawing || !canAffordBet) {
      return;
    }

    setBalanceCents((balance) => balance - betCostCents);
    setWinCents(0);
    setHandResult(null);
    setGameState(GAME_STATES.Game_Over);

    const dealtCards = shuffle(CARDS)
      .slice(0, INITIAL_HAND_STATE.length)
      .map((cardId) => ({ cardId, isHeld: false }));

    showCards(dealtCards, () => {
      setGameState(GAME_STATES.Awaiting_Holds);
    });
  }

  function handleDraw() {
    if (gameState !== GAME_STATES.Awaiting_Holds || isDrawing) return;

    const heldCardIds = new Set(
      handState.flatMap((card) =>
        card.isHeld && card.cardId !== null ? [card.cardId] : [],
      ),
    );
    const replacementCards = shuffle(
      CARDS.filter((cardId) => !heldCardIds.has(cardId)),
    );
    const finalHand = handState.map((card) =>
      card.isHeld
        ? { ...card }
        : { cardId: replacementCards.pop() ?? null, isHeld: false },
    );

    setHandResult(null);
    setWinCents(0);
    showCards(finalHand, (drawnCards) => {
      const cardIds = drawnCards.flatMap((card) =>
        card.cardId === null ? [] : [card.cardId],
      );
      const rank =
        cardIds.length === INITIAL_HAND_STATE.length
          ? evaluateHand(cardIds)
          : HAND_TYPES.HIGH_CARD;
      const result =
        rank === HAND_TYPES.HIGH_CARD
          ? null
          : {
              title: HAND_DISPLAY_NAMES[rank],
              payoutCredits: PAYOUTS_PER_BET[currentBet][rank],
            };
      const payoutCents = (result?.payoutCredits ?? 0) * CREDIT_VALUE_CENTS;

      setHandResult(result);
      setWinCents(payoutCents);
      setBalanceCents((balance) => balance + payoutCents);
      setGameState(GAME_STATES.Game_Over);
    });
  }

  function handleCardClick(positionIndex: number) {
    if (gameState !== GAME_STATES.Awaiting_Holds || isDrawing) return;
    setHandState((cards) =>
      cards.map((card, index) =>
        index === positionIndex ? { ...card, isHeld: !card.isHeld } : card,
      ),
    );
  }

  const isRoundActive = gameState === GAME_STATES.Awaiting_Holds || isDrawing;

  return (
    <div className="main-container">
      <Paytable />
      <HandTitle title={handResult?.title ?? ""} />
      <InteractiveHand
        gameState={gameState}
        handState={[handState]}
        isDrawing={isDrawing}
        onCardClick={handleCardClick}
      />
      <div id="meters">
        <WinMeter winAmount={winCents / 100} />
        <CreditMeter
          creditsMode={isCreditsMode}
          amount={balanceCents / 100}
          onModeChange={toggleCreditsMode}
        />
      </div>
      <Controls
        currentBet={currentBet}
        canDeal={canAffordBet}
        isRoundActive={isRoundActive}
        canDraw={gameState === GAME_STATES.Awaiting_Holds}
        isDrawing={isDrawing}
        onBetChange={changeBet}
        onDeal={handleDeal}
        onDraw={handleDraw}
      />
    </div>
  );
}

export default Main;
