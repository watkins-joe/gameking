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
const BET_COLUMN_DELAY_MS = 180;
const BASE_PAYOUT_COUNT_UP_MS = 1200;
const EXTRA_PAYOUT_COUNT_UP_PER_HUNDRED_DOLLARS_MS = 500;
const MAX_PAYOUT_COUNT_UP_MS = 6700;

interface HandResult {
  rank: keyof typeof HAND_DISPLAY_NAMES;
  title: string;
  payoutCredits: number;
}

function Main() {
  const [isCreditsMode, setIsCreditsMode] = useState(false);
  const [currentBetIndex, setCurrentBetIndex] = useState(DEFAULT_BETTING_INDEX);
  const [balanceCents, setBalanceCents] = useState(STARTING_BALANCE_CENTS);
  const [displayBalanceCents, setDisplayBalanceCents] =
    useState(STARTING_BALANCE_CENTS);
  const [winCredits, setWinCredits] = useState(0);
  const [gameState, setGameState] = useState<GameState>(GAME_STATES.Game_Over);
  const [handState, setHandState] = useState<INITIAL_HAND_STATE_TYPE>(() =>
    INITIAL_HAND_STATE.map((card) => ({ ...card })),
  );
  const [handResult, setHandResult] = useState<HandResult | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isBetting, setIsBetting] = useState(false);
  const [activeBetColumn, setActiveBetColumn] = useState<BetAmount | null>(
    null,
  );
  const dealTimeoutRef = useRef<number | null>(null);
  const payoutAnimationFrameRef = useRef<number | null>(null);
  const [isCountingPayout, setIsCountingPayout] = useState(false);

  const currentBet = BETTING_OPTIONS[currentBetIndex];
  const betCostCents = currentBet * CREDIT_VALUE_CENTS;
  const canAffordBet = balanceCents >= betCostCents;

  useEffect(
    () => () => {
      if (dealTimeoutRef.current !== null) {
        window.clearTimeout(dealTimeoutRef.current);
      }
      if (payoutAnimationFrameRef.current !== null) {
        cancelAnimationFrame(payoutAnimationFrameRef.current);
      }
    },
    [],
  );

  function changeBet(amount: BetAmount) {
    if (
      gameState !== GAME_STATES.Game_Over ||
      isDrawing ||
      isBetting ||
      isCountingPayout
    ) {
      return;
    }
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
    if (
      gameState !== GAME_STATES.Game_Over ||
      isDrawing ||
      isBetting ||
      isCountingPayout ||
      !canAffordBet
    ) {
      return;
    }

    setBalanceCents((balance) => balance - betCostCents);
    setDisplayBalanceCents((balance) => balance - betCostCents);
    setWinCredits(0);
    setHandResult(null);
    setGameState(GAME_STATES.Game_Over);
    setHandState(INITIAL_HAND_STATE.map((card) => ({ ...card })));

    setActiveBetColumn(null);
    setIsBetting(true);

    const dealCards = () => {
      setIsBetting(false);
      const dealtCards = shuffle(CARDS)
        .slice(0, INITIAL_HAND_STATE.length)
        .map((cardId) => ({ cardId, isHeld: false }));

      showCards(dealtCards, () => {
        setGameState(GAME_STATES.Awaiting_Holds);
      });
    };

    const highlightBetColumn = (bet: BetAmount) => {
      setActiveBetColumn(bet);
      dealTimeoutRef.current = window.setTimeout(() => {
        if (bet === currentBet) {
          dealCards();
        } else {
          const nextBet = BETTING_OPTIONS[BETTING_OPTIONS.indexOf(bet) + 1];
          if (nextBet === undefined) {
            dealCards();
          } else {
            highlightBetColumn(nextBet);
          }
        }
      }, BET_COLUMN_DELAY_MS);
    };

    highlightBetColumn(BETTING_OPTIONS[0]);
  }

  function handleDraw() {
    if (
      gameState !== GAME_STATES.Awaiting_Holds ||
      isDrawing ||
      isCountingPayout
    ) {
      return;
    }

    const dealtCardIds = new Set(
      handState.flatMap((card) =>
        card.cardId === null ? [] : [card.cardId],
      ),
    );
    const replacementCards = shuffle(
      CARDS.filter((cardId) => !dealtCardIds.has(cardId)),
    );
    const finalHand = handState.map((card) =>
      card.isHeld
        ? { ...card }
        : { cardId: replacementCards.pop() ?? null, isHeld: false },
    );

    setHandResult(null);
    setWinCredits(0);
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
              rank,
              title: HAND_DISPLAY_NAMES[rank],
              payoutCredits: PAYOUTS_PER_BET[currentBet][rank],
            };
      const payoutCents = (result?.payoutCredits ?? 0) * CREDIT_VALUE_CENTS;

      setHandResult(result);
      setBalanceCents((balance) => balance + payoutCents);
      setGameState(GAME_STATES.Game_Over);

      if (!result || payoutCents === 0) {
        setWinCredits(0);
        setIsCountingPayout(false);
        return;
      }

      const startingBalanceCents = displayBalanceCents;
      const startTime = performance.now();
      const duration = Math.min(
        MAX_PAYOUT_COUNT_UP_MS,
        BASE_PAYOUT_COUNT_UP_MS +
          (payoutCents / 10_000) *
            EXTRA_PAYOUT_COUNT_UP_PER_HUNDRED_DOLLARS_MS,
      );
      setIsCountingPayout(true);

      const countUp = (currentTime: number) => {
        const progress = Math.min(
          (currentTime - startTime) / duration,
          1,
        );
        setDisplayBalanceCents(
          Math.round(startingBalanceCents + payoutCents * progress),
        );
        setWinCredits(Math.round(result.payoutCredits * progress));

        if (progress < 1) {
          payoutAnimationFrameRef.current = requestAnimationFrame(countUp);
        } else {
          payoutAnimationFrameRef.current = null;
          setDisplayBalanceCents(startingBalanceCents + payoutCents);
          setWinCredits(result.payoutCredits);
          setIsCountingPayout(false);
        }
      };

      payoutAnimationFrameRef.current = requestAnimationFrame(countUp);
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

  const isRoundActive =
    gameState === GAME_STATES.Awaiting_Holds ||
    isDrawing ||
    isBetting ||
    isCountingPayout;

  return (
    <div className="main-container">
      <Paytable
        activeBet={activeBetColumn}
        winningHand={handResult?.rank ?? null}
      />
      <HandTitle title={handResult?.title ?? ""} />
      <InteractiveHand
        gameState={gameState}
        handState={[handState]}
        isDrawing={isDrawing}
        onCardClick={handleCardClick}
      />
      <div id="meters">
        <WinMeter winCredits={winCredits} />
        <CreditMeter
          creditsMode={isCreditsMode}
          amount={displayBalanceCents / 100}
          onModeChange={toggleCreditsMode}
        />
      </div>
      <Controls
        currentBet={currentBet}
        canDeal={canAffordBet}
        isRoundActive={isRoundActive}
        isBetting={isBetting}
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
