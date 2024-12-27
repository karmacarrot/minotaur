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
  getBitBoardPosition,
  binaryMask64,
  BoardUpdateResponse,
} from '@karmacarrot/minotaur-chess-engine';

import JSConfetti from 'js-confetti';
import { BoardXY } from '../definitions';
import { gameStatusReducer } from './useGameState';

export const useMinotaur = (boardSideLength: number) => {
  const [currentBoard, setCurrentBoard] = useState(() =>
    initBoard(BoardArrangements.StartingPositions)
  );
  const boardAsArray = BoardArray({ ...currentBoard });
  const [engineDepth, setEngineDepth] = useState(2);
  const [gameStatus, dispatch] = useReducer(gameStatusReducer, InitialGameStatus);

  const resetGame = useCallback(
    (boardArrangment: BoardArrangements) => {
      setCurrentBoard(initBoard(boardArrangment));
      dispatch({ type: 'RESET_GAME' });
    },
    [dispatch]
  );

  const handleMoveHistoryUpdates = useCallback(
    (move: BoardMove) => {
      dispatch({ type: 'ADD_MOVE', move });
    },
    [dispatch]
  );

  const updateComputerControl = useCallback(
    (colour: 'white' | 'black', value: boolean) => {
      dispatch({ type: 'SET_COMPUTER_CONTROL', colour, value });
    },
    [dispatch]
  );

  const updateCheckStatus = useCallback(
    (colour: 'white' | 'black', value: boolean) => {
      dispatch({ type: 'SET_CHECK', colour, value });
    },
    [dispatch]
  );

  const updateLastDoublePawnMove = useCallback(
    (colour: 'lastWhiteDoublePawnMove' | 'lastBlackDoublePawnMove', value: bigint) => {
      dispatch({ type: 'SET_LAST_PAWN_DOUBLE_MOVE', colour, value });
    },
    [dispatch]
  );

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

  const movePiece = useCallback(
    (
      piece: Piece,
      xFrom: number,
      yFrom: number,
      xTo: number,
      yTo: number,
      boardOffset: BoardXY
    ): BoardUpdateResponse | null => {
      if (gameStatus.isWhitesTurn && !piece?.toLowerCase().includes('white')) {
        return null;
      }
      if (!gameStatus.isWhitesTurn && !piece?.toLowerCase().includes('black')) {
        return null;
      }

      const toRank = getRank(yTo, boardSideLength, boardOffset.y);
      const fromRank = getRank(yFrom, boardSideLength, boardOffset.y);
      const toFile = getFile(xTo, boardSideLength, boardOffset.x) || '';
      const fromFile = getFile(xFrom, boardSideLength, boardOffset.x) || '';

      let moveResponse = movePieceOnBoard(
        currentBoard,
        piece,
        fromRank,
        fromFile,
        toRank,
        toFile,
        gameStatus
      );
      const newPosition = binaryMask64(
        getBitBoardPosition(toFile, toRank),
        'all_zeroes_with_position_as_one'
      );

      if (moveResponse.MoveAttempted.isLegal) {
        if ((piece === 'whitePawn' || piece === 'blackPawn') && toFile !== fromFile) {
          if (
            !(
              newPosition &
              (gameStatus.isWhitesTurn ? currentBoard.whitePawn : currentBoard.blackPawn)
            )
            // en passant
          ) {
            const enPassantMask = ~(gameStatus.isWhitesTurn
              ? gameStatus.lastBlackDoublePawnMove
              : gameStatus.lastWhiteDoublePawnMove);

            if (gameStatus.isWhitesTurn) {
              moveResponse.BoardState.blackPawn = moveResponse.BoardState.blackPawn & enPassantMask;
            } else {
              moveResponse.BoardState.whitePawn = moveResponse.BoardState.blackPawn & enPassantMask;
            }
          }
        }

        if (
          (piece === 'whitePawn' || piece === 'blackPawn') &&
          (toRank === fromRank + 2 || toRank === fromRank - 2)
        ) {
          updateLastDoublePawnMove(
            gameStatus.isWhitesTurn ? 'lastWhiteDoublePawnMove' : 'lastBlackDoublePawnMove',
            newPosition
          );
        } else {
          updateLastDoublePawnMove(
            gameStatus.isWhitesTurn ? 'lastWhiteDoublePawnMove' : 'lastBlackDoublePawnMove',
            BigInt(0)
          );
        }

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

      return moveResponse;
    },
    [currentBoard, gameStatus, boardSideLength, handleMoveHistoryUpdates, checkCheckStatus]
  );

  useEffect(() => {
    console.log('useEffect called');
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

          if (
            (bestBoardMove.PieceMoved === 'whitePawn' ||
              bestBoardMove.PieceMoved === 'blackPawn') &&
            (bestBoardMove.RankTo === bestBoardMove.RankFrom + 2 ||
              bestBoardMove.RankTo === bestBoardMove.RankFrom - 2)
          ) {
            const newPosition = binaryMask64(
              getBitBoardPosition(bestBoardMove.FileTo, bestBoardMove.RankTo),
              'all_zeroes_with_position_as_one'
            );
            updateLastDoublePawnMove(
              gameStatus.isWhitesTurn ? 'lastWhiteDoublePawnMove' : 'lastBlackDoublePawnMove',
              newPosition
            );
          } else {
            updateLastDoublePawnMove(
              gameStatus.isWhitesTurn ? 'lastWhiteDoublePawnMove' : 'lastBlackDoublePawnMove',
              BigInt(0)
            );
          }

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
    handleMoveHistoryUpdates,
  };
};
