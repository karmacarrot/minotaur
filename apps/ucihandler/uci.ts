import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const rl = readline.createInterface({ input, output });
console.log('UCI handler started.');

rl.on('line', (line) => {
  if (line === 'uci') {
    console.log(`id name @karmacarrot/minotaur-chess-engine v0.1.0`);
    console.log(`id author @karmacarrot`);
    console.log(`uciok`);
  } else if (line === 'isready') {
    console.log('readyok');
  } else if (line === 'quit') {
    rl.close();
  } else {
    console.log(`Unknown command: ${line}`);
  }
});
