import { Move, Color } from '../types/cube';
import type { SolverResult, SolutionStep } from '../types/cube';
import { CubeModel } from './cubeModel';

export class LayerByLayerSolver {
  private cube: CubeModel;
  private solution: SolutionStep[] = [];

  constructor(cube: CubeModel) {
    this.cube = cube.clone();
  }

  solve(): SolverResult {
    this.solution = [];

    try {
      // Step 1: Solve white cross
      this.solveWhiteCross();

      // Step 2: Solve white corners (complete first layer)
      this.solveWhiteCorners();

      // Step 3: Solve middle layer
      this.solveMiddleLayer();

      // Step 4: Make yellow cross
      this.makeYellowCross();

      // Step 5: Position yellow cross
      this.positionYellowCross();

      // Step 6: Position yellow corners
      this.positionYellowCorners();

      // Step 7: Orient yellow corners
      this.orientYellowCorners();

      return {
        solved: this.cube.isSolved(),
        steps: this.solution,
        moveCount: this.solution.length,
      };
    } catch (error) {
      return {
        solved: false,
        steps: this.solution,
        moveCount: this.solution.length,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  private addMove(move: Move, description?: string, stage?: string): void {
    this.cube.applyMove(move);
    this.solution.push({ move, description, stage });
  }

  private addMoves(moves: Move[], description?: string, stage?: string): void {
    moves.forEach((move) => {
      this.cube.applyMove(move);
      this.solution.push({ move, description, stage });
    });
  }

  // Step 1: Solve white cross
  private solveWhiteCross(): void {
    const stage = 'White Cross';

    // Orient cube with white on top
    const state = this.cube.getState();
    if (state.down.colors[1][1] === Color.WHITE) {
      this.addMoves([Move.x2], 'Orient white face up', stage);
    } else if (state.front.colors[1][1] === Color.WHITE) {
      this.addMove(Move.x, 'Orient white face up', stage);
    } else if (state.back.colors[1][1] === Color.WHITE) {
      this.addMove(Move.x_PRIME, 'Orient white face up', stage);
    } else if (state.left.colors[1][1] === Color.WHITE) {
      this.addMove(Move.z, 'Orient white face up', stage);
    } else if (state.right.colors[1][1] === Color.WHITE) {
      this.addMove(Move.z_PRIME, 'Orient white face up', stage);
    }

    // Solve each edge piece
    this.solveWhiteEdge(Color.RED, 'Red-White edge');
    this.solveWhiteEdge(Color.BLUE, 'Blue-White edge');
    this.solveWhiteEdge(Color.ORANGE, 'Orange-White edge');
    this.solveWhiteEdge(Color.GREEN, 'Green-White edge');
  }

  private solveWhiteEdge(targetColor: Color, description: string): void {
    const stage = 'White Cross';
    let attempts = 0;
    const maxAttempts = 20;

    while (!this.isWhiteEdgeCorrect(targetColor) && attempts < maxAttempts) {
      const edgePosition = this.findWhiteEdge(targetColor);

      if (!edgePosition) break;

      // Move edge to correct position
      switch (edgePosition.face) {
        case 'U':
          // Edge is already on top, just position it
          while (!this.isWhiteEdgeCorrect(targetColor)) {
            this.addMove(Move.U, description, stage);
          }
          break;
        case 'F':
          if (edgePosition.position === 'top') {
            this.addMoves([Move.F2], description, stage);
          } else if (edgePosition.position === 'right') {
            this.addMove(Move.F, description, stage);
          } else if (edgePosition.position === 'left') {
            this.addMove(Move.F_PRIME, description, stage);
          }
          break;
        case 'R':
          if (edgePosition.position === 'top') {
            this.addMoves([Move.R2], description, stage);
          } else if (edgePosition.position === 'front') {
            this.addMove(Move.R, description, stage);
          } else if (edgePosition.position === 'back') {
            this.addMove(Move.R_PRIME, description, stage);
          }
          break;
        case 'B':
          if (edgePosition.position === 'top') {
            this.addMoves([Move.B2], description, stage);
          } else if (edgePosition.position === 'right') {
            this.addMove(Move.B_PRIME, description, stage);
          } else if (edgePosition.position === 'left') {
            this.addMove(Move.B, description, stage);
          }
          break;
        case 'L':
          if (edgePosition.position === 'top') {
            this.addMoves([Move.L2], description, stage);
          } else if (edgePosition.position === 'front') {
            this.addMove(Move.L_PRIME, description, stage);
          } else if (edgePosition.position === 'back') {
            this.addMove(Move.L, description, stage);
          }
          break;
        case 'D':
          // Edge is on bottom, bring it up
          while (!this.isEdgeAlignedForInsertion(targetColor)) {
            this.addMove(Move.D, description, stage);
          }
          // Insert edge
          const insertFace = this.getTargetFace(targetColor);
          if (insertFace === 'F') this.addMoves([Move.F2], description, stage);
          else if (insertFace === 'R') this.addMoves([Move.R2], description, stage);
          else if (insertFace === 'B') this.addMoves([Move.B2], description, stage);
          else if (insertFace === 'L') this.addMoves([Move.L2], description, stage);
          break;
      }

      attempts++;
    }
  }

  private isWhiteEdgeCorrect(targetColor: Color): boolean {
    const state = this.cube.getState();

    switch (targetColor) {
      case Color.RED:
        return state.up.colors[1][2] === Color.WHITE && state.right.colors[0][1] === Color.RED;
      case Color.BLUE:
        return state.up.colors[0][1] === Color.WHITE && state.back.colors[0][1] === Color.BLUE;
      case Color.ORANGE:
        return state.up.colors[1][0] === Color.WHITE && state.left.colors[0][1] === Color.ORANGE;
      case Color.GREEN:
        return state.up.colors[2][1] === Color.WHITE && state.front.colors[0][1] === Color.GREEN;
      default:
        return false;
    }
  }

  private findWhiteEdge(targetColor: Color): { face: string; position: string } | null {
    const state = this.cube.getState();

    // Check all edge positions
    const edges = [
      // Top face edges
      { face: 'U', position: 'front', colors: [state.up.colors[2][1], state.front.colors[0][1]] },
      { face: 'U', position: 'right', colors: [state.up.colors[1][2], state.right.colors[0][1]] },
      { face: 'U', position: 'back', colors: [state.up.colors[0][1], state.back.colors[0][1]] },
      { face: 'U', position: 'left', colors: [state.up.colors[1][0], state.left.colors[0][1]] },

      // Middle layer edges
      {
        face: 'F',
        position: 'right',
        colors: [state.front.colors[1][2], state.right.colors[1][0]],
      },
      { face: 'F', position: 'left', colors: [state.front.colors[1][0], state.left.colors[1][2]] },
      { face: 'R', position: 'back', colors: [state.right.colors[1][2], state.back.colors[1][0]] },
      { face: 'L', position: 'back', colors: [state.left.colors[1][0], state.back.colors[1][2]] },

      // Bottom face edges
      { face: 'D', position: 'front', colors: [state.down.colors[0][1], state.front.colors[2][1]] },
      { face: 'D', position: 'right', colors: [state.down.colors[1][2], state.right.colors[2][1]] },
      { face: 'D', position: 'back', colors: [state.down.colors[2][1], state.back.colors[2][1]] },
      { face: 'D', position: 'left', colors: [state.down.colors[1][0], state.left.colors[2][1]] },
    ];

    for (const edge of edges) {
      if (
        (edge.colors[0] === Color.WHITE && edge.colors[1] === targetColor) ||
        (edge.colors[1] === Color.WHITE && edge.colors[0] === targetColor)
      ) {
        return { face: edge.face, position: edge.position };
      }
    }

    return null;
  }

  private isEdgeAlignedForInsertion(targetColor: Color): boolean {
    const state = this.cube.getState();

    switch (targetColor) {
      case Color.RED:
        return state.down.colors[1][2] === Color.WHITE || state.right.colors[2][1] === Color.WHITE;
      case Color.BLUE:
        return state.down.colors[2][1] === Color.WHITE || state.back.colors[2][1] === Color.WHITE;
      case Color.ORANGE:
        return state.down.colors[1][0] === Color.WHITE || state.left.colors[2][1] === Color.WHITE;
      case Color.GREEN:
        return state.down.colors[0][1] === Color.WHITE || state.front.colors[2][1] === Color.WHITE;
      default:
        return false;
    }
  }

  private getTargetFace(color: Color): string {
    switch (color) {
      case Color.RED:
        return 'R';
      case Color.BLUE:
        return 'B';
      case Color.ORANGE:
        return 'L';
      case Color.GREEN:
        return 'F';
      default:
        return 'F';
    }
  }

  // Step 2: Solve white corners
  private solveWhiteCorners(): void {
    // const stage = 'First Layer';

    // Solve each corner
    this.solveWhiteCorner([Color.RED, Color.GREEN], 'Red-Green-White corner');
    this.solveWhiteCorner([Color.RED, Color.BLUE], 'Red-Blue-White corner');
    this.solveWhiteCorner([Color.ORANGE, Color.BLUE], 'Orange-Blue-White corner');
    this.solveWhiteCorner([Color.ORANGE, Color.GREEN], 'Orange-Green-White corner');
  }

  private solveWhiteCorner(colors: Color[], description: string): void {
    const stage = 'First Layer';
    let attempts = 0;
    const maxAttempts = 20;

    while (!this.isWhiteCornerCorrect(colors) && attempts < maxAttempts) {
      const cornerPosition = this.findWhiteCorner(colors);

      if (!cornerPosition) break;

      // If corner is in bottom layer, bring it to top
      if (cornerPosition.layer === 'bottom') {
        this.positionCornerAboveTarget(colors);
        this.addMoves([Move.R, Move.U, Move.R_PRIME], description, stage);
      }

      // Position corner above its target position
      this.positionCornerAboveTarget(colors);

      // Insert corner using R U R' U' algorithm
      const state = this.cube.getState();
      if (state.front.colors[0][2] === Color.WHITE) {
        this.addMoves([Move.R, Move.U, Move.R_PRIME], description, stage);
      } else if (state.right.colors[0][0] === Color.WHITE) {
        this.addMoves([Move.U, Move.R, Move.U_PRIME, Move.R_PRIME], description, stage);
      } else {
        this.addMoves(
          [Move.R, Move.U2, Move.R_PRIME, Move.U_PRIME, Move.R, Move.U, Move.R_PRIME],
          description,
          stage,
        );
      }

      attempts++;
    }
  }

  private isWhiteCornerCorrect(colors: Color[]): boolean {
    const state = this.cube.getState();

    // Check all white corner positions
    const corners = [
      {
        pos: [state.up.colors[2][2], state.front.colors[0][2], state.right.colors[0][0]],
        colors: [Color.WHITE, Color.GREEN, Color.RED],
      },
      {
        pos: [state.up.colors[0][2], state.right.colors[0][2], state.back.colors[0][0]],
        colors: [Color.WHITE, Color.RED, Color.BLUE],
      },
      {
        pos: [state.up.colors[0][0], state.back.colors[0][2], state.left.colors[0][0]],
        colors: [Color.WHITE, Color.BLUE, Color.ORANGE],
      },
      {
        pos: [state.up.colors[2][0], state.left.colors[0][2], state.front.colors[0][0]],
        colors: [Color.WHITE, Color.ORANGE, Color.GREEN],
      },
    ];

    for (const corner of corners) {
      if (
        this.cornersMatch(corner.pos, corner.colors) &&
        this.cornersMatch(colors, corner.colors.slice(1))
      ) {
        return true;
      }
    }

    return false;
  }

  private findWhiteCorner(targetColors: Color[]): { layer: string; position: number } | null {
    const state = this.cube.getState();

    // Check bottom layer corners
    const bottomCorners = [
      [state.down.colors[0][2], state.front.colors[2][2], state.right.colors[2][0]],
      [state.down.colors[0][0], state.right.colors[2][2], state.back.colors[2][0]],
      [state.down.colors[2][0], state.back.colors[2][2], state.left.colors[2][0]],
      [state.down.colors[2][2], state.left.colors[2][2], state.front.colors[2][0]],
    ];

    for (let i = 0; i < bottomCorners.length; i++) {
      if (this.cornerContainsColors(bottomCorners[i], [Color.WHITE, ...targetColors])) {
        return { layer: 'bottom', position: i };
      }
    }

    // Check top layer corners (not in correct position)
    const topCorners = [
      [state.up.colors[2][2], state.front.colors[0][2], state.right.colors[0][0]],
      [state.up.colors[0][2], state.right.colors[0][2], state.back.colors[0][0]],
      [state.up.colors[0][0], state.back.colors[0][2], state.left.colors[0][0]],
      [state.up.colors[2][0], state.left.colors[0][2], state.front.colors[0][0]],
    ];

    for (let i = 0; i < topCorners.length; i++) {
      if (
        this.cornerContainsColors(topCorners[i], [Color.WHITE, ...targetColors]) &&
        !this.isWhiteCornerCorrect(targetColors)
      ) {
        return { layer: 'top', position: i };
      }
    }

    return null;
  }

  private positionCornerAboveTarget(colors: Color[]): void {
    const targetPosition = this.getTargetCornerPosition(colors);
    let currentPosition = this.getCurrentCornerPosition([Color.WHITE, ...colors]);

    while (currentPosition !== targetPosition) {
      this.addMove(Move.U, 'Position corner', 'First Layer');
      currentPosition = this.getCurrentCornerPosition([Color.WHITE, ...colors]);
    }
  }

  private getTargetCornerPosition(colors: Color[]): number {
    // Determine target position based on colors
    if (colors.includes(Color.RED) && colors.includes(Color.GREEN)) return 0;
    if (colors.includes(Color.RED) && colors.includes(Color.BLUE)) return 1;
    if (colors.includes(Color.ORANGE) && colors.includes(Color.BLUE)) return 2;
    if (colors.includes(Color.ORANGE) && colors.includes(Color.GREEN)) return 3;
    return 0;
  }

  private getCurrentCornerPosition(colors: Color[]): number {
    const state = this.cube.getState();

    const corners = [
      [state.down.colors[0][2], state.front.colors[2][2], state.right.colors[2][0]],
      [state.down.colors[0][0], state.right.colors[2][2], state.back.colors[2][0]],
      [state.down.colors[2][0], state.back.colors[2][2], state.left.colors[2][0]],
      [state.down.colors[2][2], state.left.colors[2][2], state.front.colors[2][0]],
    ];

    for (let i = 0; i < corners.length; i++) {
      if (this.cornerContainsColors(corners[i], colors)) {
        return i;
      }
    }

    return -1;
  }

  private cornersMatch(corner1: Color[], corner2: Color[]): boolean {
    return (
      corner1.every((color) => corner2.includes(color)) &&
      corner2.every((color) => corner1.includes(color))
    );
  }

  private cornerContainsColors(corner: Color[], colors: Color[]): boolean {
    return colors.every((color) => corner.includes(color));
  }

  // Step 3: Solve middle layer
  private solveMiddleLayer(): void {
    const stage = 'Second Layer';

    // Flip cube so yellow is on top
    this.addMoves([Move.x2], 'Flip cube - yellow on top', stage);

    // Solve each middle layer edge
    this.solveMiddleEdge([Color.RED, Color.GREEN], 'Red-Green edge');
    this.solveMiddleEdge([Color.RED, Color.BLUE], 'Red-Blue edge');
    this.solveMiddleEdge([Color.ORANGE, Color.BLUE], 'Orange-Blue edge');
    this.solveMiddleEdge([Color.ORANGE, Color.GREEN], 'Orange-Green edge');
  }

  private solveMiddleEdge(colors: Color[], description: string): void {
    const stage = 'Second Layer';
    let attempts = 0;
    const maxAttempts = 20;

    while (!this.isMiddleEdgeCorrect(colors) && attempts < maxAttempts) {
      const edgePosition = this.findMiddleLayerEdge(colors);

      if (!edgePosition) break;

      if (edgePosition.layer === 'top') {
        // Position edge above target
        this.positionEdgeAboveTarget(colors);

        // Insert edge using appropriate algorithm
        const state = this.cube.getState();
        if (state.front.colors[0][1] === colors[0] || state.front.colors[0][1] === colors[1]) {
          // Edge needs to go to the right
          if (this.shouldGoRight(colors)) {
            this.addMoves(
              [
                Move.U,
                Move.R,
                Move.U_PRIME,
                Move.R_PRIME,
                Move.U_PRIME,
                Move.F_PRIME,
                Move.U,
                Move.F,
              ],
              description,
              stage,
            );
          } else {
            this.addMoves(
              [
                Move.U_PRIME,
                Move.L_PRIME,
                Move.U,
                Move.L,
                Move.U,
                Move.F,
                Move.U_PRIME,
                Move.F_PRIME,
              ],
              description,
              stage,
            );
          }
        }
      } else {
        // Edge is in middle layer but wrong position/orientation
        // Extract it first
        this.extractMiddleEdge(edgePosition.position);
      }

      attempts++;
    }
  }

  private isMiddleEdgeCorrect(colors: Color[]): boolean {
    const state = this.cube.getState();

    const edges = [
      {
        pos: [state.front.colors[1][2], state.right.colors[1][0]],
        colors: [Color.GREEN, Color.RED],
      },
      { pos: [state.right.colors[1][2], state.back.colors[1][0]], colors: [Color.RED, Color.BLUE] },
      {
        pos: [state.back.colors[1][2], state.left.colors[1][0]],
        colors: [Color.BLUE, Color.ORANGE],
      },
      {
        pos: [state.left.colors[1][2], state.front.colors[1][0]],
        colors: [Color.ORANGE, Color.GREEN],
      },
    ];

    for (const edge of edges) {
      if (this.edgesMatch(edge.pos, edge.colors) && this.edgesMatch(colors, edge.colors)) {
        return true;
      }
    }

    return false;
  }

  private findMiddleLayerEdge(colors: Color[]): { layer: string; position: number } | null {
    const state = this.cube.getState();

    // Check top layer edges
    const topEdges = [
      [state.up.colors[2][1], state.front.colors[0][1]],
      [state.up.colors[1][2], state.right.colors[0][1]],
      [state.up.colors[0][1], state.back.colors[0][1]],
      [state.up.colors[1][0], state.left.colors[0][1]],
    ];

    for (let i = 0; i < topEdges.length; i++) {
      if (this.edgeContainsColors(topEdges[i], colors) && !topEdges[i].includes(Color.YELLOW)) {
        return { layer: 'top', position: i };
      }
    }

    // Check middle layer edges
    const middleEdges = [
      [state.front.colors[1][2], state.right.colors[1][0]],
      [state.right.colors[1][2], state.back.colors[1][0]],
      [state.back.colors[1][2], state.left.colors[1][0]],
      [state.left.colors[1][2], state.front.colors[1][0]],
    ];

    for (let i = 0; i < middleEdges.length; i++) {
      if (this.edgeContainsColors(middleEdges[i], colors) && !this.isMiddleEdgeCorrect(colors)) {
        return { layer: 'middle', position: i };
      }
    }

    return null;
  }

  private positionEdgeAboveTarget(colors: Color[]): void {
    const targetPosition = this.getTargetEdgePosition(colors);
    let currentPosition = this.getCurrentTopEdgePosition(colors);

    while (currentPosition !== targetPosition) {
      this.addMove(Move.U, 'Position edge', 'Second Layer');
      currentPosition = this.getCurrentTopEdgePosition(colors);
    }
  }

  private getTargetEdgePosition(colors: Color[]): number {
    if (colors.includes(Color.GREEN) && colors.includes(Color.RED)) return 0;
    if (colors.includes(Color.RED) && colors.includes(Color.BLUE)) return 1;
    if (colors.includes(Color.BLUE) && colors.includes(Color.ORANGE)) return 2;
    if (colors.includes(Color.ORANGE) && colors.includes(Color.GREEN)) return 3;
    return 0;
  }

  private getCurrentTopEdgePosition(colors: Color[]): number {
    const state = this.cube.getState();

    const edges = [
      [state.up.colors[2][1], state.front.colors[0][1]],
      [state.up.colors[1][2], state.right.colors[0][1]],
      [state.up.colors[0][1], state.back.colors[0][1]],
      [state.up.colors[1][0], state.left.colors[0][1]],
    ];

    for (let i = 0; i < edges.length; i++) {
      if (this.edgeContainsColors(edges[i], colors)) {
        return i;
      }
    }

    return -1;
  }

  private shouldGoRight(colors: Color[]): boolean {
    const state = this.cube.getState();
    const frontColor = state.front.colors[0][1];

    if (colors.includes(Color.GREEN) && colors.includes(Color.RED)) {
      return frontColor === Color.GREEN;
    } else if (colors.includes(Color.RED) && colors.includes(Color.BLUE)) {
      return frontColor === Color.RED;
    } else if (colors.includes(Color.BLUE) && colors.includes(Color.ORANGE)) {
      return frontColor === Color.BLUE;
    } else if (colors.includes(Color.ORANGE) && colors.includes(Color.GREEN)) {
      return frontColor === Color.ORANGE;
    }

    return true;
  }

  private extractMiddleEdge(position: number): void {
    const algorithms = [
      [Move.R, Move.U_PRIME, Move.R_PRIME, Move.U_PRIME, Move.F_PRIME, Move.U, Move.F],
      [Move.R_PRIME, Move.U, Move.R, Move.U, Move.B, Move.U_PRIME, Move.B_PRIME],
      [Move.L, Move.U_PRIME, Move.L_PRIME, Move.U_PRIME, Move.B_PRIME, Move.U, Move.B],
      [Move.L_PRIME, Move.U, Move.L, Move.U, Move.F, Move.U_PRIME, Move.F_PRIME],
    ];

    this.addMoves(algorithms[position], 'Extract edge', 'Second Layer');
  }

  private edgesMatch(edge1: Color[], edge2: Color[]): boolean {
    return (
      (edge1[0] === edge2[0] && edge1[1] === edge2[1]) ||
      (edge1[0] === edge2[1] && edge1[1] === edge2[0])
    );
  }

  private edgeContainsColors(edge: Color[], colors: Color[]): boolean {
    return colors.every((color) => edge.includes(color));
  }

  // Step 4: Make yellow cross
  private makeYellowCross(): void {
    const stage = 'Yellow Cross';

    let attempts = 0;
    const maxAttempts = 10;

    while (!this.hasYellowCross() && attempts < maxAttempts) {
      const pattern = this.getYellowPattern();

      switch (pattern) {
        case 'dot':
          this.addMoves(
            [Move.F, Move.R, Move.U, Move.R_PRIME, Move.U_PRIME, Move.F_PRIME],
            'Dot to L-shape',
            stage,
          );
          break;
        case 'L':
          // Position L correctly
          this.positionLShape();
          this.addMoves(
            [Move.F, Move.R, Move.U, Move.R_PRIME, Move.U_PRIME, Move.F_PRIME],
            'L-shape to cross',
            stage,
          );
          break;
        case 'line':
          // Position line horizontally
          this.positionLine();
          this.addMoves(
            [Move.F, Move.R, Move.U, Move.R_PRIME, Move.U_PRIME, Move.F_PRIME],
            'Line to cross',
            stage,
          );
          break;
      }

      attempts++;
    }
  }

  private hasYellowCross(): boolean {
    const state = this.cube.getState();
    return (
      state.up.colors[0][1] === Color.YELLOW &&
      state.up.colors[1][0] === Color.YELLOW &&
      state.up.colors[1][1] === Color.YELLOW &&
      state.up.colors[1][2] === Color.YELLOW &&
      state.up.colors[2][1] === Color.YELLOW
    );
  }

  private getYellowPattern(): string {
    const state = this.cube.getState();
    const yellowEdges = [
      state.up.colors[0][1] === Color.YELLOW,
      state.up.colors[1][0] === Color.YELLOW,
      state.up.colors[1][2] === Color.YELLOW,
      state.up.colors[2][1] === Color.YELLOW,
    ];

    const count = yellowEdges.filter((e) => e).length;

    if (count === 0) return 'dot';
    if (count === 2) {
      // Check if line or L
      if ((yellowEdges[0] && yellowEdges[3]) || (yellowEdges[1] && yellowEdges[2])) {
        return 'line';
      }
      return 'L';
    }
    if (count === 4) return 'cross';

    return 'unknown';
  }

  private positionLShape(): void {
    // Rotate top at most 4 times to position L with corner in back-left
    for (let i = 0; i < 4; i++) {
      const state = this.cube.getState();
      if (state.up.colors[0][1] === Color.YELLOW && state.up.colors[1][0] === Color.YELLOW) {
        break;
      }
      this.addMove(Move.U, 'Position L-shape', 'Yellow Cross');
    }
  }

  private positionLine(): void {
    // Rotate top at most 4 times to make the line horizontal
    for (let i = 0; i < 4; i++) {
      const state = this.cube.getState();
      if (state.up.colors[1][0] === Color.YELLOW && state.up.colors[1][2] === Color.YELLOW) {
        break;
      }
      this.addMove(Move.U, 'Position line', 'Yellow Cross');
    }
  }

  // Step 5: Position yellow cross
  private positionYellowCross(): void {
    const stage = 'Position Yellow Cross';
    let attempts = 0;
    const maxAttempts = 10;

    while (!this.isYellowCrossPositioned() && attempts < maxAttempts) {
      const correctEdges = this.countCorrectYellowEdges();

      if (correctEdges === 0 || correctEdges === 1) {
        this.addMoves(
          [Move.R, Move.U, Move.R_PRIME, Move.U, Move.R, Move.U2, Move.R_PRIME],
          'Position edges',
          stage,
        );
      } else if (correctEdges === 2) {
        // Position correct edges
        this.positionCorrectEdges();
        this.addMoves(
          [Move.R, Move.U, Move.R_PRIME, Move.U, Move.R, Move.U2, Move.R_PRIME],
          'Swap edges',
          stage,
        );
      }

      attempts++;
    }
  }

  private isYellowCrossPositioned(): boolean {
    const state = this.cube.getState();
    return (
      state.front.colors[0][1] === Color.GREEN &&
      state.right.colors[0][1] === Color.RED &&
      state.back.colors[0][1] === Color.BLUE &&
      state.left.colors[0][1] === Color.ORANGE
    );
  }

  private countCorrectYellowEdges(): number {
    const state = this.cube.getState();
    let count = 0;

    if (state.front.colors[0][1] === Color.GREEN) count++;
    if (state.right.colors[0][1] === Color.RED) count++;
    if (state.back.colors[0][1] === Color.BLUE) count++;
    if (state.left.colors[0][1] === Color.ORANGE) count++;

    return count;
  }

  private positionCorrectEdges(): void {
    // Find which edges are correct and position them
    const stateNow = this.cube.getState();
    if (stateNow.front.colors[0][1] === Color.GREEN && stateNow.back.colors[0][1] === Color.BLUE) {
      // Front and back are already correct
      return;
    }

    if (stateNow.left.colors[0][1] === Color.ORANGE && stateNow.right.colors[0][1] === Color.RED) {
      // Left and right are correct, rotate to make front/back correct
      this.addMove(Move.U, 'Position correct edges', 'Position Yellow Cross');
      return;
    }

    // Adjacent edges are correct, position them to back and right (max 4 rotations)
    for (let i = 0; i < 4; i++) {
      const s = this.cube.getState();
      if (s.back.colors[0][1] === Color.BLUE && s.right.colors[0][1] === Color.RED) break;
      this.addMove(Move.U, 'Position correct edges', 'Position Yellow Cross');
    }
  }

  // Step 6: Position yellow corners
  private positionYellowCorners(): void {
    const stage = 'Position Yellow Corners';
    let attempts = 0;
    const maxAttempts = 10;

    while (!this.areYellowCornersPositioned() && attempts < maxAttempts) {
      const correctCorners = this.findCorrectlyPositionedCorner();

      if (correctCorners.length === 0) {
        // No corners in correct position, do algorithm from any angle
        this.addMoves(
          [Move.U, Move.R, Move.U_PRIME, Move.L_PRIME, Move.U, Move.R_PRIME, Move.U_PRIME, Move.L],
          'Cycle corners',
          stage,
        );
      } else {
        // Position correct corner in front-right
        this.positionCorrectCorner(correctCorners[0]);
        this.addMoves(
          [Move.U, Move.R, Move.U_PRIME, Move.L_PRIME, Move.U, Move.R_PRIME, Move.U_PRIME, Move.L],
          'Cycle corners',
          stage,
        );
      }

      attempts++;
    }
  }

  private areYellowCornersPositioned(): boolean {
    const state = this.cube.getState();

    const corners = [
      {
        pos: [state.up.colors[2][2], state.front.colors[0][2], state.right.colors[0][0]],
        colors: [Color.GREEN, Color.RED],
      },
      {
        pos: [state.up.colors[0][2], state.right.colors[0][2], state.back.colors[0][0]],
        colors: [Color.RED, Color.BLUE],
      },
      {
        pos: [state.up.colors[0][0], state.back.colors[0][2], state.left.colors[0][0]],
        colors: [Color.BLUE, Color.ORANGE],
      },
      {
        pos: [state.up.colors[2][0], state.left.colors[0][2], state.front.colors[0][0]],
        colors: [Color.ORANGE, Color.GREEN],
      },
    ];

    return corners.every(
      (corner) =>
        corner.pos.some((c) => corner.colors.includes(c)) &&
        corner.colors.every((c) => corner.pos.includes(c)),
    );
  }

  private findCorrectlyPositionedCorner(): number[] {
    const state = this.cube.getState();
    const correctCorners: number[] = [];

    const corners = [
      {
        pos: [state.up.colors[2][2], state.front.colors[0][2], state.right.colors[0][0]],
        colors: [Color.GREEN, Color.RED],
        index: 0,
      },
      {
        pos: [state.up.colors[0][2], state.right.colors[0][2], state.back.colors[0][0]],
        colors: [Color.RED, Color.BLUE],
        index: 1,
      },
      {
        pos: [state.up.colors[0][0], state.back.colors[0][2], state.left.colors[0][0]],
        colors: [Color.BLUE, Color.ORANGE],
        index: 2,
      },
      {
        pos: [state.up.colors[2][0], state.left.colors[0][2], state.front.colors[0][0]],
        colors: [Color.ORANGE, Color.GREEN],
        index: 3,
      },
    ];

    corners.forEach((corner) => {
      if (corner.colors.every((c) => corner.pos.includes(c))) {
        correctCorners.push(corner.index);
      }
    });

    return correctCorners;
  }

  private positionCorrectCorner(cornerIndex: number): void {
    const rotations = [0, 3, 2, 1]; // How many U moves to get corner to front-right

    for (let i = 0; i < rotations[cornerIndex]; i++) {
      this.addMove(Move.U, 'Position correct corner', 'Position Yellow Corners');
    }
  }

  // Step 7: Orient yellow corners
  private orientYellowCorners(): void {
    const stage = 'Orient Yellow Corners';

    // Process each corner
    for (let i = 0; i < 4; i++) {
      while (!this.isCornerOriented()) {
        this.addMoves([Move.R_PRIME, Move.D_PRIME, Move.R, Move.D], 'Orient corner', stage);
      }

      if (i < 3) {
        this.addMove(Move.U, 'Next corner', stage);
      }
    }

    // Align top layer
    let safety = 0;
    while (this.cube.getState().front.colors[0][1] !== Color.GREEN && safety < 4) {
      this.addMove(Move.U, 'Align cube', stage);
      safety++;
    }
  }

  private isCornerOriented(): boolean {
    const state = this.cube.getState();
    return state.up.colors[2][2] === Color.YELLOW;
  }

  // Utility method to invert moves (for algorithms)
  invertMoves(moves: Move[]): Move[] {
    const inverted: Move[] = [];

    for (let i = moves.length - 1; i >= 0; i--) {
      const move = moves[i];
      if (move.includes("'")) {
        inverted.push(move.replace("'", '') as Move);
      } else if (move.includes('2')) {
        inverted.push(move);
      } else {
        inverted.push((move + "'") as Move);
      }
    }

    return inverted;
  }
}
