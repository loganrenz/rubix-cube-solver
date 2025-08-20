import { Color, Face, Move } from '../types/cube';
import type { CubeState, CubeFace } from '../types/cube';

export class CubeModel {
  private state: CubeState;

  constructor(state?: CubeState) {
    this.state = state || this.createSolvedCube();
  }

  // Create a solved cube
  private createSolvedCube(): CubeState {
    return {
      front: this.createFace(Color.GREEN),
      back: this.createFace(Color.BLUE),
      up: this.createFace(Color.WHITE),
      down: this.createFace(Color.YELLOW),
      left: this.createFace(Color.ORANGE),
      right: this.createFace(Color.RED),
    };
  }

  // Create a face with a single color
  private createFace(color: Color): CubeFace {
    return {
      colors: [
        [color, color, color],
        [color, color, color],
        [color, color, color],
      ],
    };
  }

  // Get current state
  getState(): CubeState {
    return JSON.parse(JSON.stringify(this.state));
  }

  // Set state
  setState(state: CubeState): void {
    this.state = JSON.parse(JSON.stringify(state));
  }

  // Check if cube is solved
  isSolved(): boolean {
    const faces = [
      this.state.front,
      this.state.back,
      this.state.up,
      this.state.down,
      this.state.left,
      this.state.right,
    ];

    return faces.every((face) => {
      const firstColor = face.colors[0][0];
      return face.colors.every((row) => row.every((color) => color === firstColor));
    });
  }

  // Apply a move
  applyMove(move: Move): void {
    switch (move) {
      case Move.F:
        this.rotateFrontClockwise();
        break;
      case Move.F_PRIME:
        this.rotateFrontCounterClockwise();
        break;
      case Move.F2:
        this.rotateFrontClockwise();
        this.rotateFrontClockwise();
        break;
      case Move.B:
        this.rotateBackClockwise();
        break;
      case Move.B_PRIME:
        this.rotateBackCounterClockwise();
        break;
      case Move.B2:
        this.rotateBackClockwise();
        this.rotateBackClockwise();
        break;
      case Move.U:
        this.rotateUpClockwise();
        break;
      case Move.U_PRIME:
        this.rotateUpCounterClockwise();
        break;
      case Move.U2:
        this.rotateUpClockwise();
        this.rotateUpClockwise();
        break;
      case Move.D:
        this.rotateDownClockwise();
        break;
      case Move.D_PRIME:
        this.rotateDownCounterClockwise();
        break;
      case Move.D2:
        this.rotateDownClockwise();
        this.rotateDownClockwise();
        break;
      case Move.L:
        this.rotateLeftClockwise();
        break;
      case Move.L_PRIME:
        this.rotateLeftCounterClockwise();
        break;
      case Move.L2:
        this.rotateLeftClockwise();
        this.rotateLeftClockwise();
        break;
      case Move.R:
        this.rotateRightClockwise();
        break;
      case Move.R_PRIME:
        this.rotateRightCounterClockwise();
        break;
      case Move.R2:
        this.rotateRightClockwise();
        this.rotateRightClockwise();
        break;
      case Move.M:
        this.rotateMiddleClockwise();
        break;
      case Move.M_PRIME:
        this.rotateMiddleCounterClockwise();
        break;
      case Move.M2:
        this.rotateMiddleClockwise();
        this.rotateMiddleClockwise();
        break;
      case Move.x:
        this.rotateX();
        break;
      case Move.x_PRIME:
        this.rotateXPrime();
        break;
      case Move.x2:
        this.rotateX();
        this.rotateX();
        break;
      case Move.y:
        this.rotateY();
        break;
      case Move.y_PRIME:
        this.rotateYPrime();
        break;
      case Move.y2:
        this.rotateY();
        this.rotateY();
        break;
      case Move.z:
        this.rotateZ();
        break;
      case Move.z_PRIME:
        this.rotateZPrime();
        break;
      case Move.z2:
        this.rotateZ();
        this.rotateZ();
        break;
    }
  }

  // Apply multiple moves
  applyMoves(moves: Move[]): void {
    moves.forEach((move) => this.applyMove(move));
  }

  // Rotate a face 90 degrees clockwise
  private rotateFaceClockwise(face: CubeFace): void {
    const n = face.colors.length;
    const rotated: Color[][] = [];
    for (let i = 0; i < n; i++) {
      rotated[i] = Array(n);
    }

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        rotated[j][n - 1 - i] = face.colors[i][j];
      }
    }

    face.colors = rotated;
  }

  // Rotate a face 90 degrees counter-clockwise
  private rotateFaceCounterClockwise(face: CubeFace): void {
    this.rotateFaceClockwise(face);
    this.rotateFaceClockwise(face);
    this.rotateFaceClockwise(face);
  }

  // Front face rotations
  private rotateFrontClockwise(): void {
    this.rotateFaceClockwise(this.state.front);

    const temp = [...this.state.up.colors[2]];
    this.state.up.colors[2][0] = this.state.left.colors[2][2];
    this.state.up.colors[2][1] = this.state.left.colors[1][2];
    this.state.up.colors[2][2] = this.state.left.colors[0][2];

    this.state.left.colors[0][2] = this.state.down.colors[0][0];
    this.state.left.colors[1][2] = this.state.down.colors[0][1];
    this.state.left.colors[2][2] = this.state.down.colors[0][2];

    this.state.down.colors[0][0] = this.state.right.colors[2][0];
    this.state.down.colors[0][1] = this.state.right.colors[1][0];
    this.state.down.colors[0][2] = this.state.right.colors[0][0];

    this.state.right.colors[0][0] = temp[0];
    this.state.right.colors[1][0] = temp[1];
    this.state.right.colors[2][0] = temp[2];
  }

  private rotateFrontCounterClockwise(): void {
    this.rotateFrontClockwise();
    this.rotateFrontClockwise();
    this.rotateFrontClockwise();
  }

  // Back face rotations
  private rotateBackClockwise(): void {
    this.rotateFaceClockwise(this.state.back);

    const temp = [...this.state.up.colors[0]];
    this.state.up.colors[0][0] = this.state.right.colors[0][2];
    this.state.up.colors[0][1] = this.state.right.colors[1][2];
    this.state.up.colors[0][2] = this.state.right.colors[2][2];

    this.state.right.colors[0][2] = this.state.down.colors[2][2];
    this.state.right.colors[1][2] = this.state.down.colors[2][1];
    this.state.right.colors[2][2] = this.state.down.colors[2][0];

    this.state.down.colors[2][0] = this.state.left.colors[0][0];
    this.state.down.colors[2][1] = this.state.left.colors[1][0];
    this.state.down.colors[2][2] = this.state.left.colors[2][0];

    this.state.left.colors[0][0] = temp[2];
    this.state.left.colors[1][0] = temp[1];
    this.state.left.colors[2][0] = temp[0];
  }

  private rotateBackCounterClockwise(): void {
    this.rotateBackClockwise();
    this.rotateBackClockwise();
    this.rotateBackClockwise();
  }

  // Up face rotations
  private rotateUpClockwise(): void {
    this.rotateFaceClockwise(this.state.up);

    const temp = [...this.state.front.colors[0]];
    this.state.front.colors[0] = [...this.state.right.colors[0]];
    this.state.right.colors[0] = [...this.state.back.colors[0]];
    this.state.back.colors[0] = [...this.state.left.colors[0]];
    this.state.left.colors[0] = temp;
  }

  private rotateUpCounterClockwise(): void {
    this.rotateUpClockwise();
    this.rotateUpClockwise();
    this.rotateUpClockwise();
  }

  // Down face rotations
  private rotateDownClockwise(): void {
    this.rotateFaceClockwise(this.state.down);

    const temp = [...this.state.front.colors[2]];
    this.state.front.colors[2] = [...this.state.left.colors[2]];
    this.state.left.colors[2] = [...this.state.back.colors[2]];
    this.state.back.colors[2] = [...this.state.right.colors[2]];
    this.state.right.colors[2] = temp;
  }

  private rotateDownCounterClockwise(): void {
    this.rotateDownClockwise();
    this.rotateDownClockwise();
    this.rotateDownClockwise();
  }

  // Left face rotations
  private rotateLeftClockwise(): void {
    this.rotateFaceClockwise(this.state.left);

    const temp = [
      this.state.up.colors[0][0],
      this.state.up.colors[1][0],
      this.state.up.colors[2][0],
    ];

    this.state.up.colors[0][0] = this.state.back.colors[2][2];
    this.state.up.colors[1][0] = this.state.back.colors[1][2];
    this.state.up.colors[2][0] = this.state.back.colors[0][2];

    this.state.back.colors[0][2] = this.state.down.colors[2][0];
    this.state.back.colors[1][2] = this.state.down.colors[1][0];
    this.state.back.colors[2][2] = this.state.down.colors[0][0];

    this.state.down.colors[0][0] = this.state.front.colors[0][0];
    this.state.down.colors[1][0] = this.state.front.colors[1][0];
    this.state.down.colors[2][0] = this.state.front.colors[2][0];

    this.state.front.colors[0][0] = temp[0];
    this.state.front.colors[1][0] = temp[1];
    this.state.front.colors[2][0] = temp[2];
  }

  private rotateLeftCounterClockwise(): void {
    this.rotateLeftClockwise();
    this.rotateLeftClockwise();
    this.rotateLeftClockwise();
  }

  // Right face rotations
  private rotateRightClockwise(): void {
    this.rotateFaceClockwise(this.state.right);

    const temp = [
      this.state.up.colors[0][2],
      this.state.up.colors[1][2],
      this.state.up.colors[2][2],
    ];

    this.state.up.colors[0][2] = this.state.front.colors[0][2];
    this.state.up.colors[1][2] = this.state.front.colors[1][2];
    this.state.up.colors[2][2] = this.state.front.colors[2][2];

    this.state.front.colors[0][2] = this.state.down.colors[0][2];
    this.state.front.colors[1][2] = this.state.down.colors[1][2];
    this.state.front.colors[2][2] = this.state.down.colors[2][2];

    this.state.down.colors[0][2] = this.state.back.colors[2][0];
    this.state.down.colors[1][2] = this.state.back.colors[1][0];
    this.state.down.colors[2][2] = this.state.back.colors[0][0];

    this.state.back.colors[0][0] = temp[2];
    this.state.back.colors[1][0] = temp[1];
    this.state.back.colors[2][0] = temp[0];
  }

  private rotateRightCounterClockwise(): void {
    this.rotateRightClockwise();
    this.rotateRightClockwise();
    this.rotateRightClockwise();
  }

  // Middle slice move (follows L direction)
  private rotateMiddleClockwise(): void {
    const temp = [
      this.state.up.colors[0][1],
      this.state.up.colors[1][1],
      this.state.up.colors[2][1],
    ];

    this.state.up.colors[0][1] = this.state.back.colors[2][1];
    this.state.up.colors[1][1] = this.state.back.colors[1][1];
    this.state.up.colors[2][1] = this.state.back.colors[0][1];

    this.state.back.colors[0][1] = this.state.down.colors[2][1];
    this.state.back.colors[1][1] = this.state.down.colors[1][1];
    this.state.back.colors[2][1] = this.state.down.colors[0][1];

    this.state.down.colors[0][1] = this.state.front.colors[0][1];
    this.state.down.colors[1][1] = this.state.front.colors[1][1];
    this.state.down.colors[2][1] = this.state.front.colors[2][1];

    this.state.front.colors[0][1] = temp[0];
    this.state.front.colors[1][1] = temp[1];
    this.state.front.colors[2][1] = temp[2];
  }

  private rotateMiddleCounterClockwise(): void {
    this.rotateMiddleClockwise();
    this.rotateMiddleClockwise();
    this.rotateMiddleClockwise();
  }

  // X rotation (R direction)
  private rotateX(): void {
    this.rotateRightClockwise();
    this.rotateMiddleCounterClockwise();
    this.rotateLeftCounterClockwise();
  }

  private rotateXPrime(): void {
    this.rotateRightCounterClockwise();
    this.rotateMiddleClockwise();
    this.rotateLeftClockwise();
  }

  // Y rotation (U direction)
  private rotateY(): void {
    const tempState = JSON.parse(JSON.stringify(this.state));

    this.state.front = tempState.right;
    this.state.left = tempState.front;
    this.state.back = tempState.left;
    this.state.right = tempState.back;

    this.rotateFaceClockwise(this.state.up);
    this.rotateFaceCounterClockwise(this.state.down);
  }

  private rotateYPrime(): void {
    this.rotateY();
    this.rotateY();
    this.rotateY();
  }

  // Z rotation (F direction)
  private rotateZ(): void {
    const tempState = JSON.parse(JSON.stringify(this.state));

    // Rotate the cube around Z axis
    this.state.up = tempState.left;
    this.state.right = tempState.up;
    this.state.down = tempState.right;
    this.state.left = tempState.down;

    // Rotate side faces appropriately
    this.rotateFaceClockwise(this.state.up);
    this.rotateFaceClockwise(this.state.right);
    this.rotateFaceClockwise(this.state.down);
    this.rotateFaceClockwise(this.state.left);

    this.rotateFaceClockwise(this.state.front);
    this.rotateFaceCounterClockwise(this.state.back);
  }

  private rotateZPrime(): void {
    this.rotateZ();
    this.rotateZ();
    this.rotateZ();
  }

  // Scramble the cube with random moves
  scramble(moveCount: number = 20): Move[] {
    const moves = [
      Move.F,
      Move.F_PRIME,
      Move.F2,
      Move.B,
      Move.B_PRIME,
      Move.B2,
      Move.U,
      Move.U_PRIME,
      Move.U2,
      Move.D,
      Move.D_PRIME,
      Move.D2,
      Move.L,
      Move.L_PRIME,
      Move.L2,
      Move.R,
      Move.R_PRIME,
      Move.R2,
    ];

    const scrambleMoves: Move[] = [];
    let lastMove: Move | null = null;

    for (let i = 0; i < moveCount; i++) {
      let move: Move;
      do {
        move = moves[Math.floor(Math.random() * moves.length)];
      } while (lastMove && this.areOppositeMoves(lastMove, move));

      scrambleMoves.push(move);
      this.applyMove(move);
      lastMove = move;
    }

    return scrambleMoves;
  }

  // Check if two moves cancel each other out
  private areOppositeMoves(move1: Move, move2: Move): boolean {
    const baseMoves: { [key: string]: string } = {
      F: 'F',
      "F'": 'F',
      F2: 'F',
      B: 'B',
      "B'": 'B',
      B2: 'B',
      U: 'U',
      "U'": 'U',
      U2: 'U',
      D: 'D',
      "D'": 'D',
      D2: 'D',
      L: 'L',
      "L'": 'L',
      L2: 'L',
      R: 'R',
      "R'": 'R',
      R2: 'R',
    };

    return baseMoves[move1] === baseMoves[move2];
  }

  // Clone the current state
  clone(): CubeModel {
    return new CubeModel(this.getState());
  }
}
