import { useState } from "react";
import Controls from "../Controls/Controls";
import { CreditMeter } from "../CreditsCounter/CreditsCounter";
import HandTitle from "../HandTitle/HandTitle";
import Hand from "../InteractiveHand/InteractiveHand";
import Paytable from "../Paytable/Paytable";
import WinMeter from "../WinMeter/WinMeter";
import "./Main.scss";

function Main() {
  const [isCreditsMode, setIsCreditsMode] = useState(false);
  const [amount, setAmount] = useState(100.0);
  const [handState, setHandState] = function toggleCreditsMode() {
    setIsCreditsMode((prevState) => !prevState);
  };
  return (
    <div className="main-container">
      <Paytable />
      <HandTitle title={"4 ACES WITH ANY 2,3,4"} />
      <Hand />
      <div id="meters">
        <WinMeter />
        <CreditMeter
          creditsMode={isCreditsMode}
          amount={amount}
          onModeChange={toggleCreditsMode}
        />
      </div>
      <Controls />
    </div>
  );
}

export default Main;
