import React from "react";
import { render, screen } from "../../../utils/test-utils";
import Footer from '../../Footer';

it("renders without crashing", () => {
  render(<Footer />);

  expect(
    screen.getByText(
      /FORMA Dietetyk Marta Fordas/i
    )
  ).toBeInTheDocument();
});
