import { MinotaurEngineController } from '../../engine';
import { BoardMove, GameNode, PgnMovesAndResult, BitBoard } from '../../types';
import {
  allBlackPositions,
  allWhitePositions,
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
  evaluateAsWhite: boolean
): BoardMove | null {
  const parsedSAN = parseSan(pgnMove);

  if (parseSan === null) {
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
  let toRank = '';
  let positionAsNumber = 0;

  const allFriendlyOccupiedPositions = evaluateAsWhite
    ? allWhitePositions(boardPositions)
    : allBlackPositions(boardPositions);

  switch (parsedSAN?.piece) {
    case 'P':
      //pawn move
      toFile = pgnMove.substring(0, 1);
      toRank = pgnMove.substring(1, 2);
      positionAsNumber = getBitBoardPosition(toFile, parseInt(toRank));
      let fromPosition = evaluateAsWhite ? positionAsNumber - 8 : positionAsNumber + 8;
      let pieceMoved = occupiedBy(boardPositions, fromPosition);

      if (pieceMoved === null) {
        fromPosition = evaluateAsWhite ? positionAsNumber - 16 : positionAsNumber + 16;
        pieceMoved = occupiedBy(boardPositions, fromPosition);
      }

      const fromFileAndRank = getFileAndRank(fromPosition);

      return {
        PieceMoved: pieceMoved,
        PieceTaken: null,
        FileFrom: fromFileAndRank.file + '',
        FileTo: toFile,
        CastleRookFrom: '',
        CastleRookTo: '',
        RankFrom: fromFileAndRank.rank,
        RankTo: parseInt(toRank),
        isLegal: true,
      };

    case 'N':
      //knight move
      toFile = pgnMove.substring(1, 2);
      toRank = pgnMove.substring(2, 3);
      positionAsNumber = getBitBoardPosition(toFile, parseInt(toRank));

      const allKnightMoves = AllKnightMoves(boardPositions);

      const fromFileAndRankKnight = getFileAndRank(fromPosition);

      return {
        PieceMoved: pieceMoved,
        PieceTaken: null,
        FileFrom: fromFileAndRankKnight.file + '',
        FileTo: toFile,
        CastleRookFrom: '',
        CastleRookTo: '',
        RankFrom: fromFileAndRankKnight.rank,
        RankTo: parseInt(toRank),
        isLegal: true,
      };
  }

  return null;
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
