import { GameNode } from '../../../../types';
import { allBlackPositions, allPositions, allWhitePositions, applyMove } from '../../../bitboards';
import { aTogFilesOnly, bTohFilesOnly, evalLoggingOff } from '../../../definitions';
import {
  AllBlackPawnMovesOneSquare,
  AllBlackPawnMovesTwoSquare,
  AllWhitePawnMovesOneSquare,
  AllWhitePawnMovesTwoSquare,
} from '../../../moveEval';
import { pushNewNode } from '../nodeGenerators';

export function whitePawnNodes(node: GameNode): GameNode[] {
  const allOccupiedPositions = allPositions(node.boardState);
  const allOccupiedBlackPositions = allBlackPositions(node.boardState);

  const singleStepMoves = whitePawnOneSquareNodes(node, allOccupiedPositions);

  const doubleStepMoves = whitePawnTwoSquareNodes(node, allOccupiedPositions);

  const captures = whitePawnCaptureNodes(node, allOccupiedBlackPositions);

  const enPassantCaptures = whitePawnEnPassantCaptureNodes(node);

  const allMoves = [...singleStepMoves, ...doubleStepMoves, ...captures, ...enPassantCaptures];

  return allMoves;
}

function whitePawnOneSquareNodes(node: GameNode, allOccupiedPositions: bigint): GameNode[] {
  let newNodes: GameNode[] = [];
  const potentialMoves = AllWhitePawnMovesOneSquare(node.boardState, allOccupiedPositions);

  for (let i = 0; i < 64; i++) {
    const moveBit = BigInt(1) << BigInt(i);
    const offset = 64 - i;
    const newBoardState = applyMove(node.boardState, offset - 8, offset, 'whitePawn');

    if (potentialMoves & moveBit) {
      newNodes = pushNewNode(newNodes, node, newBoardState, evalLoggingOff, 0);
    }
  }
  return newNodes;
}

function whitePawnTwoSquareNodes(node: GameNode, allOccupiedPositions: bigint): GameNode[] {
  let newNodes: GameNode[] = [];
  const potentialTwoStepMoves = AllWhitePawnMovesTwoSquare(node.boardState, allOccupiedPositions);

  for (let i = 0; i < 64; i++) {
    const moveBit = BigInt(1) << BigInt(i);
    if (potentialTwoStepMoves & moveBit) {
      const offset = 64 - i;

      const newBoardState = applyMove(node.boardState, offset - 16, offset, 'whitePawn');

      if (potentialTwoStepMoves & moveBit) {
        newNodes = pushNewNode(newNodes, node, newBoardState, evalLoggingOff, 0);
      }
    }
  }

  return newNodes;
}

export function whitePawnEnPassantCaptureNodes(node: GameNode): GameNode[] {
  if (node.gameState.lastBlackDoublePawnMove === BigInt(0)) {
    return [];
  }
  const possiblePositionForWhiteToEnPassantCaptureTo =
    node.gameState.lastBlackDoublePawnMove >> BigInt(8);

  const whiteCaptures = whitePawnCaptureNodes(node, possiblePositionForWhiteToEnPassantCaptureTo);
  for (const capture of whiteCaptures) {
    capture.boardState.blackPawn =
      capture.boardState.blackPawn & ~node.gameState.lastBlackDoublePawnMove;
  }

  return whiteCaptures;
}

export function whitePawnCaptureNodes(
  node: GameNode,
  allOccupiedBlackPositions: bigint
): GameNode[] {
  let newNodes: GameNode[] = [];

  const leftCapturePositions = (node.boardState.whitePawn & ~bTohFilesOnly) >> BigInt(7);
  const rightCapturePositions = (node.boardState.whitePawn & ~aTogFilesOnly) >> BigInt(9);

  for (let i = 0; i < 64; i++) {
    let fromIndex, toIndex;

    // Left captures
    fromIndex = i + 7;
    toIndex = i;
    if (
      (leftCapturePositions & (BigInt(1) << BigInt(i))) !== BigInt(0) &&
      (allOccupiedBlackPositions & (BigInt(1) << BigInt(i))) !== BigInt(0)
    ) {
      const newBoardState = applyMove(node.boardState, 64 - fromIndex, 64 - toIndex, 'whitePawn');
      newNodes = pushNewNode(newNodes, node, newBoardState, evalLoggingOff, 0);
    }

    // Right captures
    fromIndex = i + 9;
    toIndex = i;
    if (
      (rightCapturePositions & (BigInt(1) << BigInt(i))) !== BigInt(0) &&
      (allOccupiedBlackPositions & (BigInt(1) << BigInt(i))) !== BigInt(0)
    ) {
      const newBoardState = applyMove(node.boardState, 64 - fromIndex, 64 - toIndex, 'whitePawn');
      newNodes = pushNewNode(newNodes, node, newBoardState, evalLoggingOff, 0);
    }
  }

  return newNodes;
}

export function blackPawnNodes(node: GameNode): GameNode[] {
  const allOccupiedPositions = allPositions(node.boardState);
  const allOccupiedWhitePositions = allWhitePositions(node.boardState);

  const singleStepMoves = blackPawnOneSquareNodes(node, allOccupiedPositions);

  const doubleStepMoves = blackPawnTwoSquareNodes(node, allOccupiedPositions);

  const captures = blackPawnCaptureNodes(node, allOccupiedWhitePositions);

  const enPassantCaptures = blackPawnEnPassantCaptureNodes(node);

  const allMoves = [...singleStepMoves, ...doubleStepMoves, ...captures, ...enPassantCaptures];

  return allMoves;
}

function blackPawnOneSquareNodes(node: GameNode, allOccupiedPositions: bigint): GameNode[] {
  let newNodes: GameNode[] = [];
  const potentialMoves = AllBlackPawnMovesOneSquare(node.boardState, allOccupiedPositions);
  const a1Position = 64;
  const h8Position = 1;
  for (let position = h8Position; position <= a1Position; position++) {
    //create a bitmask of that position
    const positionBit = BigInt(1) << BigInt(position);

    //if position is in the 'all moves' bigint
    if (potentialMoves & positionBit) {
      //add it
      const newBoardState = applyMove(
        node.boardState,
        64 - position + 8,
        64 - position,
        'blackPawn'
      );
      newNodes = pushNewNode(newNodes, node, newBoardState, evalLoggingOff, 0);
    }
  }

  return newNodes;
}

export function blackPawnTwoSquareNodes(node: GameNode, allOccupiedPositions: bigint): GameNode[] {
  let newNodes: GameNode[] = [];
  const potentialTwoStepMoves = AllBlackPawnMovesTwoSquare(node.boardState, allOccupiedPositions);

  const a1Position = 64;
  const h8Position = 1;
  for (let position = h8Position; position <= a1Position; position++) {
    //create a bitmask of that position
    const positionBit = BigInt(1) << BigInt(position);

    //if position is in the 'all moves' bigint
    if (potentialTwoStepMoves & positionBit) {
      //add it
      const newBoardState = applyMove(
        node.boardState,
        64 - position + 16,
        64 - position,
        'blackPawn'
      );
      newNodes = pushNewNode(newNodes, node, newBoardState, evalLoggingOff, 0);
    }
  }

  return newNodes;
}

export function blackPawnEnPassantCaptureNodes(node: GameNode): GameNode[] {
  if (node.gameState.lastWhiteDoublePawnMove === BigInt(0)) {
    return [];
  }
  const possiblePositionForBlackToEnPassantCaptureTo =
    node.gameState.lastWhiteDoublePawnMove << BigInt(8);

  const blackCaptures = blackPawnCaptureNodes(node, possiblePositionForBlackToEnPassantCaptureTo);
  for (const capture of blackCaptures) {
    capture.boardState.whitePawn =
      capture.boardState.whitePawn & ~node.gameState.lastWhiteDoublePawnMove;
  }

  return blackCaptures;
}

export function blackPawnCaptureNodes(
  node: GameNode,
  allOccupiedWhitePositions: bigint
): GameNode[] {
  let newNodes: GameNode[] = [];

  const leftCapturePositions = (node.boardState.blackPawn & ~bTohFilesOnly) << BigInt(9);
  const rightCapturePositions = (node.boardState.blackPawn & ~aTogFilesOnly) << BigInt(7);

  for (let i = 0; i < 64; i++) {
    let fromIndex, toIndex;

    fromIndex = i - 9;
    toIndex = i;
    if (
      (leftCapturePositions & (BigInt(1) << BigInt(i))) !== BigInt(0) &&
      (allOccupiedWhitePositions & (BigInt(1) << BigInt(i))) !== BigInt(0)
    ) {
      const newBoardState = applyMove(node.boardState, 64 - fromIndex, 64 - toIndex, 'blackPawn');
      newNodes = pushNewNode(newNodes, node, newBoardState, evalLoggingOff, 0);
    }

    fromIndex = i - 7;
    toIndex = i;
    if (
      (rightCapturePositions & (BigInt(1) << BigInt(i))) !== BigInt(0) &&
      (allOccupiedWhitePositions & (BigInt(1) << BigInt(i))) !== BigInt(0)
    ) {
      const newBoardState = applyMove(node.boardState, 64 - fromIndex, 64 - toIndex, 'blackPawn');
      newNodes = pushNewNode(newNodes, node, newBoardState, evalLoggingOff, 0);
    }
  }

  return newNodes;
}
