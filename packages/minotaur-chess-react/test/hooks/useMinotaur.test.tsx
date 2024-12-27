/**
 * @jest-environment jsdom
 */
import { LogBoardPositions } from '@karmacarrot/minotaur-chess-engine-tests/testHelper';
import {
  InitialGameStatus,
  BoardArrangements,
  Piece,
  BoardMove,
  bitCount,
} from '@karmacarrot/minotaur-chess-engine';
import { BoardXY, convertRankFileToBoardXY, useMinotaur } from '@karmacarrot/minotaur-chess-react';
import { act, renderHook, waitFor } from '@testing-library/react';

if (!crypto.randomUUID) {
  crypto.randomUUID = () => '00000000-0000-0000-0000-000000000000';
}
describe('useMinotaur Hook', () => {
  const boardSideLength = 400;

  test('initializes with starting board and initial game status', () => {
    const { result } = renderHook(() => useMinotaur(boardSideLength));

    expect(result.current.currentBoard).toBeDefined();
    expect(result.current.gameStatus).toEqual(InitialGameStatus);
    expect(result.current.boardAsArray.length).toBeGreaterThan(0);
  });

  test('resets the game with specified arrangement', () => {
    const { result } = renderHook(() => useMinotaur(boardSideLength));

    act(() => {
      result.current.resetGame(BoardArrangements.StartingPositions);
    });

    expect(result.current.currentBoard).toBeDefined();
    expect(result.current.gameStatus).toEqual(InitialGameStatus);
  });

  test('updates computer control for black', () => {
    const { result } = renderHook(() => useMinotaur(boardSideLength));

    act(() => {
      result.current.updateComputerControl('black', true);
    });

    expect(result.current.gameStatus.blackComputerControl).toBe(true);
  });

  test('handles invalid piece movement', () => {
    const { result } = renderHook(() => useMinotaur(boardSideLength));
    const piece: Piece = 'blackKnight';
    const boardOffset: BoardXY = { x: 0, y: 0 };

    act(() => {
      result.current.movePiece(piece, 1, 0, 2, 2, boardOffset);
    });

    expect(result.current.gameStatus.moveHistory).toHaveLength(0);
  });

  test('toggles check status correctly', () => {
    const { result } = renderHook(() => useMinotaur(boardSideLength));

    act(() => {
      result.current.updateCheckStatus('white', true);
    });

    expect(result.current.gameStatus.whiteKingChecked).toBe(true);
  });

  test('handles game end status on checkmate', () => {
    const { result } = renderHook(() => useMinotaur(boardSideLength));

    act(() => {
      result.current.updateGameEndStatus(true);
    });

    expect(result.current.gameStatus.isGameOver).toBe(true);
  });

  test('correctly sets the right square for a move based on co-ordinates and square size', () => {
    const { result } = renderHook(() => useMinotaur(boardSideLength));
    const piece: Piece = 'whitePawn';
    const boardOffset: BoardXY = { x: 0, y: 0 };

    const xTo = 20;
    const yTo = 210;
    const xFrom = 20;
    const yFrom = 320;

    act(() => {
      result.current.movePiece(piece, xFrom, yFrom, xTo, yTo, boardOffset);
    });

    expect(result.current.gameStatus.moveHistory).toHaveLength(1);

    const lastMove = result.current.gameStatus.moveHistory[0];
    expect(lastMove?.PieceMoved).toBe(piece);
  });

  test('sets last pawn double move when double moving a pawn', () => {
    const { result } = renderHook(() => useMinotaur(boardSideLength));
    const piece: Piece = 'whitePawn';
    const boardOffset: BoardXY = { x: 0, y: 0 };

    const xTo = 20;
    const yTo = 210;
    const xFrom = 20;
    const yFrom = 320;

    act(() => {
      result.current.movePiece(piece, xFrom, yFrom, xTo, yTo, boardOffset);
    });

    const movedPawn = '0b0000000000000000000000001000000000000000000000000000000000000000';

    expect(result.current.gameStatus.lastWhiteDoublePawnMove).toBe(BigInt(movedPawn));
  });

  test("doesn't set last pawn double move when moving a pawn 1 square", () => {
    const { result } = renderHook(() => useMinotaur(boardSideLength));
    const piece: Piece = 'whitePawn';
    const boardOffset: BoardXY = { x: 0, y: 0 };

    const xTo = 20;
    const yTo = 260;
    const xFrom = 20;
    const yFrom = 320;

    act(() => {
      result.current.movePiece(piece, xFrom, yFrom, xTo, yTo, boardOffset);
    });
    expect(result.current.gameStatus.moveHistory).toHaveLength(1);
    expect(result.current.gameStatus.lastWhiteDoublePawnMove).toBe(BigInt(0));
  });

  test('movePiece function handles legal moves correctly', () => {
    const { result } = renderHook(() => useMinotaur(boardSideLength));
    const piece: Piece = 'whitePawn';
    const boardOffset: BoardXY = { x: 0, y: 0 };

    const xTo = 20;
    const yTo = 210;
    const xFrom = 20;
    const yFrom = 320;

    act(() => {
      result.current.movePiece(piece, xFrom, yFrom, xTo, yTo, boardOffset);
    });

    expect(result.current.currentBoard).toBeDefined();
    expect(result.current.gameStatus.moveHistory).toHaveLength(1);

    // LogBoardPositions(result.current.currentBoard);
  });

  test('movePiece function prevents illegal moves', () => {
    const { result } = renderHook(() => useMinotaur(boardSideLength));
    const piece: Piece = 'whitePawn';
    const boardOffset: BoardXY = { x: 0, y: 0 };

    const xTo = 0;
    const yTo = 0;
    const xFrom = 0;
    const yFrom = 0;

    act(() => {
      result.current.movePiece(piece, xFrom, yFrom, xTo, yTo, boardOffset);
    });

    expect(result.current.currentBoard).toBeDefined();
    expect(result.current.gameStatus.moveHistory).toHaveLength(0);
  });

  test('movePiece function handles multiple moves and turn taking correctly', async () => {
    const { result } = renderHook(() => useMinotaur(boardSideLength));

    act(() => {
      result.current.resetGame(BoardArrangements.EnPassantBoard);
    });
    act(() => {
      result.current.updateComputerControl('black', false);
    });

    const moveZero: BoardMove = {
      PieceMoved: 'whitePawn',
      PieceTaken: null,
      isLegal: true,
      FileFrom: 'a',
      FileTo: 'a',
      RankFrom: 4,
      RankTo: 5,
      CastleRookFrom: '',
      CastleRookTo: '',
    };

    const moveZeroFrom = convertRankFileToBoardXY(
      moveZero.RankFrom,
      moveZero.FileFrom,
      { x: 0, y: 0 },
      50
    );
    const moveZeroTo = convertRankFileToBoardXY(
      moveZero.RankTo,
      moveZero.FileTo,
      { x: 0, y: 0 },
      50
    );

    act(() => {
      const moveResult = result.current.movePiece(
        'whitePawn',
        moveZeroFrom.x,
        moveZeroFrom.y,
        moveZeroTo.x,
        moveZeroTo.y,
        { x: 0, y: 0 }
      );
    });

    await waitFor(() => {
      expect(result.current.gameStatus.moveHistory).toHaveLength(1);
      expect(result.current.gameStatus.isWhitesTurn).toBe(false);
    });

    const moveOne: BoardMove = {
      PieceMoved: 'blackPawn',
      PieceTaken: null,
      isLegal: true,
      FileFrom: 'h',
      FileTo: 'h',
      RankFrom: 7,
      RankTo: 5,
      CastleRookFrom: '',
      CastleRookTo: '',
    };

    const moveOneFrom = convertRankFileToBoardXY(
      moveOne.RankFrom,
      moveOne.FileFrom,
      { x: 0, y: 0 },
      50
    );
    const moveOneTo = convertRankFileToBoardXY(moveOne.RankTo, moveOne.FileTo, { x: 0, y: 0 }, 50);

    act(() => {
      const moveResult = result.current.movePiece(
        'blackPawn',
        moveOneFrom.x,
        moveOneFrom.y,
        moveOneTo.x,
        moveOneTo.y,
        { x: 0, y: 0 }
      );
      console.log(moveResult);
    });

    await waitFor(() => {
      expect(result.current.gameStatus.moveHistory).toHaveLength(2);
      expect(result.current.gameStatus.lastBlackDoublePawnMove).toBeGreaterThan(BigInt(0));
      expect(result.current.gameStatus.isWhitesTurn).toBe(true);
    });
  });

  test('movePiece function handles en passant correctly', async () => {
    const { result } = renderHook(() => useMinotaur(boardSideLength));

    act(() => {
      result.current.resetGame(BoardArrangements.EnPassantBoard);
    });
    act(() => {
      result.current.updateComputerControl('black', false);
    });

    const moveZero: BoardMove = {
      PieceMoved: 'whitePawn',
      PieceTaken: null,
      isLegal: true,
      FileFrom: 'a',
      FileTo: 'a',
      RankFrom: 4,
      RankTo: 5,
      CastleRookFrom: '',
      CastleRookTo: '',
    };

    const moveZeroFrom = convertRankFileToBoardXY(
      moveZero.RankFrom,
      moveZero.FileFrom,
      { x: 0, y: 0 },
      50
    );
    const moveZeroTo = convertRankFileToBoardXY(
      moveZero.RankTo,
      moveZero.FileTo,
      { x: 0, y: 0 },
      50
    );

    act(() => {
      const moveResult = result.current.movePiece(
        'whitePawn',
        moveZeroFrom.x,
        moveZeroFrom.y,
        moveZeroTo.x,
        moveZeroTo.y,
        { x: 0, y: 0 }
      );
    });

    const moveOne: BoardMove = {
      PieceMoved: 'blackPawn',
      PieceTaken: null,
      isLegal: true,
      FileFrom: 'h',
      FileTo: 'h',
      RankFrom: 7,
      RankTo: 5,
      CastleRookFrom: '',
      CastleRookTo: '',
    };

    const moveOneFrom = convertRankFileToBoardXY(
      moveOne.RankFrom,
      moveOne.FileFrom,
      { x: 0, y: 0 },
      50
    );
    const moveOneTo = convertRankFileToBoardXY(moveOne.RankTo, moveOne.FileTo, { x: 0, y: 0 }, 50);

    act(() => {
      const moveResult = result.current.movePiece(
        'blackPawn',
        moveOneFrom.x,
        moveOneFrom.y,
        moveOneTo.x,
        moveOneTo.y,
        { x: 0, y: 0 }
      );
    });

    await waitFor(() => {
      expect(result.current.gameStatus.moveHistory).toHaveLength(2);
      expect(result.current.gameStatus.lastBlackDoublePawnMove).toBeGreaterThan(BigInt(0));
      const blackPawnCount = bitCount(result.current.currentBoard.blackPawn);
      expect(blackPawnCount).toBe(4);
    });

    const moveTwo: BoardMove = {
      PieceMoved: 'whitePawn',
      PieceTaken: 'blackPawn',
      isLegal: true,
      FileFrom: 'g',
      FileTo: 'h',
      RankFrom: 5,
      RankTo: 6,
      CastleRookFrom: '',
      CastleRookTo: '',
    };

    const moveTwoFrom = convertRankFileToBoardXY(
      moveTwo.RankFrom,
      moveTwo.FileFrom,
      { x: 0, y: 0 },
      50
    );
    const moveTwoTo = convertRankFileToBoardXY(moveTwo.RankTo, moveTwo.FileTo, { x: 0, y: 0 }, 50);

    act(() => {
      const moveResult = result.current.movePiece(
        'whitePawn',
        moveTwoFrom.x,
        moveTwoFrom.y,
        moveTwoTo.x,
        moveTwoTo.y,
        { x: 0, y: 0 }
      );
      console.log(moveResult);
    });

    await waitFor(() => {
      const blackPawnCount = bitCount(result.current.currentBoard.blackPawn);
      expect(blackPawnCount).toBe(3);
    });
  });
});
