import { BoardMove, GameStatus, InitialGameStatus } from '@karmacarrot/minotaur-chess-engine';

export type GameStatusUpdateAction =
  | { type: 'ADD_MOVE'; move: BoardMove }
  | { type: 'SET_COMPUTER_CONTROL'; colour: 'white' | 'black'; value: boolean }
  | { type: 'SET_CHECK'; colour: 'white' | 'black'; value: boolean }
  | {
      type: 'SET_CASTLING';
      castling: 'blackLong' | 'blackShort' | 'whiteLong' | 'whiteShort';
      value: boolean;
    }
  | { type: 'SET_GAME_OVER'; value: boolean }
  | {
      type: 'SET_LAST_PAWN_DOUBLE_MOVE';
      colour: 'lastWhiteDoublePawnMove' | 'lastBlackDoublePawnMove';
      value: bigint;
    }
  | { type: 'RESET_GAME' };

export const gameStatusReducer = (
  state: GameStatus,
  action: GameStatusUpdateAction
): GameStatus => {
  switch (action.type) {
    case 'RESET_GAME':
      return {
        ...InitialGameStatus,
      };
    case 'ADD_MOVE':
      return {
        ...state,
        moveHistory: [...state.moveHistory, action.move],
        isWhitesTurn: !state.isWhitesTurn,
      };
    case 'SET_COMPUTER_CONTROL':
      return {
        ...state,
        [action.colour === 'white' ? 'whiteComputerControl' : 'blackComputerControl']: action.value,
      };
    case 'SET_CHECK':
      return {
        ...state,
        [action.colour === 'white' ? 'whiteKingChecked' : 'blackKingChecked']: action.value,
      };
    case 'SET_CASTLING':
      return {
        ...state,
        [action.castling]: action.value,
      };
    case 'SET_GAME_OVER':
      return {
        ...state,
        isGameOver: action.value,
      };
    case 'SET_LAST_PAWN_DOUBLE_MOVE':
      return {
        ...state,
        [action.colour]: action.value,
      };
    default:
      return state;
  }
};
