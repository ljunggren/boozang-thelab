import YellowOrBlue from "../YellowOrBlue";
import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

test("control YellowOrBlue heading", () => {
  render(<YellowOrBlue />);
  const heading = screen.getByText("Yellow or Blue");
  expect(heading).toBeInTheDocument();
});

//getByRole
test("Check that output_section gets class show on click on btn", () => {
  render(<YellowOrBlue />);
  //screen.debug();
  const btn = screen.getByRole("button", { name: /Generate Color/i });
  const output = screen.getByTestId("output");
  fireEvent.click(btn);

  expect(output).toHaveClass("output_section show");
});
