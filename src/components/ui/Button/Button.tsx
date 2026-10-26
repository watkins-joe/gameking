import "./Button.scss";

interface ButtonProps {
  disabled: boolean;
  text: string;
  onButtonClick: () => void;
}

function Button({ disabled, text, onButtonClick }: ButtonProps) {
  return (
    <button disabled={disabled} onClick={onButtonClick}>
      {text}
    </button>
  );
}

export default Button;
