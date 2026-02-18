const Hedgehogs = ({ hedgehogs, handleClick }) => {
  return (
    <div className="hedgehogs">
      {hedgehogs.map((hedgehog) => {
        return (
          <span
            key={hedgehog.id}
            className="hedgehog"
            role="button"
            tabIndex="0"
            aria-label="Catch hedgehog"
            style={{ top: hedgehog.top, left: hedgehog.left }}
            onClick={handleClick}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleClick(e);
              }
            }}
          >
            {hedgehog.icon}
          </span>
        );
      })}
    </div>
  );
};

export default Hedgehogs;
