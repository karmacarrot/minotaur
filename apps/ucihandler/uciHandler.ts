import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import {
  moveToUciFormat,
  getFenFromGameNode,
  LogUnicodeBoardPositions,
  type BitMove,
  MinotaurEngineController,
  BoardArrangements,
  getBitBoardPosition,
  occupiedBy,
  type BitBoard,
  getFileAndRank,
  type Piece,
} from '@karmacarrot/minotaur-chess-engine';

const ENGINE_DEPTH = 2;

const rl = readline.createInterface({ input, output });
console.log('UCI handler started.');

let controller: MinotaurEngineController;

export function resetGame() {
  controller = new MinotaurEngineController(ENGINE_DEPTH);
  controller.resetGame(BoardArrangements.StartingPositions);
}

export function uciToBitMoves(moveLine: string, boardState: BitBoard): BitMove[] {
  const moveCommands = moveLine.trim().split(/\s+/);
  const bitMoves: BitMove[] = [];

  moveCommands.forEach((moveCommand: string) => {
    if (moveCommand === 'startpos') {
      resetGame();
    } else {
      if (
        moveCommand &&
        moveCommand !== 'moves' &&
        moveCommand !== 'position' &&
        moveCommand !== ''
      ) {
        const fromPosition = getBitBoardPosition(moveCommand[0], Number(moveCommand[1]));
        const toPosition = getBitBoardPosition(moveCommand[2], Number(moveCommand[3]));
        const piece = occupiedBy(boardState, fromPosition);
        const takenPiece = occupiedBy(boardState, toPosition);
        const bitMove: BitMove = {
          from: fromPosition,
          to: toPosition,
          piece: piece as keyof BitBoard,
          pieceTaken: takenPiece as keyof BitBoard,
          castleRookFrom: 0,
          castleRookTo: 0,
          score: 0,
          evaluations: 0,
        };
        bitMoves.push(bitMove);
      }
    }
  });

  return bitMoves;
}

rl.on('line', async (line) => {
  if (line === 'uci') {
    console.log(`id name @karmacarrot/minotaur-chess-engine v0.1.0`);
    console.log(`id author @karmacarrot`);
    console.log(`uciok`);
  } else if (line === 'isready') {
    console.log('readyok');
  } else if (line === 'fenme') {
    console.log(getFenFromGameNode(controller.getState()));
  } else if (line === 'showme') {
    const state = controller.getState();
    console.log(LogUnicodeBoardPositions(state.boardState));
  } else if (line === 'showmestatus') {
    const state = controller.getState();
    console.log(state.gameState);
  } else if (line === 'quit') {
    rl.close();
  } else if (line === 'ucinewgame') {
    resetGame();
  } else if (line === 'go') {
    const engineResponse = await controller.engineBestMove();
    console.log('bestmove ' + moveToUciFormat(engineResponse.bestMove));
  } else if (line.startsWith('position')) {
    if (line.endsWith('startpos')) {
      resetGame();
      return;
    }
    const state = controller.currentBoard;
    const bitMoves = uciToBitMoves(line, state);
    bitMoves.forEach((move) => {
      const fromMove = getFileAndRank(move.from);
      const toMove = getFileAndRank(move.to);
      controller.movePiece(
        move.piece as Piece,
        fromMove.rank,
        toMove.rank,
        fromMove.file + '',
        toMove.file + ''
      );
    });
  } else {
    console.log(`Unknown command: ${line}`);
  }
});
