import { writeFileSync } from "fs";
import { BitBoard, EvalLogs, GameNode, GameStatus } from "../types";
import { exec } from "child_process";
import { EmptyBoard, unicodePieceMap } from "../helpers/definitions";
import { BoardArray } from "../board";
import { bitBoardsReadable } from "../helpers/bitboards";

export const createEvalLogs = (): EvalLogs => {
  return {
    evalLayers: [],
    evalLoggingEnabled: true,
    evalAddNode(gameNode: GameNode, depth: number): void {
      let layer = this.evalLayers.find((layer) => layer.depth === depth);
      if (!layer) {
        layer = { depth, evaluations: [] };
        this.evalLayers.push(layer);
      }

      layer.evaluations.push(gameNode);
    },
  };
};

export const outputEvalLogs = (logs: EvalLogs): void => {
  console.log("Logging all evaluation layers and game nodes:");

  logs.evalLayers.forEach((layer) => {
    console.log(`Layer depth: ${layer.depth}`);
    layer.evaluations.forEach((node) => {
      console.log("  GameNode:");
      console.log(`    - Board State: ${JSON.stringify(node.boardState)}`);
      console.log(`    - Game Status:`);
      console.log(`        - Is White's Turn: ${node.gameState.isWhitesTurn}`);
      console.log(`        - Is Game Over: ${node.gameState.isGameOver}`);
      console.log(
        `        - Position Evaluation: ${node.gameState.positionEvaluation}`
      );
      console.log(
        `        - White Computer Control: ${node.gameState.whiteComputerControl}`
      );
      console.log(
        `        - Black Computer Control: ${node.gameState.blackComputerControl}`
      );
      console.log(
        `        - Move History: ${JSON.stringify(node.gameState.moveHistory)}`
      );
    });
  });
};

export const outputEvalLogsHtml = (logs: EvalLogs, testName: string): void => {
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Evaluation Logs - ${testName}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
        }
        h2 {
          color: #2c3e50;
        }
        pre {
          background: #f4f4f4;
          padding: 10px;
          border: 1px solid #ddd;
        }
      </style>
    </head>
    <body>
      <h1>${testName}</h1>
      ${logs.evalLayers
        .map(
          (layer) => `
          <div>
            <h2>Layer Depth: ${layer.depth}</h2>
            <div>
              ${layer.evaluations
                .map(
                  (node) => `
                  
                  <h3 id="${node.id}">GameNode: ${node.id}</h3><p><a href="#${
                    node.parentId
                  }">go to parent</a></p>
                  <p>Board State:</p>
                  <pre>${LogBoardPositionsHTML(node.boardState)}</pre>
                  <p>Game Status:</p>
                  <pre>${JSON.stringify(node.gameState, null, 2)}</pre>
                  <p>Bitboards:</p>
                  <pre>${JSON.stringify(
                    bitBoardsReadable(node.boardState),
                    null,
                    2
                  )}</pre>`
                )
                .join("")}
            </div>
          </div>`
        )
        .join("")}
    </body>
    </html>`;

  const date = new Date();
  const timestamp = date.toISOString().replace(/:/g, "-");
  const fileName = `logs\\eval_logs_${timestamp}.html`;

  console.log(fileName);

  writeFileSync(fileName, htmlContent);

  exec(`start ${fileName}`);
};

export function LogBoardPositionsHTML(currentBoard: BitBoard): string {
  const board = BoardArray(currentBoard);
  let htmlContent = "<table style='border-collapse: collapse;'>";

  for (let row = 7; row >= 0; row--) {
    let rowHtml = "<tr>";
    for (let col = 7; col >= 0; col--) {
      const piece = board[row]![col];
      const cellContent = piece ? unicodePieceMap[piece] || piece : ".";
      const isWhiteSquare = (row + col) % 2 === 0;
      const bgColor = isWhiteSquare ? "#f0d9b5" : "#b58863";
      const cellStyle = `width: 25px; height: 25px; text-align: center; vertical-align: middle; background-color: ${bgColor}; font-size: 20px;`;
      rowHtml += `<td style="${cellStyle}">${cellContent}</td>`;
    }
    rowHtml += "</tr>";
    htmlContent += rowHtml;
  }

  htmlContent += "</table>";
  return htmlContent;
}

export const outputSinglePiecePositions = (
  piecePositions: bigint,
  piece: keyof BitBoard,
  testName: string
): void => {
  const newBoard = EmptyBoard;
  newBoard[piece] = piecePositions;

  outputSingleBitboardHtml(newBoard, null, testName);
};

export const outputSingleBitboardHtml = (
  currentBoard: BitBoard,
  currentGameState: GameStatus | null,
  testName: string
): void => {
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Single Board - ${testName}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
        }
        h2 {
          color: #2c3e50;
        }
        pre {
          background: #f4f4f4;
          padding: 10px;
          border: 1px solid #ddd;
        }
      </style>
    </head>
    <body>
      <h1>${testName}</h1>
                <div>
          
            <div>
             
                  <p>Board State:</p>
                  <pre>${LogBoardPositionsHTML(currentBoard)}</pre>
                  <p>Game Status:</p>
                  <pre>${JSON.stringify(currentGameState, null, 2)}</pre>
                  <p>Bitboards:</p>
                  <pre>${JSON.stringify(
                    bitBoardsReadable(currentBoard),
                    null,
                    2
                  )}</pre>
               
            </div>
          </div>
    </body>
    </html>`;

  const date = new Date();
  const timestamp = date.toISOString().replace(/:/g, "-");
  const fileName = `logs\\eval_logs_${timestamp}.html`;

  console.log(fileName);

  writeFileSync(fileName, htmlContent);

  exec(`start ${fileName}`);
};
