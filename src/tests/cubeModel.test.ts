import { describe, it, expect, beforeEach } from 'vitest';
import { CubeModel } from '../utils/cubeModel';
import { Color, Move } from '../types/cube';

describe('CubeModel', () => {
  let cube: CubeModel;

  beforeEach(() => {
    cube = new CubeModel();
  });

  describe('initialization', () => {
    it('should create a solved cube by default', () => {
      expect(cube.isSolved()).toBe(true);
    });

    it('should have correct colors on each face', () => {
      const state = cube.getState();

      // Check center colors
      expect(state.front.colors[1][1]).toBe(Color.GREEN);
      expect(state.back.colors[1][1]).toBe(Color.BLUE);
      expect(state.up.colors[1][1]).toBe(Color.WHITE);
      expect(state.down.colors[1][1]).toBe(Color.YELLOW);
      expect(state.left.colors[1][1]).toBe(Color.ORANGE);
      expect(state.right.colors[1][1]).toBe(Color.RED);
    });
  });

  describe('basic moves', () => {
    it('should apply F move correctly', () => {
      cube.applyMove(Move.F);
      const state = cube.getState();

      // Check that front face is still green
      expect(state.front.colors[1][1]).toBe(Color.GREEN);

      // Check edge pieces moved correctly
      expect(state.up.colors[2][0]).toBe(Color.ORANGE);
      expect(state.up.colors[2][1]).toBe(Color.ORANGE);
      expect(state.up.colors[2][2]).toBe(Color.ORANGE);

      expect(state.right.colors[0][0]).toBe(Color.WHITE);
      expect(state.right.colors[1][0]).toBe(Color.WHITE);
      expect(state.right.colors[2][0]).toBe(Color.WHITE);
    });

    it('should return to solved state with F F F F', () => {
      cube.applyMove(Move.F);
      cube.applyMove(Move.F);
      cube.applyMove(Move.F);
      cube.applyMove(Move.F);

      expect(cube.isSolved()).toBe(true);
    });

    it("should cancel out with F F'", () => {
      const initialState = cube.getState();

      cube.applyMove(Move.F);
      cube.applyMove(Move.F_PRIME);

      expect(cube.getState()).toEqual(initialState);
      expect(cube.isSolved()).toBe(true);
    });

    it('should handle F2 correctly', () => {
      const state1 = cube.clone();
      state1.applyMove(Move.F);
      state1.applyMove(Move.F);

      cube.applyMove(Move.F2);

      expect(cube.getState()).toEqual(state1.getState());
    });
  });

  describe('move sequences', () => {
    it("should handle the sexy move (R U R' U')", () => {
      cube.applyMoves([Move.R, Move.U, Move.R_PRIME, Move.U_PRIME]);
      cube.applyMoves([Move.R, Move.U, Move.R_PRIME, Move.U_PRIME]);
      cube.applyMoves([Move.R, Move.U, Move.R_PRIME, Move.U_PRIME]);
      cube.applyMoves([Move.R, Move.U, Move.R_PRIME, Move.U_PRIME]);
      cube.applyMoves([Move.R, Move.U, Move.R_PRIME, Move.U_PRIME]);
      cube.applyMoves([Move.R, Move.U, Move.R_PRIME, Move.U_PRIME]);

      expect(cube.isSolved()).toBe(true);
    });

    it('should handle T-perm correctly', () => {
      // T-perm should swap two adjacent corners and two edges
      const tPerm = [
        Move.R,
        Move.U,
        Move.R_PRIME,
        Move.U_PRIME,
        Move.R_PRIME,
        Move.F,
        Move.R2,
        Move.U_PRIME,
        Move.R_PRIME,
        Move.U_PRIME,
        Move.R,
        Move.U,
        Move.R_PRIME,
        Move.F_PRIME,
      ];

      cube.applyMoves(tPerm);
      expect(cube.isSolved()).toBe(false);

      // Applying T-perm twice should return to solved state
      cube.applyMoves(tPerm);
      expect(cube.isSolved()).toBe(true);
    });
  });

  describe('scrambling', () => {
    it('should scramble the cube', () => {
      const moves = cube.scramble(20);

      expect(moves).toHaveLength(20);
      expect(cube.isSolved()).toBe(false);
    });

    it('should not have consecutive opposite moves in scramble', () => {
      const moves = cube.scramble(50);

      for (let i = 1; i < moves.length; i++) {
        const currentBase = moves[i].replace(/['2]/g, '');
        const prevBase = moves[i - 1].replace(/['2]/g, '');
        expect(currentBase).not.toBe(prevBase);
      }
    });
  });

  describe('state management', () => {
    it('should clone cube correctly', () => {
      cube.scramble(10);
      const clone = cube.clone();

      expect(clone.getState()).toEqual(cube.getState());
      expect(clone).not.toBe(cube); // Different instances

      // Modifying clone shouldn't affect original
      clone.applyMove(Move.R);
      expect(clone.getState()).not.toEqual(cube.getState());
    });

    it('should set and get state correctly', () => {
      const originalState = cube.getState();
      cube.scramble(10);
      // const scrambledState = cube.getState();

      expect(cube.isSolved()).toBe(false);

      cube.setState(originalState);
      expect(cube.isSolved()).toBe(true);
      expect(cube.getState()).toEqual(originalState);
    });
  });

  describe('rotation moves', () => {
    it('should handle x rotation correctly', () => {
      cube.applyMove(Move.x);
      const state = cube.getState();

      // After x rotation, front becomes up
      expect(state.up.colors[1][1]).toBe(Color.GREEN);
      expect(state.front.colors[1][1]).toBe(Color.YELLOW);
      expect(state.down.colors[1][1]).toBe(Color.BLUE);
      expect(state.back.colors[1][1]).toBe(Color.WHITE);
    });

    it('should handle y rotation correctly', () => {
      cube.applyMove(Move.y);
      const state = cube.getState();

      // After y rotation, front becomes left
      expect(state.front.colors[1][1]).toBe(Color.RED);
      expect(state.left.colors[1][1]).toBe(Color.GREEN);
      expect(state.back.colors[1][1]).toBe(Color.ORANGE);
      expect(state.right.colors[1][1]).toBe(Color.BLUE);
    });

    it('should handle z rotation correctly', () => {
      cube.applyMove(Move.z);
      const state = cube.getState();

      // After z rotation, up becomes right
      expect(state.up.colors[1][1]).toBe(Color.ORANGE);
      expect(state.right.colors[1][1]).toBe(Color.WHITE);
      expect(state.down.colors[1][1]).toBe(Color.RED);
      expect(state.left.colors[1][1]).toBe(Color.YELLOW);
    });
  });
});
