import { renderHook, act } from '@testing-library/react-hooks';
import { InitialGameStatus, BoardArrangements, Piece } from '@karmacarrot/minotaur-chess-engine';
import { BoardOffset, useMinotaur } from '@karmacarrot/minotaur-chess-react';

describe('useMinotaur Hook', () => {
  const boardSideLength = 8;

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
      result.current.updateComputerControl('setBlackControl', true);
    });

    expect(result.current.gameStatus.blackComputerControl).toBe(true);
  });

  test('handles piece movement', () => {
    const { result } = renderHook(() => useMinotaur(boardSideLength));
    const piece: Piece = 'whitePawn';
    const boardOffset: BoardOffset = { x: 0, y: 0 };

    act(() => {
      result.current.movePiece(piece, 4, 6, 4, 4, boardOffset);
    });

    expect(result.current.gameStatus.moveHistory).toHaveLength(1);
    expect(result.current.gameStatus.isWhitesTurn).toBe(false);
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
      result.current.updateCheckStatus('setWhiteCheck', true);
    });

    expect(result.current.gameStatus.whiteKingChecked).toBe(true);
  });

  test('handles game end status on checkmate', () => {
    const { result } = renderHook(() => useMinotaur(boardSideLength));

    act(() => {
      result.current.updateGameEndStatus('setGameOver', true);
    });

    expect(result.current.gameStatus.isGameOver).toBe(true);
  });
});
