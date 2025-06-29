import {
  BoardArrangements,
  BoardArray,
  MinotaurEngineController,
  Piece,
} from '@karmacarrot/minotaur-chess-engine';
import { useCallback, useEffect, useRef, useState } from 'react';

export const useEngine = (boardSideLength: number) => {
  const engine = useRef<MinotaurEngineController | null>(null);
  const hasTriggeredComputerMove = useRef(false);

  if (!engine.current) {
    engine.current = new MinotaurEngineController(2);
  }

  const [engineDepth, setEngineDepth] = useState(2);
  const [currentBoard, setCurrentBoard] = useState(engine.current.currentBoard);
  const [gameStatus, setCurrentStatus] = useState({ ...engine.current.gameStatus });

  const boardAsArray = BoardArray(engine.current.currentBoard);
  useEffect(() => {
    if (
      !gameStatus.isWhitesTurn &&
      gameStatus.blackComputerControl &&
      !gameStatus.isGameOver &&
      !hasTriggeredComputerMove.current
    ) {
      hasTriggeredComputerMove.current = true;
      const makeMove = async () => {
        console.log('Computer move');
        await engine.current?.engineBestMove(setCurrentBoard, setCurrentStatus).then(() => {
          hasTriggeredComputerMove.current = false;
        });
      };

      makeMove();
    }
  }, [gameStatus]);

  const updateBoard = () => {
    if (engine.current) {
      setCurrentBoard(engine.current.currentBoard);
      setCurrentStatus({ ...engine.current.gameStatus });
    }
  };

  const resetGame = useCallback((boardArrangment: BoardArrangements) => {
    engine.current?.resetGame(boardArrangment);
    updateBoard();
  }, []);

  const updateComputerControl = useCallback((colour: 'black' | 'white', isComputer: boolean) => {
    if (colour === 'black' && engine.current) {
      engine.current.gameStatus.blackComputerControl = isComputer;
    }
    if (engine.current) {
      engine.current.gameStatus.whiteComputerControl = isComputer;
    }
    updateBoard();
    return;
  }, []);

  const movePiece = useCallback(
    (piece: Piece, fromRank: number, toRank: number, fromFile: string, toFile: string) => {
      engine.current?.movePiece(
        piece,
        fromRank,
        toRank,
        fromFile,
        toFile,
        setCurrentBoard,
        setCurrentStatus
      );
    },
    []
  );

  return {
    setEngineDepth,
    engineDepth,
    currentBoard,
    boardAsArray,
    gameStatus,
    resetGame,
    movePiece,
    updateComputerControl,
  };
};
