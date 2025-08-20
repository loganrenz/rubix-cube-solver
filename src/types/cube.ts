// Cube face colors
export enum Color {
  WHITE = 'white',
  YELLOW = 'yellow',
  RED = 'red',
  ORANGE = 'orange',
  GREEN = 'green',
  BLUE = 'blue',
}

// Face positions
export enum Face {
  FRONT = 'F',
  BACK = 'B',
  UP = 'U',
  DOWN = 'D',
  LEFT = 'L',
  RIGHT = 'R',
}

// Possible moves
export enum Move {
  F = 'F',
  F_PRIME = "F'",
  F2 = 'F2',
  B = 'B',
  B_PRIME = "B'",
  B2 = 'B2',
  U = 'U',
  U_PRIME = "U'",
  U2 = 'U2',
  D = 'D',
  D_PRIME = "D'",
  D2 = 'D2',
  L = 'L',
  L_PRIME = "L'",
  L2 = 'L2',
  R = 'R',
  R_PRIME = "R'",
  R2 = 'R2',
  // Slice moves
  M = 'M',
  M_PRIME = "M'",
  M2 = 'M2',
  E = 'E',
  E_PRIME = "E'",
  E2 = 'E2',
  S = 'S',
  S_PRIME = "S'",
  S2 = 'S2',
  // Wide moves
  x = 'x',
  x_PRIME = "x'",
  x2 = 'x2',
  y = 'y',
  y_PRIME = "y'",
  y2 = 'y2',
  z = 'z',
  z_PRIME = "z'",
  z2 = 'z2',
}

// Cube face interface (3x3 grid)
export interface CubeFace {
  colors: Color[][];
}

// Complete cube state
export interface CubeState {
  front: CubeFace;
  back: CubeFace;
  up: CubeFace;
  down: CubeFace;
  left: CubeFace;
  right: CubeFace;
}

// Solution step
export interface SolutionStep {
  move: Move;
  description?: string;
  stage?: string;
}

// Solver result
export interface SolverResult {
  solved: boolean;
  steps: SolutionStep[];
  moveCount: number;
  error?: string;
}

// Animation state
export interface AnimationState {
  isAnimating: boolean;
  currentStep: number;
  speed: number; // milliseconds per move
  isPaused: boolean;
}

// Touch gesture data
export interface TouchGesture {
  startX: number;
  startY: number;
  startTime: number;
  face?: Face;
  direction?: 'horizontal' | 'vertical';
}
