import { getFile, getRank, initBoard, movePiece as movePieceOnBoard } from './board';
import { binaryMask64, getBitBoardPosition, getFileAndRank } from './helpers/bitboards';
import { BoardArrangements, InitialGameStatus } from './helpers/definitions';
import { FindBestMoveMiniMax } from './helpers/moveEval';
import { gameStatusReducer } from './helpers/state/gameState';
import { isOpponentCheckedMemo } from './referee/referee';
import { BitBoard, BoardUpdateResponse, BoardXY, EngineResponse, GameNode, Piece } from './types';

export class MinotaurEngineController {
  currentBoard = initBoard(BoardArrangements.StartingPositions);
  gameStatus = InitialGameStatus;
  dispatch = (action: any) => {
    this.gameStatus = gameStatusReducer(this.gameStatus, action);
  };

  constructor(private engineDepth: number) {}

  resetGame(boardArrangement: BoardArrangements) {
    this.currentBoard = initBoard(boardArrangement);
    this.dispatch({ type: 'RESET_GAME' });
  }

  engineBestMove = async (): Promise<EngineResponse> => {
    const miniMaxResult = await FindBestMoveMiniMax(
      this.currentBoard,
      this.gameStatus,
      this.engineDepth
    );
    const bestMove = miniMaxResult[0];

    const toPosition = getFileAndRank(bestMove.to);
    const fromPosition = getFileAndRank(bestMove.from);

    const moveUpdateResponse = this.movePiece(
      bestMove.piece as Piece,
      fromPosition.rank,
      toPosition.rank,
      fromPosition.file + '',
      toPosition.file + ''
    );

    return { boardUpdateResponse: moveUpdateResponse, bestMove };
  };

  movePiece = (
    piece: Piece,
    fromRank: number,
    toRank: number,
    fromFile: string,
    toFile: string
  ): BoardUpdateResponse | null => {
    if (this.gameStatus.isWhitesTurn && !piece?.toLowerCase().includes('white')) {
      return null;
    }
    if (!this.gameStatus.isWhitesTurn && !piece?.toLowerCase().includes('black')) {
      return null;
    }

    let moveResponse = movePieceOnBoard(
      this.currentBoard,
      piece,
      fromRank,
      fromFile,
      toRank,
      toFile,
      this.gameStatus
    );

    const newPosition = binaryMask64(
      getBitBoardPosition(toFile, toRank),
      'all_zeroes_with_position_as_one'
    );

    if (moveResponse.MoveAttempted.isLegal) {
      //console.log('move piece legal');
      if ((piece === 'whitePawn' || piece === 'blackPawn') && toFile !== fromFile) {
        if (
          !(
            newPosition &
            (this.gameStatus.isWhitesTurn
              ? this.currentBoard.whitePawn
              : this.currentBoard.blackPawn)
          )
          // en passant
        ) {
          const enPassantMask = ~(this.gameStatus.isWhitesTurn
            ? this.gameStatus.lastBlackDoublePawnMove
            : this.gameStatus.lastWhiteDoublePawnMove);

          if (this.gameStatus.isWhitesTurn) {
            moveResponse.BoardState.blackPawn = moveResponse.BoardState.blackPawn & enPassantMask;
          } else {
            moveResponse.BoardState.whitePawn = moveResponse.BoardState.blackPawn & enPassantMask;
          }
        }
      }

      if (
        (piece === 'whitePawn' || piece === 'blackPawn') &&
        (toRank === fromRank + 2 || toRank === fromRank - 2)
      ) {
        this.dispatch({
          type: this.gameStatus.isWhitesTurn
            ? 'lastWhiteDoublePawnMove'
            : 'lastBlackDoublePawnMove',
          move: newPosition,
        });
      } else {
        this.dispatch({
          type: this.gameStatus.isWhitesTurn
            ? 'lastWhiteDoublePawnMove'
            : 'lastBlackDoublePawnMove',
          move: BigInt(0),
        });
      }

      this.currentBoard = moveResponse.BoardState;
      this.dispatch({ type: 'ADD_MOVE', move: moveResponse.MoveAttempted });
      this._updateCheckStatus(this.currentBoard);

      if (moveResponse.CastleLongLost) {
        this.dispatch({
          type: 'SET_CASTLING',
          castling: this._activeColour() + 'Long',
          value: false,
        });
      }
      if (moveResponse.CastleShortLost) {
        this.dispatch({
          type: 'SET_CASTLING',
          castling: this._activeColour() + 'Short',
          value: false,
        });
      }
    }

    return moveResponse;
  };

  private _updateCheckStatus(newBoardState: BitBoard) {
    const turn = this.gameStatus.isWhitesTurn;
    this.dispatch({ type: 'SET_CHECK', colour: 'white', value: false });
    this.dispatch({ type: 'SET_CHECK', colour: 'black', value: false });

    const check1 = isOpponentCheckedMemo(newBoardState, turn).check;
    const check2 = isOpponentCheckedMemo(newBoardState, !turn).check;

    if (check1) this.dispatch({ type: 'SET_CHECK', colour: turn ? 'black' : 'white', value: true });
    if (check2)
      this.dispatch({ type: 'SET_CHECK', colour: !turn ? 'black' : 'white', value: true });
  }

  private _activeColour() {
    return this.gameStatus.isWhitesTurn ? 'white' : 'black';
  }

  getState(): GameNode {
    return {
      boardState: this.currentBoard,
      gameState: this.gameStatus,
      id: '',
      parentId: '',
    };
  }
}
