<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <AppHeader 
      :is-dark="isDark" 
      @toggle-theme="toggleTheme"
      @show-help="showHelp = true"
    />
    
    <main class="container mx-auto px-4 py-6 safe-bottom">
      <!-- Mobile Layout -->
      <div class="lg:hidden">
        <!-- 3D Cube View -->
        <div class="mb-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4" style="height: 60vh; max-height: 400px;">
          <CubeVisualization
            :cube-state="cubeState"
            :current-move="currentMove"
            :is-dark="isDark"
          />
        </div>
        
        <!-- Tabbed Interface for Controls/Solution -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <div class="flex border-b border-gray-200 dark:border-gray-700">
            <button
              @click="activeTab = 'controls'"
              :class="[
                'flex-1 px-4 py-2 text-sm font-medium transition-colors',
                activeTab === 'controls'
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              ]"
            >
              Controls
            </button>
            <button
              @click="activeTab = 'solution'"
              :class="[
                'flex-1 px-4 py-2 text-sm font-medium transition-colors',
                activeTab === 'solution'
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              ]"
            >
              Solution ({{ solution.length }})
            </button>
          </div>
          
          <div class="p-4">
            <ControlPanel
              v-show="activeTab === 'controls'"
              :solution="solution"
              :animation-state="animationState"
              :is-scrambling="isScrambling"
              :is-solving="isSolving"
              :is-solved="isSolved"
              :error="error"
              :current-move="currentMove"
              @scramble="scramble"
              @solve="solve"
              @reset="reset"
              @play="play"
              @pause="pause"
              @step-forward="stepForward"
              @step-backward="stepBackward"
              @set-speed="setSpeed"
              @apply-move="applyMove"
            />
            
            <SolutionDisplay
              v-show="activeTab === 'solution'"
              :solution="solution"
              :current-step-index="animationState.currentStep - 1"
            />
          </div>
        </div>
      </div>
      
      <!-- Desktop Layout -->
      <div class="hidden lg:grid lg:grid-cols-12 lg:gap-6">
        <!-- Left Panel - Controls -->
        <div class="col-span-3">
          <ControlPanel
            :solution="solution"
            :animation-state="animationState"
            :is-scrambling="isScrambling"
            :is-solving="isSolving"
            :is-solved="isSolved"
            :error="error"
            :current-move="currentMove"
            @scramble="scramble"
            @solve="solve"
            @reset="reset"
            @play="play"
            @pause="pause"
            @step-forward="stepForward"
            @step-backward="stepBackward"
            @set-speed="setSpeed"
            @apply-move="applyMove"
          />
        </div>
        
        <!-- Center - 3D Cube -->
        <div class="col-span-6">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4" style="height: 70vh; min-height: 500px;">
            <CubeVisualization
              :cube-state="cubeState"
              :current-move="currentMove"
              :is-dark="isDark"
            />
          </div>
        </div>
        
        <!-- Right Panel - Solution -->
        <div class="col-span-3">
          <div style="height: 70vh; min-height: 500px;">
            <SolutionDisplay
              :solution="solution"
              :current-step-index="animationState.currentStep - 1"
            />
          </div>
        </div>
      </div>
    </main>
    
    <!-- Help Modal -->
    <HelpModal :is-open="showHelp" @close="showHelp = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AppHeader from './components/AppHeader.vue'
import CubeVisualization from './components/CubeVisualization.vue'
import ControlPanel from './components/ControlPanel.vue'
import SolutionDisplay from './components/SolutionDisplay.vue'
import HelpModal from './components/HelpModal.vue'
import { useCube } from './composables/useCube'
import { useTheme } from './composables/useTheme'

// Theme management
const { isDark, toggleTheme } = useTheme()

// Cube management
const {
  cubeState,
  solution,
  animationState,
  isScrambling,
  isSolving,
  error,
  isSolved,
  currentMove,
  reset,
  scramble,
  solve,
  applyMove,
  play,
  pause,
  stepForward,
  stepBackward,
  setSpeed
} = useCube()

// UI state
const activeTab = ref<'controls' | 'solution'>('controls')
const showHelp = ref(false)

// Show help on first visit
onMounted(() => {
  const hasVisited = localStorage.getItem('hasVisited')
  if (!hasVisited) {
    showHelp.value = true
    localStorage.setItem('hasVisited', 'true')
  }
})
</script>