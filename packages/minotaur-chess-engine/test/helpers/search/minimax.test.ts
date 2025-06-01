/**
 * @jest-environment node
 */

import {
  LoggerConfig,
  createEvalLogs,
  StartingBoard,
  InitialGameStatus,
  generateNodeId,
  maxMove,
  outputEvalLogsHtml,
  applyMove,
  CastleForBlackGameBoard,
  CastleForBlackAfterGameBoard,
  evaluateBoard,
  scoredMove,
  EvalWeightings,
  EnPassantBoard,
  PromoteForBlackGameBoard,
  outputEvalLogs,
} from '@karmacarrot/minotaur-chess-engine';

const showEvalOutputs = true; //LoggerConfig.enableEvaluationLogs;

describe('maxMove function', () => {
  it('picks a central pawn move from a starting board for white', () => {
    const evalLogs = createEvalLogs();
    const startBoard = { ...StartingBoard };
    const startStatus = { ...InitialGameStatus };
    const currentNode = {
      boardState: startBoard,
      gameState: startStatus,
      parentId: '',
      id: generateNodeId(),
    };
    const miniMaxResult = maxMove(currentNode, 1, true, evalLogs);

    const { from, to, score } = miniMaxResult[0];
    expect(score).toBeGreaterThan(0);
    expect({ from, to }).toEqual({ from: 13, to: 29 });

    if (showEvalOutputs) {
      outputEvalLogsHtml(evalLogs, 'picks a central pawn move from a starting board for white');
    }
  });

  it.each([1, 2, 3, 4])('picks a valid move for white at %s depth', (depth) => {
    //starting board
    const startBoard = { ...StartingBoard };
    const gameStatus = { ...InitialGameStatus };
    const evalLogs = createEvalLogs();
    //white e4 e6
    const openingMove = applyMove(startBoard, 13, 29, 'whitePawn');
    gameStatus.isWhitesTurn = false;
    //black d7 d5
    const secondMove = applyMove(openingMove, 52, 36, 'blackPawn');
    gameStatus.isWhitesTurn = true;
    // //white d4 d5
    // const thirdMove = applyMove(secondMove, 12, 20, "whitePawn");
    // gameStatus.isWhitesTurn = false;

    //here's where the bug arised, it picks {from: 29, to: 0}
    const currentNode = {
      boardState: secondMove,
      gameState: gameStatus,
      parentId: '',
      id: generateNodeId(),
    };
    const miniMaxResult = maxMove(currentNode, depth, true, evalLogs);

    const { from, to, score } = miniMaxResult[0];
    expect(from).toBeGreaterThan(0);
    expect(to).toBeGreaterThan(0);

    if (showEvalOutputs) {
      outputEvalLogsHtml(evalLogs, `picks a valid move for white at ${depth} depth`);
    }
  });

  it.each([1, 2, 3, 4])('picks a valid move for black at %s depth', (depth) => {
    //starting board
    const startBoard = { ...StartingBoard };
    const gameStatus = { ...InitialGameStatus };
    const evalLogs = createEvalLogs();
    //white e4 e6
    const openingMove = applyMove(startBoard, 13, 29, 'whitePawn');
    gameStatus.isWhitesTurn = false;
    //black d7 d5
    const secondMove = applyMove(openingMove, 52, 36, 'blackPawn');
    gameStatus.isWhitesTurn = true;
    //white d4 d5
    const thirdMove = applyMove(secondMove, 12, 20, 'whitePawn');
    gameStatus.isWhitesTurn = false;

    //here's where the bug arised, it picks {from: 29, to: 0}
    const currentNode = {
      boardState: thirdMove,
      gameState: gameStatus,
      parentId: '',
      id: generateNodeId(),
    };
    const miniMaxResult = maxMove(currentNode, depth, false, evalLogs);

    const { from, to, score } = miniMaxResult[0];
    expect(from).toBeGreaterThan(0);
    expect(to).toBeGreaterThan(0);

    if (showEvalOutputs) {
      outputEvalLogsHtml(evalLogs, `picks a valid move for black at ${depth} depth`);
    }
  });
  it('picks d5 from a starting board for black after white d4 at depth of 2', () => {
    const startBoard = { ...StartingBoard };
    const startStatus = { ...InitialGameStatus };
    const evalLogs = createEvalLogs();
    const newBoard = applyMove(startBoard, 12, 28, 'whitePawn');
    startStatus.isWhitesTurn = false;
    const currentNode = {
      boardState: newBoard,
      gameState: startStatus,
      parentId: '',
      id: generateNodeId(),
    };
    const miniMaxResult = maxMove(currentNode, 2, false, evalLogs);

    const { from, to } = miniMaxResult[0];

    expect({ from, to }).toEqual({ from: 52, to: 36 });

    if (showEvalOutputs) {
      outputEvalLogsHtml(evalLogs, 'picks a central pawn move from a starting board for black');
    }
  });

  it('includes a move to promote a pawn for black when possible', () => {
    const startBoard = { ...PromoteForBlackGameBoard };
    const startStatus = { ...InitialGameStatus };
    const evalLogs = createEvalLogs();

    startStatus.isWhitesTurn = false;
    const currentNode = {
      boardState: startBoard,
      gameState: startStatus,
      parentId: '',
      id: generateNodeId(),
    };
    const [bitMove] = maxMove(currentNode, 1, false, evalLogs);

    expect(bitMove.piece).toBe('blackQueen');
  });

  it('includes a move to advance a pawn for black when possible', () => {
    const startBoard = { ...StartingBoard };
    const startStatus = { ...InitialGameStatus };
    const evalLogs = createEvalLogs();
    const newBoard = applyMove(startBoard, 9, 17, 'whitePawn');
    startStatus.isWhitesTurn = false;
    const currentNode = {
      boardState: newBoard,
      gameState: startStatus,
      parentId: '',
      id: generateNodeId(),
    };

    maxMove(currentNode, 2, false, evalLogs);

    const testBoard = applyMove(startBoard, 53, 37, 'blackPawn');

    let movedKingPawn = false;
    evalLogs.evalLayers.forEach((layer) => {
      const pawnEval = layer.evaluations.find((evaluation) => {
        movedKingPawn = evaluation.boardState.blackPawn === testBoard.blackPawn;
      });

      if (pawnEval) {
        expect(true).toBe(true);
        return;
      }
    });

    expect(false).toBe(true);
  });

  it('includes a move to castle short for black when possible', () => {
    const startBoard = { ...CastleForBlackGameBoard };
    const startStatus = { ...InitialGameStatus };
    const evalLogs = createEvalLogs();
    const newBoard = applyMove(startBoard, 1, 2, 'whiteRook');
    startStatus.isWhitesTurn = false;
    const currentNode = {
      boardState: newBoard,
      gameState: startStatus,
      parentId: '',
      id: generateNodeId(),
    };

    maxMove(currentNode, 2, false, evalLogs);

    let kingCastled = false;
    evalLogs.evalLayers.forEach((layer) => {
      const castledEval = layer.evaluations.find((evaluation) => {
        kingCastled =
          evaluation.boardState.blackKing === CastleForBlackAfterGameBoard.blackKing &&
          evaluation.boardState.blackRook === CastleForBlackAfterGameBoard.blackRook;
      });

      if (castledEval) {
        expect(true).toBe(true);
        return;
      }
    });

    expect(false).toBe(true);
  });

  it("castles short for black when that's the best move", () => {
    const startBoard = { ...CastleForBlackGameBoard };
    const startStatus = { ...InitialGameStatus };
    const evalLogs = createEvalLogs();
    const newBoard = applyMove(startBoard, 1, 2, 'whiteRook');
    startStatus.isWhitesTurn = false;
    const currentNode = {
      boardState: newBoard,
      gameState: startStatus,
      parentId: '',
      id: generateNodeId(),
    };
    const miniMaxResult = maxMove(currentNode, 2, false, evalLogs);

    const { from, to } = miniMaxResult[0];
    if (showEvalOutputs) {
      outputEvalLogsHtml(evalLogs, 'picks a central pawn move from a starting board for black');
    }
    expect({ from, to }).toEqual({ from: 52, to: 36 });
  });

  it('returns no move if depth is 0', () => {
    const startBoard = { ...StartingBoard };
    const startStatus = { ...InitialGameStatus };
    const evalLogs = createEvalLogs();
    const currentNode = {
      boardState: startBoard,
      gameState: startStatus,
      parentId: '',
      id: generateNodeId(),
    };
    const miniMaxResult = maxMove(currentNode, 0, true, evalLogs);

    const { from, to, piece } = miniMaxResult[0];
    expect({ from, to, piece }).toEqual({ from: 0, to: 0, piece: 'none' });

    if (showEvalOutputs) {
      outputEvalLogsHtml(evalLogs, 'returns no move if depth is 0');
    }
  });
  it('returns no move if the game has ended', () => {
    const startBoard = { ...StartingBoard };
    const startStatus = { ...InitialGameStatus };
    const evalLogs = createEvalLogs();
    const currentNode = {
      boardState: startBoard,
      gameState: startStatus,
      parentId: '',
      id: generateNodeId(),
    };
    currentNode.gameState.isGameOver = true;
    const miniMaxResult = maxMove(currentNode, 0, true, evalLogs);

    const { from, to, piece } = miniMaxResult[0];
    expect({ from, to, piece }).toEqual({ from: 0, to: 0, piece: 'none' });

    if (showEvalOutputs) {
      outputEvalLogsHtml(evalLogs, 'returns no move if the game has ended');
    }
  });
});

describe('scoredMove', () => {
  it('returns the right opening move for white with the score passed to it', () => {
    const startingBoard = { ...StartingBoard };
    const newBoard = applyMove(startingBoard, 12, 28, 'whitePawn');
    const scoreNewBoard = evaluateBoard(newBoard, true);
    const scoredPawnMove = scoredMove(scoreNewBoard, startingBoard, newBoard);
    expect(scoredPawnMove).toEqual(
      expect.objectContaining({
        castleRookFrom: 0,
        castleRookTo: 0,
        evaluations: 0,
        from: 12,
        to: 28,
        piece: 'whitePawn',
        pieceTaken: 'none',
        score: expect.any(Number),
      })
    );
  });
  it('returns the right capture when moving en passant', () => {
    const startingBoard = { ...EnPassantBoard };
    const newBoard = applyMove(startingBoard, 11, 27, 'whitePawn');

    const captureBoard = applyMove(newBoard, 28, 19, 'blackPawn');
    const scoreCaptureBoard = evaluateBoard(captureBoard, true);
    const scoredPawnMove = scoredMove(scoreCaptureBoard, newBoard, captureBoard);
    expect(scoredPawnMove).toEqual(
      expect.objectContaining({
        castleRookFrom: 0,
        castleRookTo: 0,
        evaluations: 0,
        from: 28,
        to: 19,
        piece: 'blackPawn',
        pieceTaken: 'whitePawn',
        score: expect.any(Number),
      })
    );
  });
});
