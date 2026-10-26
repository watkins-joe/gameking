import "./HandTitle.scss";

interface HandTitleProps {
  title: string; // HAND_TITLE
}

function HandTitle({ title }: HandTitleProps) {
  return (
    <div id="title" className="casino-font title">
      {title}
    </div>
  );
}

export default HandTitle;
