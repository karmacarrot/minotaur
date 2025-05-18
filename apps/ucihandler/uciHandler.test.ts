import { spawn } from 'child_process';
import { parseUciMove } from './uciHandler.ts';

async function runEngineWithInput(inputs: string[]): Promise<string[]> {
  const child = spawn('node', ['uciHandler.ts']);

  const finalOutput = await new Promise<string>((resolve, reject) => {
    let output = '';
    child.stdout.on('data', (data) => {
      output += data.toString();
    });
    child.on('error', reject);
    child.on('spawn', () => {
      for (const input of inputs) {
        child.stdin.write(input + '\n');
      }
      child.stdin.end();
    });
    child.stdout.on('close', () => {
      resolve(output);
    });
  });
  console.log('Raw output:', JSON.stringify(finalOutput));
  return finalOutput.split(/\r?\n/).filter((line) => line.trim().length > 0);
}

describe('UCI Wrapper', () => {
  it('starts the engine', async () => {
    const responses = await runEngineWithInput(['quit']);
    expect(responses).toContain('UCI handler started.');
  });

  it('responds to uci command', async () => {
    const responses = await runEngineWithInput(['uci', 'quit']);
    expect(responses).toContain('uciok');
    expect(responses.some((r) => r.startsWith('id name'))).toBe(true);
  });

  it('responds to isready command', async () => {
    const responses = await runEngineWithInput(['isready', 'quit']);
    expect(responses).toContain('readyok');
  });

  it('calculates a best move from start position', async () => {
    const responses = await runEngineWithInput(['position startpos moves e2e4', 'go', 'quit']);

    const bestMoveLine = responses.find((r) => r.startsWith('bestmove'));
    expect(bestMoveLine).toBe('bestmove e2e4');
  });
});

describe('parseUciMove', () => {
  const testCases = [
    { input: 'e2e4', expected: 'moving from e2 to e4' },
    { input: 'g1f3', expected: 'moving from g1 to f3' },
    { input: 'a7a8q', expected: 'moving from a7 to a8 turning into a q' },
    { input: 'h2h1n', expected: 'moving from h2 to h1 turning into a n' },
    { input: 'b8c6', expected: 'moving from b8 to c6' },
  ];

  test.each(testCases)('parses $input', ({ input, expected }) => {
    expect(parseUciMove(input)).toBe(expected);
  });
});
