'use client';
import { useCallback, useEffect, useState } from 'react';
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

export const useMinotaur = (boardSideLength: number) => {
  const [currentBoard, setCurrentBoard] = useState(initBoard(BoardArrangements.StartingPositions));

  const [gameStatus, setGameStatus] = useState(InitialGameStatus);
  const boardAsArray = BoardArray({ ...currentBoard });
  const [engineDepth, setEngineDepth] = useState(2);

  const resetGame = (boardArrangment: BoardArrangements) => {
    setGameStatus(InitialGameStatus);
    setCurrentBoard(initBoard(boardArrangment));
  };

  const handleMoveHistoryUpdates = (move: BoardMove) => {
    setGameStatus(function (prevStatus) {
      let newMoveHistory = [...prevStatus.moveHistory];
      newMoveHistory.push(move);

      return {
        moveHistory: newMoveHistory,
        isGameOver: prevStatus.isGameOver,
        isWhitesTurn: !prevStatus.isWhitesTurn,
        positionEvaluation: 0,
        blackComputerControl: prevStatus.blackComputerControl,
        whiteComputerControl: prevStatus.whiteComputerControl,
        whiteKingChecked: prevStatus.whiteKingChecked,
        blackKingChecked: prevStatus.blackKingChecked,
        blackKingCanCastleLong: prevStatus.blackKingCanCastleLong,
        blackKingCanCastleShort: prevStatus.blackKingCanCastleShort,
        whiteKingCanCastleLong: prevStatus.whiteKingCanCastleLong,
        whiteKingCanCastleShort: prevStatus.whiteKingCanCastleShort,
      };
    });

    return;
  };

  const checkMateCheck = useCallback((potentialMoves: number, isChecked: boolean) => {
    if (potentialMoves === 0) {
      updateGameEndStatus('setGameOver', true);
      const jsConfetti = new JSConfetti();

      if (isChecked) {
        jsConfetti.addConfetti();
      }
    }
  }, []);

  const checkCheckStatus = useCallback(
    (newBoardState: BitBoard) => {
      updateCheckStatus('setWhiteCheck', false);
      updateCheckStatus('setBlackCheck', false);
      if (isOpponentCheckedMemo(newBoardState, gameStatus.isWhitesTurn).check) {
        updateCheckStatus(gameStatus.isWhitesTurn ? 'setBlackCheck' : 'setWhiteCheck', true);
      }
      if (isOpponentCheckedMemo(newBoardState, !gameStatus.isWhitesTurn).check) {
        updateCheckStatus(!gameStatus.isWhitesTurn ? 'setBlackCheck' : 'setWhiteCheck', true);
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

    const moveResponse = movePieceOnBoard(currentBoard, piece, fromRank, fromFile, toRank, toFile);

    if (moveResponse.MoveAttempted.isLegal) {
      setCurrentBoard(moveResponse.BoardState);
      handleMoveHistoryUpdates(moveResponse.MoveAttempted);
      checkCheckStatus(moveResponse.BoardState);
    }
  };

  const updateComputerControl = (
    action: 'setBlackControl' | 'setWhiteControl',
    payload: boolean
  ) => {
    setGameStatus(function (prevStatus) {
      return {
        isGameOver: prevStatus.isGameOver,
        isWhitesTurn: prevStatus.isWhitesTurn,
        moveHistory: prevStatus.moveHistory,
        positionEvaluation: prevStatus.positionEvaluation,
        blackComputerControl:
          action === 'setBlackControl' ? payload : prevStatus.blackComputerControl,
        whiteComputerControl:
          action === 'setWhiteControl' ? payload : prevStatus.whiteComputerControl,
        whiteKingChecked: prevStatus.whiteKingChecked,
        blackKingChecked: prevStatus.blackKingChecked,
        blackKingCanCastleLong: prevStatus.blackKingCanCastleLong,
        blackKingCanCastleShort: prevStatus.blackKingCanCastleShort,
        whiteKingCanCastleLong: prevStatus.whiteKingCanCastleLong,
        whiteKingCanCastleShort: prevStatus.whiteKingCanCastleShort,
      };
    });
  };

  const updateCheckStatus = (action: 'setBlackCheck' | 'setWhiteCheck', payload: boolean) => {
    setGameStatus(function (prevStatus) {
      return {
        isGameOver: prevStatus.isGameOver,
        isWhitesTurn: prevStatus.isWhitesTurn,
        moveHistory: prevStatus.moveHistory,
        positionEvaluation: prevStatus.positionEvaluation,
        blackKingChecked: action === 'setBlackCheck' ? payload : prevStatus.blackKingChecked,
        whiteKingChecked: action === 'setWhiteCheck' ? payload : prevStatus.whiteKingChecked,
        whiteComputerControl: prevStatus.whiteComputerControl,
        blackComputerControl: prevStatus.blackComputerControl,
        blackKingCanCastleLong: prevStatus.blackKingCanCastleLong,
        blackKingCanCastleShort: prevStatus.blackKingCanCastleShort,
        whiteKingCanCastleLong: prevStatus.whiteKingCanCastleLong,
        whiteKingCanCastleShort: prevStatus.whiteKingCanCastleShort,
      };
    });
  };

  const updateCastlingStatus = (
    action: 'setBlackLong' | 'setBlackShort' | 'setWhiteLong' | 'setWhiteShort',
    payload: boolean
  ) => {
    setGameStatus(function (prevStatus) {
      return {
        isGameOver: prevStatus.isGameOver,
        isWhitesTurn: prevStatus.isWhitesTurn,
        moveHistory: prevStatus.moveHistory,
        positionEvaluation: prevStatus.positionEvaluation,
        blackKingChecked: prevStatus.blackKingChecked,
        whiteKingChecked: prevStatus.whiteKingChecked,
        whiteComputerControl: prevStatus.whiteComputerControl,
        blackComputerControl: prevStatus.blackComputerControl,
        blackKingCanCastleLong:
          action === 'setBlackLong' ? payload : prevStatus.blackKingCanCastleLong,
        blackKingCanCastleShort:
          action === 'setBlackShort' ? payload : prevStatus.blackKingCanCastleShort,
        whiteKingCanCastleLong:
          action === 'setWhiteLong' ? payload : prevStatus.whiteKingCanCastleLong,
        whiteKingCanCastleShort:
          action === 'setWhiteShort' ? payload : prevStatus.whiteKingCanCastleShort,
      };
    });
  };

  const updateGameEndStatus = (action: 'setGameOver', payload: boolean) => {
    setGameStatus(function (prevStatus) {
      return {
        isGameOver: action === 'setGameOver' ? payload : prevStatus.isGameOver,
        isWhitesTurn: prevStatus.isWhitesTurn,
        moveHistory: prevStatus.moveHistory,
        positionEvaluation: prevStatus.positionEvaluation,
        blackKingChecked: prevStatus.blackKingChecked,
        whiteKingChecked: prevStatus.whiteKingChecked,
        whiteComputerControl: prevStatus.whiteComputerControl,
        blackComputerControl: prevStatus.blackComputerControl,
        blackKingCanCastleLong: prevStatus.blackKingCanCastleLong,
        blackKingCanCastleShort: prevStatus.blackKingCanCastleShort,
        whiteKingCanCastleLong: prevStatus.whiteKingCanCastleLong,
        whiteKingCanCastleShort: prevStatus.whiteKingCanCastleShort,
      };
    });
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
          const newBoardState = applyMove(currentBoard, bestMove.from, bestMove.to, bestMove.piece);
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
    movePiece,
  };
};
