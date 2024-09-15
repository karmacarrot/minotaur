/**
 * @jest-environment node
 */
import { LoggerConfig } from "../../../../../../logger.config";
import {
  createEvalLogs,
  outputEvalLogsHtml,
} from "../../../../../Logging/evaluationLogs";
import { DuellingPawnsBoard } from "../../../../referee/mockBoardStates";
import { allPositions, applyMove, bitCount } from "../../../bitboards";
import {
  EmptyBoard,
  InitialGameStatus,
  StartingBoard,
} from "../../../definitions";
import { generateNodeId } from "../nodeGenerators";
import {
  blackPawnNodes,
  blackPawnTwoSquareNodes,
  whitePawnNodes,
} from "./pawnNodes";

describe("whitePawnNodes", () => {
  it("returns 16 possible nodes from a starting board", () => {
    const startBoard = { ...StartingBoard };
    const startStatus = { ...InitialGameStatus };
    const currentNode = {
      boardState: startBoard,
      gameState: startStatus,
      parentId: "",
      id: generateNodeId(),
    };

    const whitePawnNodeArray = whitePawnNodes(currentNode);
    expect(whitePawnNodeArray.length).toBe(16);
  });

  it("returns 14 possible white nodes from duelling pawns board", () => {
    const duellingBoard = { ...DuellingPawnsBoard };
    const startStatus = { ...InitialGameStatus };
    const currentNode = {
      boardState: duellingBoard,
      gameState: startStatus,
      parentId: "",
      id: generateNodeId(),
    };

    const whitePawnNodeArray = whitePawnNodes(currentNode);
    expect(whitePawnNodeArray.length).toBe(14);
    for (let pawnNode of whitePawnNodeArray) {
      const countBlackPawns = bitCount(pawnNode.boardState.blackPawn);
      const countWhitePawns = bitCount(pawnNode.boardState.whitePawn);
      expect(countBlackPawns).toBeLessThan(countWhitePawns);
    }
  });

  it("returns 16 possible nodes for black pawns from a starting row", () => {
    const startBoard = { ...EmptyBoard };
    startBoard.blackPawn = StartingBoard.blackPawn;
    const startStatus = { ...InitialGameStatus };
    const currentNode = {
      boardState: startBoard,
      gameState: startStatus,
      parentId: "",
      id: generateNodeId(),
    };

    const blackPawnNodeArray = blackPawnNodes(currentNode);
    expect(blackPawnNodeArray.length).toBe(16);
  });

  it("returns 16 possible nodes for black pawns from a starting row after white d4", () => {
    const startBoard = { ...StartingBoard };
    const startStatus = { ...InitialGameStatus };

    const newBoard = applyMove(startBoard, 12, 28, "whitePawn");
    startStatus.isWhitesTurn = false;

    const currentNode = {
      boardState: newBoard,
      gameState: startStatus,
      parentId: "",
      id: generateNodeId(),
    };

    const blackPawnNodeArray = blackPawnNodes(currentNode);
    expect(blackPawnNodeArray.length).toBe(16);
  });

  it("returns 14 possible black pawn nodes from duelling pawns board", () => {
    const duellingBoard = { ...DuellingPawnsBoard };
    const startStatus = { ...InitialGameStatus };
    const currentNode = {
      boardState: duellingBoard,
      gameState: startStatus,
      parentId: "",
      id: generateNodeId(),
    };

    const blackPawnNodeArray = blackPawnNodes(currentNode);
    expect(blackPawnNodeArray.length).toBe(14);
    for (let pawnNode of blackPawnNodeArray) {
      const countBlackPawns = bitCount(pawnNode.boardState.blackPawn);
      const countWhitePawns = bitCount(pawnNode.boardState.whitePawn);
      expect(countWhitePawns).toBeLessThan(countBlackPawns);
    }
  });
});

describe("blackPawnTwoSquareNodes", () => {
  it("returns 8 possible 2 step moves from white d4 opening", () => {
    const startBoard = { ...StartingBoard };
    const startStatus = { ...InitialGameStatus };

    const newBoard = applyMove(startBoard, 12, 28, "whitePawn");
    startStatus.isWhitesTurn = false;

    const currentNode = {
      boardState: newBoard,
      gameState: startStatus,
      parentId: "",
      id: generateNodeId(),
    };

    const allOccupiedPositions = allPositions(currentNode.boardState);

    const blackPawnNodeArray = blackPawnTwoSquareNodes(
      currentNode,
      allOccupiedPositions
    );
    expect(blackPawnNodeArray.length).toBe(8);
  });

  it("cannot move onto occupied squares in the same file", () => {
    const startBoard = { ...StartingBoard };
    const startStatus = { ...InitialGameStatus };
    const evalLogs = createEvalLogs();
    const firstMove = applyMove(startBoard, 10, 26, "whitePawn");
    const secondMove = applyMove(firstMove, 53, 37, "blackPawn");
    const thirdMove = applyMove(secondMove, 26, 34, "whitePawn");
    startStatus.isWhitesTurn = false;

    const currentNode = {
      boardState: thirdMove,
      gameState: startStatus,
      parentId: "",
      id: generateNodeId(),
    };

    const illegalMove = applyMove(thirdMove, 50, 34, "blackPawn");

    const blackPawnNodeArray = blackPawnNodes(currentNode);
    const foundNode = blackPawnNodeArray.find((node) => {
      return node.boardState.blackPawn === illegalMove.blackPawn;
    });

    if (LoggerConfig.enableEvaluationLogs) {
      evalLogs.evalAddNode(currentNode, 1);
      blackPawnNodeArray.forEach((pawnNode) => {
        evalLogs.evalAddNode(pawnNode, 0);
      });
      outputEvalLogsHtml(
        evalLogs,
        "cannot move onto occupied squares in the same file"
      );
    }

    expect(foundNode).toBeFalsy();
  });
});
