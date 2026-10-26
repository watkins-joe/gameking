import { useState } from "react";
import { CreditMeter } from "../CreditsCounter/CreditsCounter";
import Paytable from "../Paytable/Paytable";
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
      <CreditMeter
        creditsMode={isCreditsMode}
        amount={amount}
        onModeChange={toggleCreditsMode}
      />
      {/* <img src="/assets/cards/00.png" /> */}
    </div>
  );
}

export default Main;
