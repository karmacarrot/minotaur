import { BitBoard, GameStatus } from '../../types';
import { bigIntToBinaryString } from '../bitboards';

export function pawnsThatCanCaptureEnpassant(board: BitBoard, gameState: GameStatus): bigint {
  if (
    !gameState.isWhitesTurn &&
    (gameState.lastWhiteDoublePawnMove === null || gameState.lastWhiteDoublePawnMove === BigInt(0))
  ) {
    console.log('no black double pawn move');
    return BigInt(0);
  }
  if (
    gameState.isWhitesTurn &&
    (gameState.lastBlackDoublePawnMove === null || gameState.lastBlackDoublePawnMove === BigInt(0))
  ) {
    //console.log('no white double pawn move');
    return BigInt(0);
  }

  const lastMovedPawn = gameState.isWhitesTurn
    ? gameState.lastBlackDoublePawnMove
    : gameState.lastWhiteDoublePawnMove;

  const canEnPassantPawnLeft = gameState.isWhitesTurn
    ? lastMovedPawn << BigInt(1)
    : lastMovedPawn >> BigInt(-1);
  const canEnPassantPawnRight = gameState.isWhitesTurn
    ? lastMovedPawn << BigInt(-1)
    : lastMovedPawn >> BigInt(1);
  const canEnPassantPawns = canEnPassantPawnLeft | canEnPassantPawnRight;

  // console.log(
  //   'returning pawns that can capture enpassant',
  //   bigIntToBinaryString(
  //     canEnPassantPawns & (gameState.isWhitesTurn ? board.whitePawn : board.blackPawn)
  //   )
  // );
  return canEnPassantPawns & (gameState.isWhitesTurn ? board.whitePawn : board.blackPawn);
}
