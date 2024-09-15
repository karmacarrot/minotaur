/**
 * @jest-environment node
 */
import {
  createEvalLogs,
  outputSinglePiecePositions,
} from "../../../../../Logging/evaluationLogs";
import { movePiece } from "../../../../board";
import {
  allBlackPositions,
  allWhitePositions,
  bitCount,
} from "../../../bitboards";
import { StartingBoard } from "../../../definitions";
import { StartingNode } from "../nodeGenerators";
import { rookNodes } from "./rookNodes";

describe("rookNodes", () => {
  it("returns all legal white rook nodes after moving a pawn and a rook", () => {
    const startingBoard = { ...StartingBoard };
    const newPositions = movePiece(startingBoard, "whitePawn", 2, "a", 4, "a");

    const startNode = StartingNode();
    startNode.boardState = newPositions.BoardState;
    const evalLogs = createEvalLogs();
    const potentialMoves = rookNodes(startNode, evalLogs);

    expect(potentialMoves.length).toBe(2);

    const secondPositions = movePiece(
      newPositions.BoardState,
      "whiteRook",
      1,
      "a",
      3,
      "a"
    );

    startNode.boardState = secondPositions.BoardState;
    const secondRookPositions = rookNodes(startNode, evalLogs);
    expect(secondRookPositions.length).toBe(9);
  });

  it("returns all legal black rook nodes after moving d and e pawns", () => {
    const startingBoard = { ...StartingBoard };
    const newPositions = movePiece(startingBoard, "blackPawn", 7, "a", 5, "a");

    const startNode = StartingNode();
    startNode.boardState = newPositions.BoardState;
    startNode.gameState.isWhitesTurn = false;
    const evalLogs = createEvalLogs();
    const potentialMoves = rookNodes(startNode, evalLogs);

    expect(potentialMoves.length).toBe(2);

    const secondPositions = movePiece(
      newPositions.BoardState,
      "blackRook",
      8,
      "a",
      6,
      "a"
    );

    startNode.boardState = secondPositions.BoardState;
    const secondRookPositions = rookNodes(startNode, evalLogs);
    expect(secondRookPositions.length).toBe(9);
  });
});
