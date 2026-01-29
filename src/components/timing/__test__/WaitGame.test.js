import WaitGame from "../WaitGame";
import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

//getByRole
test("render stopbtn when click on startBtn", () => {
  render(<WaitGame />);
  const startBtn = screen.getByRole("button", { name: /Start Game/i });

  fireEvent.click(startBtn);
  const stopBtn = screen.getByRole("button", { name: /End Game/i });
  expect(stopBtn).toBeInTheDocument();
});

test("correct class on result message component when click on stop", () => {
  render(<WaitGame />);
  const startBtn = screen.getByRole("button", { name: /Start Game/i });
  fireEvent.click(startBtn);

  const stopBtn = screen.getByRole("button", { name: /End Game/i });
  fireEvent.click(stopBtn);

  const resultMessage = screen.getByTestId("result");
  //screen.debug();
  expect(resultMessage).toHaveClass("result_wrapper show");
});
