import React from "react";
import {
  BrowserRouter as Router,
} from "react-router-dom";
import { render, screen } from "../../../utils/test-utils";
import Menu from '../../Menu';

it("renders without crashing", () => {
  render(<Router><Menu /></Router>);

  expect(screen.getByText(/Logowanie/i)).toBeInTheDocument();
  expect(screen.getByText(/Rejestracja/i)).toBeInTheDocument();
});
