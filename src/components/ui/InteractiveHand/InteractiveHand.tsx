import {
  useEffect,
  useRef,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { GAME_STATES, type GameState } from "../../../config/gameConfig";
import type { INITIAL_HAND_STATE_TYPE } from "../../../config/hands";
import HoldSelectionGesture from "../../../utils/HoldSelectionGesture";
import "./InteractiveHand.scss";

interface InteractiveHandProps {
  gameState: GameState;
  handState: INITIAL_HAND_STATE_TYPE[];
  isDrawing: boolean;
  onCardClick: (positionIndex: number) => void;
}

function InteractiveHand({
  gameState,
  handState,
  isDrawing,
  onCardClick,
}: InteractiveHandProps) {
  const holdGestureRef = useRef(new HoldSelectionGesture());

  useEffect(() => {
    function stopSelecting(event: PointerEvent) {
      holdGestureRef.current.end(event.pointerId);
    }

    window.addEventListener("pointerup", stopSelecting);
    window.addEventListener("pointercancel", stopSelecting);
    return () => {
      window.removeEventListener("pointerup", stopSelecting);
      window.removeEventListener("pointercancel", stopSelecting);
    };
  }, []);

  function selectCard(index: number) {
    if (gameState !== GAME_STATES.Awaiting_Holds || isDrawing) return;

    onCardClick(index);
  }

  function handleCardPointerDown(
    index: number,
    event: ReactPointerEvent<HTMLImageElement>,
  ) {
    if (
      !event.isPrimary ||
      (event.pointerType === "mouse" && event.button !== 0) ||
      gameState !== GAME_STATES.Awaiting_Holds ||
      isDrawing
    ) {
      return;
    }

    event.preventDefault();
    const cardIndex = holdGestureRef.current.begin(event.pointerId, index);
    selectCard(cardIndex);
  }

  function handleCardPointerEnter(
    index: number,
    event: ReactPointerEvent<HTMLImageElement>,
  ) {
    if (holdGestureRef.current.visit(event.pointerId, index) === null) {
      return;
    }

    selectCard(index);
  }

  return (
    <div
      className={`cards ${
        gameState === GAME_STATES.Awaiting_Holds ? "is-holding" : ""
      }`}
    >
      {handState[0].map((card, index) => (
        <div className="card-container" key={index}>
          <img
            src={
              card.cardId === null
                ? "/assets/cards/back.png"
                : `/assets/cards/${String(card.cardId).padStart(2, "0")}.png`
            }
            alt={card.cardId === null ? "Card Back" : "Card Face"}
            draggable={false}
            onPointerDown={(event) => handleCardPointerDown(index, event)}
            onPointerEnter={(event) => handleCardPointerEnter(index, event)}
          />
          {card.isHeld && card.cardId !== null && (
            <div className="hold-badge">HELD</div>
          )}
        </div>
      ))}
    </div>
  );
}

export default InteractiveHand;
