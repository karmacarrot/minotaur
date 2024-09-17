import {
  BitBoard,
  BoardMove,
  evaluateBoard,
  GameStatus as GameStatusModel,
} from "@karmacarrot/minotaur-chess-engine";
import EvaluationBar from "../EvaluationBar/EvaluationBar";
import styles from "./GameStatus.module.css";

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

export function GameStatus({
  gameStatus,
  boardState,
}: {
  gameStatus: GameStatusModel;
  boardState: BitBoard;
}) {
  const evalBoard = evaluateBoard(boardState, gameStatus.isWhitesTurn);

  return (
    <div className={styles.statusbar}>
      <ul>
        <li key='turn'>Turn: {gameStatus.isWhitesTurn ? "White" : "Black"}</li>

        <li key='history'>
          History: {renderMoveHistory(gameStatus.moveHistory)}
        </li>
        <li key='whitePlayer'>
          White player: {gameStatus.whiteComputerControl ? "Computer" : "Human"}
        </li>

        <li key='blackPlayer'>
          Black player: {gameStatus.blackComputerControl ? "Computer" : "Human"}
        </li>
      </ul>
      <EvaluationBar score={evalBoard}></EvaluationBar>
    </div>
  );
}
