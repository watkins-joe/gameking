import Button from "../Button/Button";
import "./Controls.scss";

function Controls() {
  return (
    <>
      <div className="bet">BET 5</div>
      <div className="controls--container">
        <div className="controls--column">
          <Button
            disabled={false}
            text="BET UP"
            onButtonClick={() => console.log("hi")}
          />
          <Button
            disabled={false}
            text="MENU"
            onButtonClick={() => console.log("hi")}
          />
        </div>
        <div className="controls--column">
          <div className="denom">
            <img src="/assets/ui/denoms/25c.png" />
          </div>
          <Button
            disabled={false}
            text="..."
            onButtonClick={() => console.log("hi")}
          />
        </div>
        <div className="controls--column">
          <Button
            disabled={false}
            text="BET MAX"
            onButtonClick={() => console.log("hi")}
          />
          <Button
            disabled={false}
            text="DEAL"
            onButtonClick={() => console.log("hi")}
          />
        </div>
      </div>
      <div className="game-info">
        <div>DOUBLE DBL BONUS</div>
        <div>GAME OVER</div>
      </div>
    </>
  );
}

export default Controls;
