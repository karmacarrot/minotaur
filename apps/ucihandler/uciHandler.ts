import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import {
  applyMove,
  FindBestMoveMiniMax,
  moveToUciFormat,
  StartingNode,
  gameStatusReducer,
  type GameStatusUpdateAction,
  getFenFromGameNode,
  LogUnicodeBoardPositions,
} from '@karmacarrot/minotaur-chess-engine';

const ENGINE_DEPTH = 2;

const rl = readline.createInterface({ input, output });
console.log('UCI handler started.');

//init game state
let gameNode = StartingNode();

function resetGame() {
  gameNode = StartingNode();
}

export function parseUciMove(moveString: string): string {
  const moveFrom = moveString.slice(0, 2);
  const moveTo = moveString.slice(2, 4);
  let promotionPiece = moveString.length === 5 ? moveString[4] : null;

  return `moving from ${moveFrom} to ${moveTo} ${promotionPiece ? 'turning into a ' + promotionPiece : ''}`.trim();
}

function applyMoves(moveLine: string) {
  const moveCommands = moveLine.trim().split(/\s+/);

  moveCommands.forEach((moveCommand: string) => {
    if (moveCommand === 'startpos') {
      resetGame();
    } else {
      // applyMove(gameNode.boardState);
    }
  });
}

function updateGameStatus(action: GameStatusUpdateAction) {
  gameNode.gameState = gameStatusReducer(gameNode.gameState, action);
}

rl.on('line', async (line) => {
  if (line === 'uci') {
    console.log(`id name @karmacarrot/minotaur-chess-engine v0.1.0`);
    console.log(`id author @karmacarrot`);
    console.log(`uciok`);
  } else if (line === 'isready') {
    console.log('readyok');
  } else if (line === 'fenme') {
    console.log(getFenFromGameNode(gameNode));
  } else if (line === 'showme') {
    console.log(LogUnicodeBoardPositions(gameNode.boardState));
  } else if (line === 'quit') {
    rl.close();
  } else if (line === 'ucinewgame') {
    resetGame();
  } else if (line === 'go') {
    const bestMove = await FindBestMoveMiniMax(
      gameNode.boardState,
      gameNode.gameState,
      ENGINE_DEPTH
    );
    console.log('bestmove ' + moveToUciFormat(bestMove));
  } else if (line.startsWith('position')) {
    if (line.endsWith('startpos')) {
      resetGame();
      return;
    }
    applyMoves(line);
  } else {
    console.log(`Unknown command: ${line}`);
  }
});
