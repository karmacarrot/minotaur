/**
 * @jest-environment jsdom
 */

import { InitialGameStatus, BoardArrangements, Piece } from '@karmacarrot/minotaur-chess-engine';
import { BoardOffset, useMinotaur } from '@karmacarrot/minotaur-chess-react';
import { act, renderHook } from '@testing-library/react';

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
    const boardOffset: BoardOffset = { x: 0, y: 0 };

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
    const boardOffset: BoardOffset = { x: 0, y: 0 };

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
    const boardOffset: BoardOffset = { x: 0, y: 0 };

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
    const boardOffset: BoardOffset = { x: 0, y: 0 };

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
});
