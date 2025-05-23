import { isOpponentCheckedMemo } from '../../../referee/referee';
import { BitBoard, EvalLogs, GameNode, GameStatus } from '../../../types';
import { InitialGameStatus, StartingBoard, evalLoggingOff } from '../../definitions';
import { bishopNodes } from './bishops/bishopNodes';
import { kingCastlingNodes, kingNodes } from './king/kingNodes';
import { knightNodes } from './knights/knightNodes';
import { blackPawnNodes, whitePawnNodes } from './pawns/pawnNodes';
import { queenNodes } from './queens/queenNodes';
import { rookNodes } from './rooks/rookNodes';

export function pushNewNode(
  currentNodeList: GameNode[],
  parentNode: GameNode,
  newBoardState: BitBoard,
  evalLogs: EvalLogs,
  depth: number
) {
  const newGameState = {
    ...parentNode.gameState,
    isWhitesTurn: !parentNode.gameState.isWhitesTurn,
  };

  // const movingPlayerCurrentCheckStatus = isOpponentCheckedMemo(
  //   parentNode.boardState,
  //   !parentNode.gameState.isWhitesTurn
  // );

  const movingPlayerProposedCheckStatus = isOpponentCheckedMemo(
    newBoardState,
    !parentNode.gameState.isWhitesTurn
  );

  if (movingPlayerProposedCheckStatus.check) {
    return currentNodeList;
  }

  const newNode = {
    boardState: newBoardState,
    gameState: newGameState,
    parentId: parentNode.id,
    id: generateNodeId(),
  };
  currentNodeList.push(newNode);

  if (evalLogs.evalLoggingEnabled) {
    evalLogs.evalAddNode(newNode, depth);
  }

  return currentNodeList;
}

export function generateLegalMoves(node: GameNode): GameNode[] {
  if (node.gameState.isWhitesTurn) {
    const whitePawns = whitePawnNodes(node);
    const whiteKnights = knightNodes(node, evalLoggingOff);
    const whiteBishops = bishopNodes(node, evalLoggingOff);
    const whiteRooks = rookNodes(node, evalLoggingOff);
    const whiteKing = kingNodes(node, evalLoggingOff);
    const whiteKingCastles = kingCastlingNodes(node, evalLoggingOff);
    const whiteQueen = queenNodes(node, evalLoggingOff);
    //TODO: add other pieces

    return [
      ...whitePawns,
      ...whiteKnights,
      ...whiteBishops,
      ...whiteRooks,
      ...whiteKing,
      ...whiteQueen,
      ...whiteKingCastles,
    ];
  }
  const blackPawns = blackPawnNodes(node);
  const blackKnights = knightNodes(node, evalLoggingOff);
  const blackBishop = bishopNodes(node, evalLoggingOff);
  const blackRooks = rookNodes(node, evalLoggingOff);
  const blackKing = kingNodes(node, evalLoggingOff);
  const blackKingCastles = kingCastlingNodes(node, evalLoggingOff);
  const blackQueen = queenNodes(node, evalLoggingOff);
  //TODO: add other pieces
  return [
    ...blackPawns,
    ...blackKnights,
    ...blackBishop,
    ...blackRooks,
    ...blackKing,
    ...blackQueen,
    ...blackKingCastles,
  ];
}

export function generateNodeId(): string {
  return crypto.randomUUID();
}

export function StartingNode() {
  const startBoard = { ...StartingBoard };
  const startStatus = { ...InitialGameStatus };
  const startNode = {
    boardState: startBoard,
    gameState: startStatus,
    parentId: '',
    id: generateNodeId(),
  };
  return startNode;
}

export function NodeFactory(parentNode: GameNode, newBoardState: BitBoard) {
  const newGameState: GameStatus = {
    ...parentNode.gameState,
  };
  newGameState.isWhitesTurn = !parentNode.gameState.isWhitesTurn;
  const newNode: GameNode = {
    parentId: parentNode.id,
    boardState: newBoardState,
    gameState: newGameState,
    id: generateNodeId(),
  };
  return newNode;
}
