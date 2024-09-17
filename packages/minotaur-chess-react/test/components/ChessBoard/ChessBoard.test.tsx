import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import ChessGame from "../ChessGame/ChessGame";

describe("ChessBoard", () => {
  it("should render", () => {
    const { asFragment } = render(<ChessGame />);
    expect(asFragment()).toMatchSnapshot();
  });
});
