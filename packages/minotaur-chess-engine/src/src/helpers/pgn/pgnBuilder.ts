import { movePiece } from '../../board';
import { MinotaurEngineController } from '../../engine';
import { BoardMove, GameNode, PgnMovesAndResult, BitBoard, GameStatus } from '../../types';
import {
  allBlackPositions,
  allWhitePositions,
  bigIntToBinaryString,
  binaryMask64,
  findBitPosition,
  getBitBoardPosition,
  getFileAndRank,
  occupiedBy,
} from '../bitboards';
import { BoardArrangements } from '../definitions';
import { normalizedLineEndings, splitOnCarriageReturnsAndSpaces } from '../generic';
import { AllKnightMoves } from '../moveEval';
import { parseSan } from '../san/sanHelper';
import { StartingNode } from '../search/nodes/nodeGenerators';

const gameResults = ['1/2-1/2'];

export const cleanPGN = (pgnToClean: string) => {
  return stripCommentsFromPGN(stripTagsFromPGN(normalizedLineEndings(pgnToClean)));
};

export function pgnInit(
  event: string,
  site: string,
  date: Date,
  round: string,
  white: string,
  black: string,
  result: string
) {
  let sevenTagRoster = '';
  sevenTagRoster += `[Event "${event}"]\n`;
  sevenTagRoster += `[Site "${site}"]\n`;
  sevenTagRoster += `[Date "${formatDateForPGN(date)}"]\n`;
  sevenTagRoster += `[Round "${round}"]\n`;
  sevenTagRoster += `[White "${white}"]\n`;
  sevenTagRoster += `[Black "${black}"]\n`;
  sevenTagRoster += `[Result "${result}"]\n`;

  return sevenTagRoster;
}

export function pgnMoveToBoardMove(
  pgnMove: string,
  boardPositions: BitBoard,
  gameStatus: GameStatus
): BoardMove | null {
  const parsedSAN = parseSan(pgnMove);

  console.log(`parsed san: ${JSON.stringify(parsedSAN)}`);

  if (parsedSAN === null) {
    return {
      PieceMoved: null,
      PieceTaken: null,
      FileFrom: '',
      FileTo: '',
      CastleRookFrom: '',
      CastleRookTo: '',
      RankFrom: 0,
      RankTo: 0,
      isLegal: false,
    };
  }

  let toFile = '';
  let toRank = 0;

  toFile = parsedSAN.targetFile;
  toRank = parsedSAN.targetRank;

  if (
    parsedSAN.disambiguationFile + '' === '' ||
    parsedSAN.disambiguationRank === undefined ||
    parsedSAN.disambiguationRank === 0
  ) {
    //figure out where it moved from
    //look at all moves for that piece in the current board state
    //match the one that moves to the same place this move does
    //return the starting position
  }

  const toPositionAsNumber = getBitBoardPosition(toFile, toRank);
  const fromPositionAsNumber = getBitBoardPosition(
    parsedSAN.disambiguationFile + '',
    parsedSAN.disambiguationRank ? parsedSAN.disambiguationRank : 0
  );
  // toPositionAsNumber = getBitBoardPosition(toFile, toRank);
  // let fromPosition = evaluateAsWhite ? toPositionAsNumber - 8 : toPositionAsNumber + 8;
  let pieceMoved = occupiedBy(boardPositions, fromPositionAsNumber);

  // if (pieceMoved === null) {
  //   fromPosition = evaluateAsWhite ? toPositionAsNumber - 16 : toPositionAsNumber + 16;
  //   pieceMoved = occupiedBy(boardPositions, fromPosition);
  // }

  // const fromFileAndRank = getFileAndRank(fromPosition);

  let moveResponse = movePiece(
    boardPositions,
    pieceMoved,
    parsedSAN.disambiguationRank ? parsedSAN.disambiguationRank : 0,
    parsedSAN.disambiguationFile + '',
    toRank,
    toFile,
    gameStatus
  );

  return moveResponse.MoveAttempted;
}

export function parseMovesAndResult(pgnToParse: string): PgnMovesAndResult {
  let movesArray = [];
  let result = '';
  let pgnClean = cleanPGN(pgnToParse);

  const splitPGN = splitOnCarriageReturnsAndSpaces(pgnClean);
  let bothMovedNumber = 0;
  let currentMove = '';

  for (let i = 0; i < splitPGN.length; i++) {
    currentMove = '';
    if (splitPGN[i]?.includes('.')) {
      const numberSplit = splitPGN[i]?.split('.');

      if (numberSplit && numberSplit.length === 2) {
        bothMovedNumber = numberSplit[0] ? parseInt(numberSplit[0]) : 0;
        currentMove = numberSplit[1] ? numberSplit[1] : '';
      }
    } else {
      currentMove = splitPGN[i] + '';
    }

    if (currentMove !== '' && !gameResults.includes(currentMove)) {
      movesArray.push(currentMove);
    }
    if (currentMove !== '' && gameResults.includes(currentMove)) {
      result = currentMove;
    }
  }

  return { moves: movesArray, result };
}

export function pgnToGameNode(pgnToParse: string): GameNode {
  let node = StartingNode();
  let controller = new MinotaurEngineController(2);
  controller = new MinotaurEngineController(2);
  controller.resetGame(BoardArrangements.StartingPositions);

  const parsedMoves = parseMovesAndResult(pgnToParse);

  parsedMoves.moves.forEach((move) => {});

  console.log(parsedMoves);

  const state = controller.getState();

  node.boardState = state.boardState;
  node.gameState = state.gameState;
  return node;
}

export function addMoveToPGN(currentPGN: string, move: BoardMove, moveNumber: number) {
  let newPGN = currentPGN;

  if (moveNumber === 0) {
    newPGN += `\n`;
  }

  newPGN += `${moveNumber}. \n`;
  return currentPGN;
}

const formatDateForPGN = (date: Date) =>
  `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')}`;

export function stripCommentsFromPGN(pgnToStrip: string) {
  const commentsExpression = /\{[^}]*\}/g;

  let strippedPGN = pgnToStrip.replaceAll(commentsExpression, ' ');
  strippedPGN = strippedPGN.replaceAll('...', '.');

  return strippedPGN;
}

export function stripTagsFromPGN(pgnToStrip: string) {
  const tagsExpression = /\[.*?\]/g;
  let strippedPGN = pgnToStrip.replaceAll(tagsExpression, ' ');

  strippedPGN = strippedPGN.replaceAll(/\r\n/g, ' ');
  strippedPGN = strippedPGN.replaceAll(/\n/g, ' ');
  return strippedPGN;
}
