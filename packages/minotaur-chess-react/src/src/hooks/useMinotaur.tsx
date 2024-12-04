'use client';
import { useCallback, useEffect, useReducer, useState } from 'react';
import {
  BoardArray,
  movePiece as movePieceOnBoard,
  getRank,
  getFile,
  initBoard,
  bitMoveToBoardMove,
  BoardArrangements,
  InitialGameStatus,
  BoardMove,
  BitBoard,
  Piece,
  applyMove,
  FindBestMoveMiniMax,
  isOpponentCheckedMemo,
} from '@karmacarrot/minotaur-chess-engine';

import JSConfetti from 'js-confetti';
import { BoardOffset } from '../definitions';
import { gameStatusReducer } from './useGameState';

export const useMinotaur = (boardSideLength: number) => {
  const [currentBoard, setCurrentBoard] = useState(initBoard(BoardArrangements.StartingPositions));
  const boardAsArray = BoardArray({ ...currentBoard });
  const [engineDepth, setEngineDepth] = useState(2);
  const [gameStatus, dispatch] = useReducer(gameStatusReducer, InitialGameStatus);

  const resetGame = (boardArrangment: BoardArrangements) => {
    setCurrentBoard(initBoard(boardArrangment));
  };

  const handleMoveHistoryUpdates = (move: BoardMove) => {
    dispatch({ type: 'ADD_MOVE', move });
  };

  const updateComputerControl = (color: 'white' | 'black', value: boolean) => {
    dispatch({ type: 'SET_COMPUTER_CONTROL', color, value });
  };

  const updateCheckStatus = (color: 'white' | 'black', value: boolean) => {
    dispatch({ type: 'SET_CHECK', color, value });
  };

  const updateCastlingStatus = (
    castling: 'blackLong' | 'blackShort' | 'whiteLong' | 'whiteShort',
    value: boolean
  ) => {
    dispatch({ type: 'SET_CASTLING', castling, value });
  };

  const updateGameEndStatus = (value: boolean) => {
    dispatch({ type: 'SET_GAME_OVER', value });
  };

  const checkMateCheck = useCallback((potentialMoves: number, isChecked: boolean) => {
    if (potentialMoves === 0) {
      updateGameEndStatus(true);
      const jsConfetti = new JSConfetti();

      if (isChecked) {
        jsConfetti.addConfetti();
      }
    }
  }, []);

  const checkCheckStatus = useCallback(
    (newBoardState: BitBoard) => {
      updateCheckStatus('white', false);
      updateCheckStatus('black', false);
      if (isOpponentCheckedMemo(newBoardState, gameStatus.isWhitesTurn).check) {
        updateCheckStatus(gameStatus.isWhitesTurn ? 'black' : 'white', true);
      }
      if (isOpponentCheckedMemo(newBoardState, !gameStatus.isWhitesTurn).check) {
        updateCheckStatus(!gameStatus.isWhitesTurn ? 'black' : 'white', true);
      }
    },
    [gameStatus]
  );

  const movePiece = (
    piece: Piece,
    xFrom: number,
    yFrom: number,
    xTo: number,
    yTo: number,
    boardOffset: BoardOffset
  ) => {
    if (gameStatus.isWhitesTurn && !piece?.toLowerCase().includes('white')) {
      return;
    }
    if (!gameStatus.isWhitesTurn && !piece?.toLowerCase().includes('black')) {
      return;
    }

    const toRank = getRank(yTo, boardSideLength, boardOffset.y);
    const fromRank = getRank(yFrom, boardSideLength, boardOffset.y);
    const toFile = getFile(xTo, boardSideLength, boardOffset.x) || '';
    const fromFile = getFile(xFrom, boardSideLength, boardOffset.x) || '';

    const moveResponse = movePieceOnBoard(
      currentBoard,
      piece,
      fromRank,
      fromFile,
      toRank,
      toFile,
      gameStatus
    );

    if (moveResponse.MoveAttempted.isLegal) {
      setCurrentBoard(moveResponse.BoardState);
      handleMoveHistoryUpdates(moveResponse.MoveAttempted);
      checkCheckStatus(moveResponse.BoardState);
      if (moveResponse.CastleLongLost) {
        updateCastlingStatus(gameStatus.isWhitesTurn ? 'whiteLong' : 'blackLong', false);
      }
      if (moveResponse.CastleShortLost) {
        updateCastlingStatus(gameStatus.isWhitesTurn ? 'whiteShort' : 'blackShort', false);
      }
    }
  };

  useEffect(() => {
    const makeComputerMove = async () => {
      if (!gameStatus.isWhitesTurn && gameStatus.blackComputerControl && !gameStatus.isGameOver) {
        console.log('Black to move!');
        const miniMaxResult = await FindBestMoveMiniMax(currentBoard, gameStatus, engineDepth);
        const bestMove = miniMaxResult[0];

        if (bestMove.to > 0 && bestMove.from > 0) {
          console.log(`computer moves black ${bestMove.from} to ${bestMove.to}`);
          console.log(`computer made ${bestMove.evaluations} evaluations`);
          let newBoardState = applyMove(currentBoard, bestMove.from, bestMove.to, bestMove.piece);

          if (bestMove.castleRookFrom > 0 || bestMove.castleRookTo > 0) {
            newBoardState = applyMove(
              newBoardState,
              bestMove.castleRookFrom,
              bestMove.castleRookTo,
              gameStatus.isWhitesTurn ? 'whiteRook' : 'blackRook'
            );
          }

          setCurrentBoard(newBoardState);

          const bestBoardMove = bitMoveToBoardMove(bestMove);

          handleMoveHistoryUpdates(bestBoardMove);
          checkCheckStatus(newBoardState);
        } else {
          console.log('checking mate for black');
          checkMateCheck(0, gameStatus.blackKingChecked);
        }
      }
    };

    makeComputerMove();
  }, [currentBoard, gameStatus, checkCheckStatus, engineDepth, checkMateCheck]);

  return {
    currentBoard,
    resetGame,
    boardAsArray,
    engineDepth,
    setEngineDepth,
    gameStatus,
    updateComputerControl,
    updateCheckStatus,
    updateGameEndStatus,
    movePiece,
  };
};
