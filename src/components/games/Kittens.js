const Kittens = ({ kittens, handleClick }) => {
  return (
    <div className="kittens">
      {kittens.map((kitten, index) => {
        return (
          <span
            key={index}
            className="kitten"
            role="button"
            tabIndex="0"
            aria-label="Catch kitten"
            style={{ top: kitten.top, left: kitten.left }}
            onClick={() => handleClick(kitten.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleClick(kitten.id);
              }
            }}
          >
            {kitten.icon}
          </span>
        );
      })}
    </div>
  );
};

export default Kittens;
