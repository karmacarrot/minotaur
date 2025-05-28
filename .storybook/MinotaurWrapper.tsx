import { useMinotaur } from '../packages/minotaur-chess-react/src/src/hooks/useMinotaur';

export function MinotaurWrapper({ children }) {
  const {
    currentBoard,
    resetGame,
    boardAsArray,
    engineDepth,
    setEngineDepth,
    updateComputerControl,
    movePiece,
    gameStatus,
  } = useMinotaur(400);

  return <>{children}</>;
}
