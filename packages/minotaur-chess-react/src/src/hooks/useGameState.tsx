import { BoardMove, GameStatus } from '@karmacarrot/minotaur-chess-engine';

export type GameStatusUpdateAction =
  | { type: 'ADD_MOVE'; move: BoardMove }
  | { type: 'SET_COMPUTER_CONTROL'; color: 'white' | 'black'; value: boolean }
  | { type: 'SET_CHECK'; color: 'white' | 'black'; value: boolean }
  | {
      type: 'SET_CASTLING';
      castling: 'blackLong' | 'blackShort' | 'whiteLong' | 'whiteShort';
      value: boolean;
    }
  | { type: 'SET_GAME_OVER'; value: boolean };

export const gameStatusReducer = (
  state: GameStatus,
  action: GameStatusUpdateAction
): GameStatus => {
  switch (action.type) {
    case 'ADD_MOVE':
      return {
        ...state,
        moveHistory: [...state.moveHistory, action.move],
        isWhitesTurn: !state.isWhitesTurn,
      };
    case 'SET_COMPUTER_CONTROL':
      return {
        ...state,
        [action.color === 'white' ? 'whiteComputerControl' : 'blackComputerControl']: action.value,
      };
    case 'SET_CHECK':
      return {
        ...state,
        [action.color === 'white' ? 'whiteKingChecked' : 'blackKingChecked']: action.value,
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
    default:
      return state;
  }
};