/**
 * @jest-environment node
 */
import { GameNode } from "../../../types";
import { InitialGameStatus, StartingBoard } from "../../definitions";
import { generateLegalMoves, generateNodeId } from "./nodeGenerators";

describe("generateLegalMoves", () => {
  it("generates the correct possible starting moves for white", () => {
    const startBoard = { ...StartingBoard };
    const startStatus = { ...InitialGameStatus };
    const currentNode: GameNode = {
      boardState: startBoard,
      gameState: startStatus,
      id: generateNodeId(),
      parentId: "",
    };
    const possibleMoves = generateLegalMoves(currentNode);
    expect(possibleMoves.length).toBe(20);
  });
});

describe("generateNodeId", () => {
  it("returns a string of 36 characters that are different each time", () => {
    const idOne = generateNodeId();
    const idTwo = generateNodeId();

    expect(idOne.length).toBe(36);
    expect(idOne === idTwo).toBeFalsy;
  });
});
