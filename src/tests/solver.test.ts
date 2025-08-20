import { describe, it, expect, beforeEach } from 'vitest';
import { CubeModel } from '../utils/cubeModel';
import { LayerByLayerSolver } from '../utils/solver';
import { Move } from '../types/cube';

describe('LayerByLayerSolver', () => {
  let cube: CubeModel;
  let solver: LayerByLayerSolver;

  beforeEach(() => {
    cube = new CubeModel();
  });

  describe('solving a solved cube', () => {
    it('should return empty solution for already solved cube', () => {
      solver = new LayerByLayerSolver(cube);
      const result = solver.solve();

      expect(result.solved).toBe(true);
      expect(result.steps).toHaveLength(0);
      expect(result.moveCount).toBe(0);
      expect(result.error).toBeUndefined();
    });
  });

  describe('solving simple cases', () => {
    it('should solve a cube with single move scramble', () => {
      cube.applyMove(Move.R);
      solver = new LayerByLayerSolver(cube);
      const result = solver.solve();

      expect(result.solved).toBe(true);
      expect(result.steps.length).toBeGreaterThan(0);
      expect(result.error).toBeUndefined();

      // Verify solution works
      const testCube = cube.clone();
      result.steps.forEach((step) => testCube.applyMove(step.move));
      expect(testCube.isSolved()).toBe(true);
    });

    it('should solve a cube with two move scramble', () => {
      cube.applyMoves([Move.R, Move.U]);
      solver = new LayerByLayerSolver(cube);
      const result = solver.solve();

      expect(result.solved).toBe(true);
      expect(result.steps.length).toBeGreaterThan(0);

      // Verify solution works
      const testCube = cube.clone();
      result.steps.forEach((step) => testCube.applyMove(step.move));
      expect(testCube.isSolved()).toBe(true);
    });
  });

  describe('solving scrambled cubes', () => {
    it('should solve a randomly scrambled cube', () => {
      cube.scramble(10);
      solver = new LayerByLayerSolver(cube);
      const result = solver.solve();

      expect(result.solved).toBe(true);
      expect(result.steps.length).toBeGreaterThan(0);
      expect(result.steps.length).toBeLessThan(200); // Reasonable upper bound

      // Verify solution works
      const testCube = cube.clone();
      result.steps.forEach((step) => testCube.applyMove(step.move));
      expect(testCube.isSolved()).toBe(true);
    });

    it('should solve multiple different scrambles', () => {
      const scrambleLengths = [5, 10, 15, 20];

      scrambleLengths.forEach((length) => {
        const testCube = new CubeModel();
        testCube.scramble(length);

        const solver = new LayerByLayerSolver(testCube);
        const result = solver.solve();

        expect(result.solved).toBe(true);

        // Verify solution
        const verifyCube = testCube.clone();
        result.steps.forEach((step) => verifyCube.applyMove(step.move));
        expect(verifyCube.isSolved()).toBe(true);
      });
    });
  });

  describe('solution properties', () => {
    it('should include stage information in solution steps', () => {
      cube.scramble(5);
      solver = new LayerByLayerSolver(cube);
      const result = solver.solve();

      const stages = new Set(result.steps.map((step) => step.stage).filter(Boolean));
      expect(stages.size).toBeGreaterThan(0);

      // Should include some expected stages
      const expectedStages = ['White Cross', 'First Layer', 'Second Layer'];
      const hasExpectedStages = expectedStages.some((stage) =>
        result.steps.some((step) => step.stage === stage),
      );
      expect(hasExpectedStages).toBe(true);
    });

    it('should include descriptions for key moves', () => {
      cube.scramble(5);
      solver = new LayerByLayerSolver(cube);
      const result = solver.solve();

      const hasDescriptions = result.steps.some((step) => step.description !== undefined);
      expect(hasDescriptions).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should handle cube with flipped edges', () => {
      // Create a specific scramble that flips edges
      cube.applyMoves([Move.R, Move.U, Move.R_PRIME, Move.F_PRIME]);
      solver = new LayerByLayerSolver(cube);
      const result = solver.solve();

      expect(result.solved).toBe(true);

      const testCube = cube.clone();
      result.steps.forEach((step) => testCube.applyMove(step.move));
      expect(testCube.isSolved()).toBe(true);
    });

    it('should not exceed reasonable move count', () => {
      // Even for worst case, layer-by-layer shouldn't need more than 200 moves
      cube.scramble(30);
      solver = new LayerByLayerSolver(cube);
      const result = solver.solve();

      expect(result.solved).toBe(true);
      expect(result.moveCount).toBeLessThan(200);
    });
  });

  describe('solver consistency', () => {
    it('should produce same solution for same scramble', () => {
      const scrambleMoves = [Move.R, Move.U, Move.R_PRIME, Move.U_PRIME, Move.F, Move.U2];

      const cube1 = new CubeModel();
      cube1.applyMoves(scrambleMoves);
      const solver1 = new LayerByLayerSolver(cube1);
      const result1 = solver1.solve();

      const cube2 = new CubeModel();
      cube2.applyMoves(scrambleMoves);
      const solver2 = new LayerByLayerSolver(cube2);
      const result2 = solver2.solve();

      expect(result1.steps.map((s) => s.move)).toEqual(result2.steps.map((s) => s.move));
    });
  });
});
