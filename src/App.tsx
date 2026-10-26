import { useState } from "react";
import { CreditMeter } from "./components/ui/CreditsCounter/CreditsCounter";

function App() {
  const [isCreditsMode, setIsCreditsMode] = useState(false);
  const [amount, setAmount] = useState(100.0);

  function toggleCreditsMode() {
    setIsCreditsMode((prevState) => !prevState);
  }

  return (
    <>
      <CreditMeter
        creditsMode={isCreditsMode}
        amount={amount}
        onModeChange={toggleCreditsMode}
      />
      <img src="/assets/cards/00.png" />
    </>
  );
}

export default App;
