import {
  BitBoard,
  BoardMove,
  evaluateBoard,
  GameStatus as GameStatusModel,
} from '@karmacarrot/minotaur-chess-engine';
import { EvaluationBar } from '../EvaluationBar/EvaluationBar';
import styled from 'styled-components';

function renderMoveHistory(moveHistory: BoardMove[]) {
  const moveString = (move: BoardMove) => {
    const moveKey = `${move.FileFrom}${move.FileTo}${move.RankFrom}${move.RankTo}`;
    return (
      <li key={moveKey}>
        {move.PieceMoved} {move.FileFrom}
        {move.RankFrom} to {move.FileTo}
        {move.RankTo}
      </li>
    );
  };

  return <ul>{moveHistory.map((x) => moveString(x))}</ul>;
}

const StatusContainer = styled.div`
  margin: 50px;
  float: left;
`;

export function GameStatus({
  gameStatus,
  boardState,
}: {
  gameStatus: GameStatusModel;
  boardState: BitBoard;
}) {
  const evalBoard = evaluateBoard(boardState, gameStatus.isWhitesTurn);

  return (
    <StatusContainer>
      <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-2xl font-semibold mb-4 text-center">Game Status</h2>
        <ul className="space-y-3">
          <li key="turn" className="flex justify-between items-center">
            <span className="text-gray-400">Turn:</span>
            <span className="text-lg font-medium">
              {gameStatus.isWhitesTurn ? 'White' : 'Black'}
            </span>
          </li>
          <li key="history" className="flex flex-col">
            <span className="text-gray-400">History:</span>
            <div className="text-sm font-light text-gray-300 mt-1 pl-2">
              {renderMoveHistory(gameStatus.moveHistory)}
            </div>
          </li>
          <li key="whitePlayer" className="flex justify-between items-center">
            <span className="text-gray-400">White Player:</span>
            <span className="text-lg font-medium">
              {gameStatus.whiteComputerControl ? 'Computer' : 'Human'}
            </span>
          </li>
          <li key="blackPlayer" className="flex justify-between items-center">
            <span className="text-gray-400">Black Player:</span>
            <span className="text-lg font-medium">
              {gameStatus.blackComputerControl ? 'Computer' : 'Human'}
            </span>
          </li>
          <li key="whitePlayerCastle" className="flex justify-between items-center">
            <span className="text-gray-400">White Player Can Castle:</span>
            <span className="text-lg font-medium">
              {gameStatus.whiteKingCanCastleLong ? 'Long' : ''}
              {' | '}
              {gameStatus.whiteKingCanCastleShort ? 'Short' : ''}
            </span>
          </li>
          <li key="blackPlayerCastle" className="flex justify-between items-center">
            <span className="text-gray-400">Black Player Can Castle:</span>
            <span className="text-lg font-medium">
              {gameStatus.blackKingCanCastleLong ? 'Long' : ''}
              {' | '}
              {gameStatus.blackKingCanCastleShort ? 'Short' : ''}
            </span>
          </li>
        </ul>
      </div>
      <EvaluationBar score={evalBoard}></EvaluationBar>
    </StatusContainer>
  );
}
