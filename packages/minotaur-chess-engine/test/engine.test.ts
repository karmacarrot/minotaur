import {
  bitMoveToBoardMove,
  BoardArrangements,
  MinotaurEngineController,
  Piece,
} from '@karmacarrot/minotaur-chess-engine';
import { LogBoardPositions } from './helpers/testHelper';

describe('MinotaurEngineController', () => {
  let controller = new MinotaurEngineController(2);

  beforeEach(() => {
    controller = new MinotaurEngineController(2);
    controller.resetGame(BoardArrangements.StartingPositions);
  });

  it('should initialize the board and game status', () => {
    const state = controller.getState();
    expect(state.boardState).toBeDefined();
    expect(state.gameState.moveHistory).toEqual([]);
  });

  it('should allow a legal move e2 to e4 for white pawn', () => {
    const piece: Piece = 'whitePawn';

    controller.movePiece(
      'whitePawn',
      2,
      4,
      'e',
      'e',
      () => {
        return;
      },
      () => {
        return;
      }
    );
    const state = controller.getState();

    expect(state.gameState.moveHistory).toHaveLength(1);

    const lastMove = state.gameState.moveHistory[0];
    expect(lastMove?.PieceMoved).toBe(piece);
  });

  it('should make a best move using minimax', async () => {
    controller.movePiece(
      'whitePawn',
      2,
      4,
      'e',
      'e',
      () => {
        return;
      },
      () => {
        return;
      }
    );
    const engineResponse = await controller.engineBestMove(
      () => {
        return;
      },
      () => {
        return;
      }
    );
    expect(engineResponse.bestMove.from).toBeGreaterThan(0);
    const state = controller.getState();
    expect(state.gameState.moveHistory).toHaveLength(2);
  });

  it("should make a best move for the colour's turn using minimax agnostic of who has which pieces", async () => {
    const turnsToRunFor = 20;

    const engineResponse = () =>
      controller.engineBestMove(
        () => {
          return;
        },
        () => {
          return;
        }
      );

    for (let i = 0; i < turnsToRunFor; i++) {
      await engineResponse();
    }

    const state = controller.getState();
    expect(state.gameState.moveHistory).toHaveLength(turnsToRunFor);
    LogBoardPositions(state.boardState);
    console.log(state.gameState.moveHistory);
  });
});
