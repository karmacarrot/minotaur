"use client";

import ChessBoard from "../ChessBoard/ChessBoard";
import styles from "./ChessGame.module.css";
import { GameStatus } from "../GameStatus/GameStatus";
import { GameControls } from "../GameControls/GameControls";
import { useMinotaur } from "@karmacarrot/minotaur-chess-react";

export default function ChessGame() {
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

  return (
    <div className='content-container'>
      <div className={styles.gamecontainer}>
        <div className={styles.boardcontainer}>
          <GameControls
            updateControl={updateComputerControl}
            resetGame={resetGame}
            engineDepth={engineDepth}
            setDepth={setEngineDepth}
          ></GameControls>
          <div className={styles.boardwrapper}>
            <ChessBoard
              boardArray={boardAsArray}
              movePiece={movePiece}
              blackKingCheck={gameStatus.blackKingChecked}
              whiteKingCheck={gameStatus.whiteKingChecked}
            ></ChessBoard>
            <GameStatus
              boardState={currentBoard}
              gameStatus={gameStatus}
            ></GameStatus>
          </div>
          <div className={styles.intro}>
            <p>
              This chess game is using 64-bit binary integers for each type of
              piece which are then merged into an array for React to render into
              the board. State is managed by React and the piece movement is
              done through applying bitmasks in pure functions. Datastructures
              are intended to be immutable. Currently only pawns movement rules
              are enforced. Engine analysis is done by a recursive minimax
              function with alpha beta pruning yet to be implemented. The
              intention is to first create a strong engine for the pawns then
              slowly expand out to the other pieces.
            </p>
            <p>
              <strong>Current feature list</strong>
            </p>
            <ul>
              <li>Basic moves - done</li>
              <li>Basic engine minimax game tree search - done</li>
              <li>Check / checkmate - in progress</li>
              <li>Castling / en passant - to do</li>
              <li>alpha / beta pruning, eval optimisations - to do</li>
            </ul>
          </div>
        </div>
        {/* <div className={styles.dumpcontainer}>
          <DataDump boardState={currentBoard} />
        </div> */}
      </div>
    </div>
  );
}
