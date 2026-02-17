import "./_layout.scss";

const Backdrop = ({ handleClick }) => {
  return (
    <div
      className="backdrop"
      role="button"
      tabIndex="0"
      aria-label="Close"
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
    />
  );
};

export default Backdrop;
