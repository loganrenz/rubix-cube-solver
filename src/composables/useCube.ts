import { ref, computed, reactive } from 'vue';
import { CubeModel } from '../utils/cubeModel';
import { LayerByLayerSolver } from '../utils/solver';
import { Move } from '../types/cube';
import type { SolutionStep, AnimationState } from '../types/cube';

export const useCube = () => {
  const cubeModel = ref(new CubeModel());
  const solution = ref<SolutionStep[]>([]);
  const animationState = reactive<AnimationState>({
    isAnimating: false,
    currentStep: 0,
    speed: 300,
    isPaused: false,
  });
  const isScrambling = ref(false);
  const isSolving = ref(false);
  const error = ref<string | null>(null);

  const cubeState = computed(() => cubeModel.value.getState());
  const isSolved = computed(() => cubeModel.value.isSolved());
  const currentMove = computed(() =>
    solution.value.length > 0 && animationState.currentStep < solution.value.length
      ? solution.value[animationState.currentStep]
      : null,
  );

  const reset = () => {
    cubeModel.value = new CubeModel();
    solution.value = [];
    animationState.isAnimating = false;
    animationState.currentStep = 0;
    animationState.isPaused = false;
    error.value = null;
  };

  const scramble = async () => {
    if (animationState.isAnimating) return;

    isScrambling.value = true;
    error.value = null;

    try {
      reset();
      await new Promise((resolve) => setTimeout(resolve, 100));

      const scrambleMoves = cubeModel.value.scramble(25);
      solution.value = scrambleMoves.map((move) => ({ move }));

      // Animate scramble quickly
      animationState.speed = 100;
      await animateSolution();
    } catch (e) {
      error.value = 'Failed to scramble cube';
    } finally {
      isScrambling.value = false;
      animationState.speed = 300;
    }
  };

  const solve = async () => {
    if (animationState.isAnimating || isSolved.value) return;

    isSolving.value = true;
    error.value = null;

    try {
      // Create a solver with current state
      const solver = new LayerByLayerSolver(cubeModel.value as any);
      const result = await new Promise<ReturnType<typeof solver.solve>>((resolve) => {
        setTimeout(() => resolve(solver.solve()), 100);
      });

      if (result.error) {
        error.value = result.error;
        return;
      }

      solution.value = result.steps;
      animationState.currentStep = 0;

      // Don't auto-animate, let user control playback
    } catch (e) {
      error.value = 'Failed to solve cube';
    } finally {
      isSolving.value = false;
    }
  };

  const applyMove = (move: Move) => {
    if (animationState.isAnimating) return;

    cubeModel.value.applyMove(move);
    solution.value = [{ move }];
    animationState.currentStep = 1;
  };

  const animateSolution = async () => {
    if (solution.value.length === 0) return;

    animationState.isAnimating = true;
    animationState.isPaused = false;

    while (animationState.currentStep < solution.value.length) {
      if (animationState.isPaused) {
        await new Promise((resolve) => {
          const checkPause = setInterval(() => {
            if (!animationState.isPaused) {
              clearInterval(checkPause);
              resolve(undefined);
            }
          }, 50);
        });
      }

      const step = solution.value[animationState.currentStep];
      cubeModel.value.applyMove(step.move);
      animationState.currentStep++;

      if (animationState.currentStep < solution.value.length) {
        await new Promise((resolve) => setTimeout(resolve, animationState.speed));
      }
    }

    animationState.isAnimating = false;
  };

  const play = () => {
    if (solution.value.length === 0 || animationState.currentStep >= solution.value.length) {
      return;
    }

    animationState.isPaused = false;
    if (!animationState.isAnimating) {
      animateSolution();
    }
  };

  const pause = () => {
    animationState.isPaused = true;
  };

  const stepForward = () => {
    if (animationState.currentStep < solution.value.length && !animationState.isAnimating) {
      const step = solution.value[animationState.currentStep];
      cubeModel.value.applyMove(step.move);
      animationState.currentStep++;
    }
  };

  const stepBackward = () => {
    if (animationState.currentStep > 0 && !animationState.isAnimating) {
      animationState.currentStep--;

      // Rebuild cube to current step
      cubeModel.value = new CubeModel();
      for (let i = 0; i < animationState.currentStep; i++) {
        cubeModel.value.applyMove(solution.value[i].move);
      }
    }
  };

  const setSpeed = (speed: number) => {
    animationState.speed = Math.max(50, Math.min(1000, speed));
  };

  const importState = (stateString: string) => {
    try {
      const state = JSON.parse(stateString);
      cubeModel.value.setState(state);
      solution.value = [];
      animationState.currentStep = 0;
      error.value = null;
    } catch (e) {
      error.value = 'Invalid cube state';
    }
  };

  const exportState = () => {
    return JSON.stringify(cubeState.value);
  };

  return {
    // State
    cubeState,
    solution,
    animationState,
    isScrambling,
    isSolving,
    error,
    isSolved,
    currentMove,

    // Actions
    reset,
    scramble,
    solve,
    applyMove,
    play,
    pause,
    stepForward,
    stepBackward,
    setSpeed,
    importState,
    exportState,
  };
};
