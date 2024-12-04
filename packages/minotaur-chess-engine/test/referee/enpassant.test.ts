import {
  pawnsThatCanCaptureEnpassant,
  EnPassantBoard,
  InitialGameStatus,
  StartingBoard,
} from '@karmacarrot/minotaur-chess-engine';

describe('canEnpassant', () => {
  it('should return no pieces if it is whites turn and lastWhiteDoublePawnMove is zero', () => {
    const startGameState = { ...InitialGameStatus };
    startGameState.isWhitesTurn = true;
    startGameState.lastWhiteDoublePawnMove = BigInt(0);
    expect(pawnsThatCanCaptureEnpassant(StartingBoard, startGameState)).toBe(BigInt(0));
  });
  it('should return no pieces if it is not whites turn and lastBlackDoublePawnMove is zero', () => {
    const startGameState = { ...InitialGameStatus };
    startGameState.isWhitesTurn = false;
    startGameState.lastBlackDoublePawnMove = BigInt(0);
    expect(pawnsThatCanCaptureEnpassant(StartingBoard, startGameState)).toBe(BigInt(0));
  });
  it('should return two pawns if it is whites turn, black did a double pawn move to be level with 2 white pawns which could capture it', () => {
    const startGameState = { ...InitialGameStatus };
    const movedBlackPawn = BigInt(
      '0b0000000000000000000000000000000000000100000000000000000000000000'
    );
    startGameState.isWhitesTurn = true;
    startGameState.lastBlackDoublePawnMove = movedBlackPawn;
    const pawns = pawnsThatCanCaptureEnpassant(EnPassantBoard, startGameState);
    expect(pawns).toBe(
      BigInt('0b0000000000000000000000000000000000001010000000000000000000000000')
    );
  });
  it('should return one pawn if it is blacks turn, white did a double pawn move to be level with a white pawn which could capture it', () => {
    const startGameState = { ...InitialGameStatus };
    const movedWhitePawn = BigInt(
      '0b0000000000000000000000001000000000000000000000000000000000000000'
    );
    startGameState.isWhitesTurn = false;
    startGameState.lastWhiteDoublePawnMove = movedWhitePawn;
    const pawns = pawnsThatCanCaptureEnpassant(EnPassantBoard, startGameState);
    expect(pawns).toBe(
      BigInt('0b0000000000000000000000000100000000000000000000000000000000000000')
    );
  });
});
