import React from "react";
import { render, screen } from "../../../utils/test-utils";
import HomePage from '../../Homepage';

it("renders without crashing", () => {

  render(<HomePage />);

  expect(
    screen.getByText(
      /ZAKUPY/i
    )
  ).toBeInTheDocument();
});
