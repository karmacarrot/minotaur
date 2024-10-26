import { BitBoard, BitMove, EvalLogs, GameNode } from '../../types';
import { evaluateBoard } from '../boardevaluation/boardEval';
import { generateLegalMoves } from './nodes/nodeGenerators';
import { getMoveFromBoardStates } from '../bitboards';

export function maxMove(
  node: GameNode,
  depth: number,
  scoreForWhite: boolean,
  evalLogs: EvalLogs
): [BitMove, GameNode[]] {
  if (depth === 0 || node.gameState.isGameOver) {
    const score = evaluateBoard(node.boardState, scoreForWhite);
    const scoredNoMove = noMove(score);

    evalLogs.evalAddNode(node, depth);
    return [scoredNoMove, []];
  }

  let maxEval = -Infinity;
  let maxMove = node.boardState;

  const possibleMaximiserMoves = generateLegalMoves(node);
  for (let possibleNode of possibleMaximiserMoves) {
    const maxScoreFromPossibleNode = miniMax(
      possibleNode,
      depth - 1,
      false,
      scoreForWhite,
      evalLogs
    );
    if (maxScoreFromPossibleNode > maxEval) {
      maxEval = maxScoreFromPossibleNode;
      maxMove = possibleNode.boardState;
    }
  }
  evalLogs.evalAddNode(node, depth);
  return [scoredMove(maxEval, node.boardState, maxMove), possibleMaximiserMoves];
}

function miniMax(
  node: GameNode,
  depth: number,
  maximiserTurn: boolean,
  scoreForWhite: boolean,
  evalLogs: EvalLogs
): number {
  let score = 0;

  if (depth === 0 || node.gameState.isGameOver) {
    //we're at the leaf, evaluate
    score = evaluateBoard(node.boardState, scoreForWhite);
    node.gameState.positionEvaluation = score;
    evalLogs.evalAddNode(node, depth);
    return score;
  }

  if (maximiserTurn) {
    let maxEval = -Infinity;
    let maxMove = noMove(maxEval);

    const possibleMaximiserMoves = generateLegalMoves(node);
    //console.log(`possible moves ${possibleMaximiserMoves.length}`);
    for (let possibleNode of possibleMaximiserMoves) {
      const maxScoreFromPossibleNode = miniMax(
        possibleNode,
        depth - 1,
        !maximiserTurn,
        scoreForWhite,
        evalLogs
      );
      if (maxScoreFromPossibleNode > maxEval) {
        maxEval = maxScoreFromPossibleNode;
        // maxMove = maxScoreFromPossibleNode;
        // console.log(`max score changed to: ${maxScoreFromPossibleNode.score}`);
      }
    }
    node.gameState.positionEvaluation = maxEval;
    evalLogs.evalAddNode(node, depth);
    return maxEval;
  }

  let minEval = Infinity;
  // let minMove = noMove(minEval);
  const possibleMinimiserMoves = generateLegalMoves(node);

  for (let possibleNode of possibleMinimiserMoves) {
    const minScoreFromPossibleNode = miniMax(
      possibleNode,
      depth - 1,
      !maximiserTurn,
      scoreForWhite,
      evalLogs
    );
    if (minScoreFromPossibleNode < minEval) {
      minEval = minScoreFromPossibleNode;
      //minMove = minScoreFromPossibleNode;
    }
  }
  node.gameState.positionEvaluation = minEval;
  evalLogs.evalAddNode(node, depth);
  return minEval;
}

function noMove(score: number) {
  return {
    from: 0,
    to: 0,
    piece: 'none',
    pieceTaken: 'none',
    score: score,
  } as BitMove;
}

export function scoredMove(score: number, previousBoardState: BitBoard, newBoardState: BitBoard) {
  let scoredBitmove = getMoveFromBoardStates(previousBoardState, newBoardState);
  scoredBitmove.score = score;
  return scoredBitmove;
}
