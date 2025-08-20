<template>
  <div class="control-panel p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
    <!-- Main Controls -->
    <div class="mb-6">
      <h3 class="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">Controls</h3>
      <div class="grid grid-cols-2 gap-3">
        <button
          @click="scramble"
          :disabled="isScrambling || animationState.isAnimating"
          class="btn-primary"
        >
          <span v-if="isScrambling">Scrambling...</span>
          <span v-else>Scramble</span>
        </button>
        <button
          @click="solve"
          :disabled="isSolving || animationState.isAnimating || isSolved"
          class="btn-primary"
        >
          <span v-if="isSolving">Solving...</span>
          <span v-else>Solve</span>
        </button>
        <button
          @click="reset"
          :disabled="animationState.isAnimating"
          class="btn-secondary col-span-2"
        >
          Reset
        </button>
      </div>
    </div>

    <!-- Solution Playback -->
    <div v-if="solution.length > 0" class="mb-6">
      <h3 class="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
        Solution Playback
      </h3>
      <div class="mb-3">
        <div class="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
          <span>Step {{ animationState.currentStep }} / {{ solution.length }}</span>
          <span>{{ currentMove?.move || '-' }}</span>
        </div>
        <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            class="bg-blue-600 h-2 rounded-full transition-all duration-300"
            :style="{ width: `${(animationState.currentStep / solution.length) * 100}%` }"
          ></div>
        </div>
      </div>
      
      <div class="grid grid-cols-4 gap-2 mb-3">
        <button
          @click="stepBackward"
          :disabled="animationState.currentStep === 0 || animationState.isAnimating"
          class="btn-secondary text-sm px-2 py-1"
          aria-label="Step backward"
        >
          ⏮
        </button>
        <button
          v-if="!animationState.isAnimating || animationState.isPaused"
          @click="play"
          :disabled="animationState.currentStep >= solution.length"
          class="btn-primary text-sm px-2 py-1"
          aria-label="Play"
        >
          ▶
        </button>
        <button
          v-else
          @click="pause"
          class="btn-primary text-sm px-2 py-1"
          aria-label="Pause"
        >
          ⏸
        </button>
        <button
          @click="stepForward"
          :disabled="animationState.currentStep >= solution.length || animationState.isAnimating"
          class="btn-secondary text-sm px-2 py-1"
          aria-label="Step forward"
        >
          ⏭
        </button>
        <div class="flex items-center gap-1">
          <label for="speed" class="text-xs text-gray-600 dark:text-gray-400">Speed:</label>
          <input
            id="speed"
            type="range"
            min="50"
            max="1000"
            step="50"
            :value="1050 - animationState.speed"
            @input="setSpeed(1050 - Number($event.target.value))"
            class="flex-1"
          />
        </div>
      </div>
      
      <!-- Current stage info -->
      <div v-if="currentMove?.stage" class="text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded p-2">
        <span class="font-medium">Stage:</span> {{ currentMove.stage }}
        <span v-if="currentMove.description" class="block text-xs mt-1">
          {{ currentMove.description }}
        </span>
      </div>
    </div>

    <!-- Manual Moves -->
    <div class="mb-6">
      <h3 class="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">Manual Moves</h3>
      <div class="grid grid-cols-3 gap-2 text-sm">
        <button
          v-for="move in basicMoves"
          :key="move"
          @click="applyMove(move)"
          :disabled="animationState.isAnimating"
          class="btn-secondary py-1 px-2 text-xs font-mono"
        >
          {{ move }}
        </button>
      </div>
    </div>

    <!-- Status and Error Display -->
    <div v-if="error" class="mb-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg text-sm">
      {{ error }}
    </div>
    
    <div v-if="isSolved" class="mb-4 p-3 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg text-sm font-medium">
      🎉 Cube Solved!
    </div>
  </div>
</template>

<script setup lang="ts">
import { Move, SolutionStep, AnimationState } from '../types/cube'

const props = defineProps<{
  solution: SolutionStep[]
  animationState: AnimationState
  isScrambling: boolean
  isSolving: boolean
  isSolved: boolean
  error: string | null
  currentMove: SolutionStep | null
}>()

const emit = defineEmits<{
  scramble: []
  solve: []
  reset: []
  play: []
  pause: []
  stepForward: []
  stepBackward: []
  setSpeed: [speed: number]
  applyMove: [move: Move]
}>()

const basicMoves: Move[] = [
  Move.F, Move.F_PRIME, Move.F2,
  Move.B, Move.B_PRIME, Move.B2,
  Move.U, Move.U_PRIME, Move.U2,
  Move.D, Move.D_PRIME, Move.D2,
  Move.L, Move.L_PRIME, Move.L2,
  Move.R, Move.R_PRIME, Move.R2
]

const scramble = () => emit('scramble')
const solve = () => emit('solve')
const reset = () => emit('reset')
const play = () => emit('play')
const pause = () => emit('pause')
const stepForward = () => emit('stepForward')
const stepBackward = () => emit('stepBackward')
const setSpeed = (speed: number) => emit('setSpeed', speed)
const applyMove = (move: Move) => emit('applyMove', move)
</script>

<style scoped>
input[type="range"] {
  @apply w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer;
}

input[type="range"]::-webkit-slider-thumb {
  @apply appearance-none w-3 h-3 bg-blue-600 rounded-full cursor-pointer;
}

input[type="range"]::-moz-range-thumb {
  @apply w-3 h-3 bg-blue-600 rounded-full cursor-pointer border-0;
}
</style>