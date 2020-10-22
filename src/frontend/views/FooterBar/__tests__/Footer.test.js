import React from "react";
import { render, screen } from "../../../Utils/test-utils";
import FooterBar from '../../FooterBar';

it("renders without crashing", () => {
  render(<FooterBar />);

  expect(
    screen.getByText(
      /FORMA Dietetyk Marta Fordas/i
    )
  ).toBeInTheDocument();
});
