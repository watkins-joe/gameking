import { useState } from "react";
import Controls from "../Controls/Controls";
import { CreditMeter } from "../CreditsCounter/CreditsCounter";
import Hand from "../Hand/Hand";
import HandTitle from "../HandTitle/HandTitle";
import Paytable from "../Paytable/Paytable";
import WinMeter from "../WinMeter/WinMeter";
import "./Main.scss";

function Main() {
  const [isCreditsMode, setIsCreditsMode] = useState(false);
  const [amount, setAmount] = useState(100.0);

  function toggleCreditsMode() {
    setIsCreditsMode((prevState) => !prevState);
  }
  return (
    <div>
      <Paytable />
      <HandTitle title={"4 ACES WITH ANY 2,3,4"} />
      <Hand />
      <WinMeter />
      <CreditMeter
        creditsMode={isCreditsMode}
        amount={amount}
        onModeChange={toggleCreditsMode}
      />
      <Controls />
    </div>
  );
}

export default Main;
