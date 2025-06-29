import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import {
  moveToUciFormat,
  getFenFromGameNode,
  LogUnicodeBoardPositions,
  MinotaurEngineController,
  BoardArrangements,
  getFileAndRank,
  type Piece,
} from '@karmacarrot/minotaur-chess-engine';

const ENGINE_DEPTH = 2;

const rl = readline.createInterface({ input, output });

let controller: MinotaurEngineController;

resetGame();

export function resetGame() {
  controller = new MinotaurEngineController(ENGINE_DEPTH);
  controller.resetGame(BoardArrangements.StartingPositions);
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
  } else if (line === 'quit' || line === 'exit') {
    rl.close();
  } else if (line === 'ucinewgame') {
    resetGame();
  } else if (line === 'go') {
    const engineResponse = await controller.engineBestMove(
      () => {
        return;
      },
      () => {
        return;
      }
    );
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
        toMove.file + '',
        () => {
          return;
        },
        () => {
          return;
        }
      );
    });
  } else {
    console.log(`Unknown command: ${line}`);
  }
});
