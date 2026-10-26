import "./HandTitle.scss";

interface HandTitleProps {
  title: string; // HAND_TITLE
}

function HandTitle({ title }: HandTitleProps) {
  return <div className="title casino-font">{title}</div>;
}

export default HandTitle;
