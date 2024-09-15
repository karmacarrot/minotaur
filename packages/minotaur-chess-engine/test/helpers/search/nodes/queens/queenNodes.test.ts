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
import { queenNodes } from "./queenNodes";

describe("queenNodes", () => {
  it("returns all legal white queen nodes after moving d pawn and queen", () => {
    const startingBoard = { ...StartingBoard };
    const newPositions = movePiece(startingBoard, "whitePawn", 2, "d", 4, "d");

    const startNode = StartingNode();
    startNode.boardState = newPositions.BoardState;
    const evalLogs = createEvalLogs();
    const potentialMoves = queenNodes(startNode, evalLogs);

    expect(potentialMoves.length).toBe(2);

    const secondPositions = movePiece(
      newPositions.BoardState,
      "whiteQueen",
      1,
      "d",
      3,
      "d"
    );

    startNode.boardState = secondPositions.BoardState;
    const secondQueenPositions = queenNodes(startNode, evalLogs);
    expect(secondQueenPositions.length).toBe(16);
  });

  it("returns all legal black queen nodes after moving d pawn and queen", () => {
    const startingBoard = { ...StartingBoard };
    const newPositions = movePiece(startingBoard, "blackPawn", 7, "d", 5, "d");

    const startNode = StartingNode();
    startNode.boardState = newPositions.BoardState;
    startNode.gameState.isWhitesTurn = false;
    const evalLogs = createEvalLogs();
    const potentialMoves = queenNodes(startNode, evalLogs);

    expect(potentialMoves.length).toBe(2);

    const secondPositions = movePiece(
      newPositions.BoardState,
      "blackQueen",
      8,
      "d",
      6,
      "d"
    );

    startNode.boardState = secondPositions.BoardState;
    const secondQueenPositions = queenNodes(startNode, evalLogs);
    expect(secondQueenPositions.length).toBe(16);
  });
});
