import {
  BoardArray,
  bitMoveToBoardMove,
  getFile,
  getPathAlgabraic,
  getRank,
  movePiece,
  moveSlidingPiece,
} from "./board";
import { faker } from "@faker-js/faker";
import { StartingBoard } from "./helpers/definitions";
import MultiLog from "../Logging/logger";
import { info } from "console";
import { LogLevels } from "../Logging/definitions";
import { LoggerConfig } from "../../logger.config";
import { BitBoard, BitMove, BoardMove } from "./types";

describe("BoardArray", () => {
  const startingBoard = StartingBoard;

  it("should return an array of 8 rows", () => {
    const initialBoard = BoardArray(startingBoard);

    expect(initialBoard).toHaveLength(8);
  });
  it("each row should have 8 columns", () => {
    const initialBoard = BoardArray(startingBoard);

    const rowsWithLengthEight = initialBoard.filter((row) => {
      return row.length === 8;
    });

    expect(rowsWithLengthEight.length).toBe(8);
  });
  it("initially row 2 should be all white pawns", () => {
    const initialBoard = BoardArray(startingBoard);

    expect(initialBoard[1].toString()).toBe(
      "whitePawn,whitePawn,whitePawn,whitePawn,whitePawn,whitePawn,whitePawn,whitePawn"
    );
  });
  it("initially row 7 should be all black pawns", () => {
    const initialBoard = BoardArray(startingBoard);

    expect(initialBoard[6].toString()).toBe(
      "blackPawn,blackPawn,blackPawn,blackPawn,blackPawn,blackPawn,blackPawn,blackPawn"
    );
  });
  it("initially row 8 should have black pieces in the right order", () => {
    const initialBoard = BoardArray(startingBoard);

    expect(initialBoard[7].toString()).toBe(
      "blackRook,blackKnight,blackBishop,blackKing,blackQueen,blackBishop,blackKnight,blackRook"
    );
  });
  it("initially row 1 should have white pieces in the right order", () => {
    const initialBoard = BoardArray(startingBoard);

    expect(initialBoard[0].toString()).toBe(
      "whiteRook,whiteKnight,whiteBishop,whiteKing,whiteQueen,whiteBishop,whiteKnight,whiteRook"
    );
  });
  it("initially row 3-6 will be empty", () => {
    const initialBoard = BoardArray(startingBoard);
    const emptySquares =
      initialBoard[2].filter((x) => x === null).length +
      initialBoard[3].filter((x) => x === null).length +
      initialBoard[4].filter((x) => x === null).length +
      initialBoard[5].filter((x) => x === null).length;
    expect(emptySquares).toBe(32);
  });
});

describe("moveSlidingPiece", () => {
  type TestCase = [string, string, number, string, number, string];
  const whiteTestCases: TestCase[] = [
    ["allows a white pawn to move forward from A2 to A3", "a", 2, "a", 3, ""],
  ];

  it("allows a white pawn to move forward 1 unoccupied square or 2 from starting rank", () => {
    const startingBoard = StartingBoard;
    const newBoardState = moveSlidingPiece(
      startingBoard,
      2,
      "a",
      3,
      "a",
      "whitePawn"
    );
    const newBoardArray = BoardArray(newBoardState);

    expect(newBoardArray[1][7]).toBe(null);
    expect(newBoardArray[2][7]).toBe("whitePawn");
  });
  it("allows a black pawn to move forward 1 unoccupied square or 2 from starting rank", () => {
    const startingBoard = StartingBoard;
    const newBoardState = moveSlidingPiece(
      startingBoard,
      7,
      "a",
      5,
      "a",
      "blackPawn"
    );
    const newBoardArray = BoardArray(newBoardState);

    expect(newBoardArray[6][7]).toBe(null);
    expect(newBoardArray[4][7]).toBe("blackPawn");
  });
});

describe("getRank", () => {
  type TestCase = [string, number, number, number, number];
  const testCases: TestCase[] = [
    ["first rank for y between 350 and 399", 350, 399, 0, 1],
    ["second rank for y between 300 and 349", 300, 349, 0, 2],
    ["third rank for y between 250 and 299", 250, 299, 0, 3],
    ["fourth rank for y between 200 and 249", 200, 249, 0, 4],
    ["fifth rank for y between 150 and 199", 150, 199, 0, 5],
    ["sixth rank for y between 100 and 149", 100, 149, 0, 6],
    ["seventh rank for y between 50 and 99", 50, 99, 0, 7],
    ["last rank for y between 0 and 49", 0, 49, 0, 8],
  ];

  it.each(testCases)(
    "gives you the %s",
    (description, minY, maxY, yOffset, expectedRank) => {
      const yCoordinate = faker.number.int({ min: minY, max: maxY });
      MultiLog(
        LogLevels.info,
        `using ${yCoordinate} as my random y co-ordinate`,
        LoggerConfig.verbosity
      );
      const chessboardHeight = 400;
      const rank = getRank(yCoordinate, chessboardHeight, yOffset);
      expect(rank).toBe(expectedRank);
    }
  );
});

describe("getFile", () => {
  type TestCase = [string, number, number, number, string];
  const testCases: TestCase[] = [
    ["Alice file for x between 0 and 49", 0, 49, 0, "a"],
    ["Bob file for x between 50 and 99", 50, 99, 0, "b"],
    ["Charlie file for x between 100 and 149", 100, 149, 0, "c"],
    ["David file for x between 150 and 199", 150, 199, 0, "d"],
    ["Edward file for x between 200 and 249", 200, 249, 0, "e"],
    ["Frank file for x between 250 and 299", 250, 299, 0, "f"],
    ["George file for x between 300 and 349", 300, 349, 0, "g"],
    ["Harry file for x between 350 and 399", 350, 399, 0, "h"],
  ];
  it.each(testCases)(
    "gives you the %s",
    (description, minX, maxX, xOffset, expectedFile) => {
      const xCoordinate = faker.number.int({ min: minX, max: maxX });
      MultiLog(
        LogLevels.info,
        `using ${xCoordinate} as my random x co-ordinate`,
        LoggerConfig.verbosity
      );
      const chessboardWidth = 400;
      let file = getFile(xCoordinate, chessboardWidth, xOffset);
      expect(file).toBe(expectedFile);
    }
  );
});

describe("getPathAlgabraic", () => {
  it("should return an array of 2 algabraic positions when moving a white pawn 2 places", () => {
    const pawnMove: BoardMove = {
      PieceMoved: "whitePawn",
      PieceTaken: null,
      isLegal: true,
      FileFrom: "a",
      FileTo: "a",
      RankFrom: 2,
      RankTo: 4,
    };
    const positionsArray = getPathAlgabraic(pawnMove);
    expect(positionsArray).toHaveLength(2);
    expect(positionsArray[0]).toEqual({ rank: 3, file: "a" });
    expect(positionsArray[1]).toEqual({ rank: 4, file: "a" });
  });
  it("should return an array of 2 algabraic positions when moving a black pawn 2 places", () => {
    const pawnMove: BoardMove = {
      PieceMoved: "blackPawn",
      PieceTaken: null,
      isLegal: true,
      FileFrom: "a",
      FileTo: "a",
      RankFrom: 7,
      RankTo: 5,
    };
    const positionsArray = getPathAlgabraic(pawnMove);
    expect(positionsArray).toHaveLength(2);
    expect(positionsArray[0]).toEqual({ rank: 6, file: "a" });
    expect(positionsArray[1]).toEqual({ rank: 5, file: "a" });
  });
});

describe("bitMoveToBoardMove", () => {
  const testCases = [
    {
      bitMove: {
        from: 9,
        to: 17,
        piece: "whitePawn" as keyof BitBoard,
        pieceTaken: "" as keyof BitBoard,
      } as BitMove,
      boardMove: {
        PieceMoved: "whitePawn" as keyof BitBoard,
        PieceTaken: "",
        FileFrom: "a",
        FileTo: "a",
        RankFrom: 2,
        RankTo: 3,
        isLegal: true,
      },
    },
    {
      bitMove: {
        from: 64,
        to: 48,
        piece: "blackRook" as keyof BitBoard,
        pieceTaken: "whitePawn" as keyof BitBoard,
      } as BitMove,
      boardMove: {
        PieceMoved: "blackRook" as keyof BitBoard,
        PieceTaken: "whitePawn",
        FileFrom: "h",
        FileTo: "h",
        RankFrom: 8,
        RankTo: 6,
        isLegal: true,
      },
    },
  ];

  it.each(testCases)(
    "should correctly convert bitMove %o to boardMove %o",
    (moves) => {
      const result = bitMoveToBoardMove(moves.bitMove);
      expect(result).toEqual(moves.boardMove);
    }
  );
});
