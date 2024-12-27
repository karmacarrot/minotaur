'use client';

import { ChessBoard } from '../ChessBoard/ChessBoard';

import { GameStatus } from '../GameStatus/GameStatus';
import { GameControls } from '../GameControls/GameControls';
import { useMinotaur } from '../../hooks/useMinotaur';
import { ChessGameProps } from '../../definitions';
import styled from 'styled-components';

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const BoardContainer = styled.div`
  width: 100%;
`;

const DumpContainer = styled.div`
  width: 100%;
`;

const IntroContainer = styled.div`
  margin: 50px;
`;

const BoardWrapper = styled.div`
  display: flex;
`;

export const ChessGame: React.FC<ChessGameProps> = ({ config }) => {
  if (!config || !config.pieceImages) {
    throw new Error('minotaurConfig is not provided or missing pieceImages!');
  }

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
    <div className="content-container">
      <GameContainer>
        <BoardContainer>
          <GameControls
            updateControl={updateComputerControl}
            resetGame={resetGame}
            engineDepth={engineDepth}
            setDepth={setEngineDepth}
          ></GameControls>
          <BoardWrapper>
            <ChessBoard
              boardArray={boardAsArray}
              movePiece={movePiece}
              blackKingCheck={gameStatus.blackKingChecked}
              whiteKingCheck={gameStatus.whiteKingChecked}
              config={config}
            ></ChessBoard>
            <GameStatus boardState={currentBoard} gameStatus={gameStatus}></GameStatus>
          </BoardWrapper>
          <IntroContainer>
            <p>
              This chess game is using 64-bit binary integers for each type of piece which are then
              merged into an array for React to render into the board. State is managed by React and
              the piece movement is done through applying bitmasks in pure functions. Datastructures
              are intended to be immutable. Currently only pawns movement rules are enforced. Engine
              analysis is done by a recursive minimax function with alpha beta pruning yet to be
              implemented. The intention is to first create a strong engine for the pawns then
              slowly expand out to the other pieces.
            </p>
            <p>
              <strong>Current feature list</strong>
            </p>
            <ul>
              <li>Basic moves - done</li>
              <li>Basic engine minimax game tree search - done</li>
              <li>Check / checkmate - done</li>
              <li>Castling - done</li>
              <li>en passant - in progress</li>
              <li>alpha / beta pruning, eval optimisations - to do</li>
            </ul>
          </IntroContainer>
        </BoardContainer>
        {/* <DumpContainer>
          <DataDump boardState={currentBoard} />
        </DumpContainer> */}
      </GameContainer>
    </div>
  );
};
