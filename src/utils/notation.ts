import { Move } from '../types/cube';

export const moveToString = (move: Move): string => {
  return move;
};

export const stringToMove = (str: string): Move | null => {
  if (Object.values(Move).includes(str as Move)) {
    return str as Move;
  }
  return null;
};

export const parseMoveSequence = (sequence: string): Move[] => {
  const moves: Move[] = [];
  const tokens = sequence.split(/\s+/).filter((t) => t.length > 0);

  for (const token of tokens) {
    const move = stringToMove(token);
    if (move) {
      moves.push(move);
    }
  }

  return moves;
};

export const movesToString = (moves: Move[]): string => {
  return moves.map(moveToString).join(' ');
};

export const getOppositeMove = (move: Move): Move => {
  if (move.includes("'")) {
    return move.replace("'", '') as Move;
  } else if (move.includes('2')) {
    return move;
  } else {
    return (move + "'") as Move;
  }
};

export const simplifyMoves = (moves: Move[]): Move[] => {
  const simplified: Move[] = [];

  for (const move of moves) {
    if (simplified.length === 0) {
      simplified.push(move);
      continue;
    }

    const lastMove = simplified[simplified.length - 1];
    const baseMove = move.replace(/['2]/g, '');
    const lastBaseMove = lastMove.replace(/['2]/g, '');

    if (baseMove === lastBaseMove) {
      // Same face moves can be combined
      const combined = combineMoves(lastMove, move);
      if (combined) {
        simplified[simplified.length - 1] = combined;
      } else {
        // Moves cancel out
        simplified.pop();
      }
    } else {
      simplified.push(move);
    }
  }

  return simplified;
};

const combineMoves = (move1: Move, move2: Move): Move | null => {
  const base = move1.replace(/['2]/g, '');

  const move1Count = move1.includes('2') ? 2 : move1.includes("'") ? -1 : 1;
  const move2Count = move2.includes('2') ? 2 : move2.includes("'") ? -1 : 1;

  const totalCount = (move1Count + move2Count) % 4;

  switch (totalCount) {
    case 0:
    case 4:
      return null; // Moves cancel out
    case 1:
      return base as Move;
    case -1:
    case 3:
      return (base + "'") as Move;
    case 2:
    case -2:
      return (base + '2') as Move;
    default:
      return move2;
  }
};

export const moveNotationInfo = {
  basic: {
    F: 'Front face clockwise',
    "F'": 'Front face counter-clockwise',
    F2: 'Front face 180 degrees',
    B: 'Back face clockwise',
    "B'": 'Back face counter-clockwise',
    B2: 'Back face 180 degrees',
    U: 'Up (top) face clockwise',
    "U'": 'Up (top) face counter-clockwise',
    U2: 'Up (top) face 180 degrees',
    D: 'Down (bottom) face clockwise',
    "D'": 'Down (bottom) face counter-clockwise',
    D2: 'Down (bottom) face 180 degrees',
    L: 'Left face clockwise',
    "L'": 'Left face counter-clockwise',
    L2: 'Left face 180 degrees',
    R: 'Right face clockwise',
    "R'": 'Right face counter-clockwise',
    R2: 'Right face 180 degrees',
  },
  advanced: {
    M: 'Middle slice (follows L direction)',
    "M'": 'Middle slice counter-clockwise',
    M2: 'Middle slice 180 degrees',
    E: 'Equatorial slice (follows D direction)',
    "E'": 'Equatorial slice counter-clockwise',
    E2: 'Equatorial slice 180 degrees',
    S: 'Standing slice (follows F direction)',
    "S'": 'Standing slice counter-clockwise',
    S2: 'Standing slice 180 degrees',
    x: 'Rotate entire cube on R axis',
    "x'": 'Rotate entire cube on R axis (reverse)',
    x2: 'Rotate entire cube on R axis 180 degrees',
    y: 'Rotate entire cube on U axis',
    "y'": 'Rotate entire cube on U axis (reverse)',
    y2: 'Rotate entire cube on U axis 180 degrees',
    z: 'Rotate entire cube on F axis',
    "z'": 'Rotate entire cube on F axis (reverse)',
    z2: 'Rotate entire cube on F axis 180 degrees',
  },
};

export const commonAlgorithms = {
  sexy: {
    moves: "R U R' U'",
    description: 'Right hand algorithm - very common',
  },
  sune: {
    moves: "R U R' U R U2 R'",
    description: 'Orients corners on last layer',
  },
  antisune: {
    moves: "R U2 R' U' R U' R'",
    description: 'Reverse of Sune algorithm',
  },
  tperm: {
    moves: "R U R' U' R' F R2 U' R' U' R U R' F'",
    description: 'Swaps two adjacent corners and edges',
  },
  yperm: {
    moves: "F R U' R' U' R U R' F' R U R' U' R' F R F'",
    description: 'Diagonal corner swap + edge swap',
  },
};
