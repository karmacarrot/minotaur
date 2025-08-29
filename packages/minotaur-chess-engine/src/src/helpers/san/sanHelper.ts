import { SAN } from '../../types';

export function matchSan(san: string): RegExpMatchArray | null {
  const regex = /^([NBRQK]?)([a-h]?)([1-8]?)(x?)([a-h])([1-8])(=?[NBRQ]?)([+#]?)$/;
  const match = san.match(regex);

  return match;
}

export function parseSan(san: string): SAN {
  const trimmedSan = san.trim();

  const castlingKingside = trimmedSan === 'O-O' || trimmedSan === '0-0';
  const castlingQueenside = trimmedSan === 'O-O-O' || trimmedSan === '0-0-0';

  if (castlingKingside || castlingQueenside) {
    return {
      piece: 'K',
      targetFile: '',
      targetRank: 0,
      isCapture: false,
      isCastleKingside: castlingKingside,
      isCastleQueenside: castlingQueenside,
      isCheck: false,
      isMate: false,
    };
  }

  const match = matchSan(trimmedSan);

  if (!match) throw new Error(`Could not parse SAN move: ${trimmedSan}`);

  const [_, piece, disFile, disRank, capture, targetFile, targetRank, promotion, checkOrMate] =
    match;

  return {
    piece: piece || 'P',
    targetFile: targetFile + '',
    targetRank: parseInt(targetRank + '', 10),
    disambiguationFile: disFile || undefined,
    disambiguationRank: disRank ? parseInt(disRank, 10) : undefined,
    isCapture: capture === 'x',
    isCastleKingside: false,
    isCastleQueenside: false,
    promotion: promotion?.replace('=', '') || undefined,
    isCheck: checkOrMate === '+',
    isMate: checkOrMate === '#',
  };
}
