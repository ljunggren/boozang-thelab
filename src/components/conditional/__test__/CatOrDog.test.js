import CatOrDog from "../CatOrDog";
import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

test("control CatOrDog heading", () => {
  render(<CatOrDog />);
  const heading = screen.getByText("Cat or Dog");
  expect(heading).toBeInTheDocument();
});

//getByRole
test("Check that output_section gets class show on click on btn", () => {
  render(<CatOrDog />);
  //screen.debug();
  const btn = screen.getByRole("button", { name: /Generate Image/i });
  const output = screen.getByTestId("output");
  fireEvent.click(btn);

  expect(output).toHaveClass("output_section show");
});
