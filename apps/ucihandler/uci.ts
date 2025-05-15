import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import {
  FindBestMoveMiniMax,
  moveToUciFormat,
  StartingNode,
} from '@karmacarrot/minotaur-chess-engine';

const ENGINE_DEPTH = 2;

const rl = readline.createInterface({ input, output });
console.log('UCI handler started.');

//init game state
let gameNode = StartingNode();

rl.on('line', async (line) => {
  if (line === 'uci') {
    console.log(`id name @karmacarrot/minotaur-chess-engine v0.1.0`);
    console.log(`id author @karmacarrot`);
    console.log(`uciok`);
  } else if (line === 'isready') {
    console.log('readyok');
  } else if (line === 'quit') {
    rl.close();
  } else if (line === 'ucinewgame') {
    gameNode = StartingNode();
  } else if (line === 'go') {
    const bestMove = await FindBestMoveMiniMax(
      gameNode.boardState,
      gameNode.gameState,
      ENGINE_DEPTH
    );
    console.log(moveToUciFormat(bestMove));
  } else if (line.startsWith('position')) {
    //parse moves, update state
  } else {
    console.log(`Unknown command: ${line}`);
  }
});
