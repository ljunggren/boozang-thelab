import ConcatStrings from "../ConcatStrings";
import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

test("Control ConcatStrings heading", () => {
  render(<ConcatStrings />);
  const heading = screen.getByText("Concatenate Strings");
  //screen.debug();
  expect(heading).toBeInTheDocument();
});

test("Check that output_section gets class show on click on Generate-btn", () => {
  render(<ConcatStrings />);
  const btn = screen.getByRole("button", { name: /Generate strings/i });
  const output = screen.getByTestId("output");
  fireEvent.click(btn);

  expect(output).toHaveClass("output_section show");
});

test("Check that result_wrapper gets class show on click on submit-btn", () => {
  render(<ConcatStrings />);
  const btn = screen.getByRole("button", { name: /submit/i });
  const result = screen.getByTestId("result");
  fireEvent.click(btn);

  expect(result).toHaveClass("result_wrapper show");
});
