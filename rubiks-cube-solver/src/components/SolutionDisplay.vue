<template>
  <div class="solution-display bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 h-full overflow-hidden flex flex-col">
    <h3 class="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
      Solution Steps
    </h3>
    
    <div v-if="solution.length === 0" class="text-gray-500 dark:text-gray-400 text-sm">
      No solution to display. Scramble the cube and click Solve.
    </div>
    
    <div v-else class="flex-1 overflow-y-auto no-scrollbar">
      <div class="text-sm text-gray-600 dark:text-gray-400 mb-3">
        Total moves: {{ solution.length }}
      </div>
      
      <!-- Group by stage -->
      <div v-for="(group, stage) in groupedSolution" :key="stage" class="mb-4">
        <h4 class="font-medium text-gray-700 dark:text-gray-300 mb-2 text-sm sticky top-0 bg-white dark:bg-gray-800 py-1">
          {{ stage }}
        </h4>
        <div class="space-y-1">
          <div
            v-for="(step, index) in group"
            :key="`${stage}-${index}`"
            :class="[
              'flex items-center justify-between p-2 rounded transition-colors duration-200',
              step.globalIndex === currentStepIndex
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                : step.globalIndex < currentStepIndex
                ? 'bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400'
                : 'hover:bg-gray-50 dark:hover:bg-gray-700/30'
            ]"
          >
            <div class="flex items-center gap-3">
              <span class="text-xs text-gray-500 dark:text-gray-500 w-8">
                {{ step.globalIndex + 1 }}.
              </span>
              <span class="font-mono font-medium">{{ step.move }}</span>
            </div>
            <span v-if="step.description" class="text-xs text-gray-500 dark:text-gray-400 ml-2 truncate max-w-[150px]">
              {{ step.description }}
            </span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Move notation help -->
    <details class="mt-4 text-sm">
      <summary class="cursor-pointer text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
        Move Notation Help
      </summary>
      <div class="mt-2 p-3 bg-gray-100 dark:bg-gray-700 rounded text-xs space-y-1">
        <div><span class="font-mono font-medium">F/B/U/D/L/R</span> - Face turns (Front/Back/Up/Down/Left/Right)</div>
        <div><span class="font-mono font-medium">'</span> - Counter-clockwise (e.g., F' = Front counter-clockwise)</div>
        <div><span class="font-mono font-medium">2</span> - 180° turn (e.g., F2 = Front 180°)</div>
      </div>
    </details>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { SolutionStep } from '../types/cube'

const props = defineProps<{
  solution: SolutionStep[]
  currentStepIndex: number
}>()

interface GroupedStep extends SolutionStep {
  globalIndex: number
}

const groupedSolution = computed(() => {
  const groups: Record<string, GroupedStep[]> = {}
  
  props.solution.forEach((step, index) => {
    const stage = step.stage || 'Manual Moves'
    if (!groups[stage]) {
      groups[stage] = []
    }
    groups[stage].push({
      ...step,
      globalIndex: index
    })
  })
  
  return groups
})
</script>

<style scoped>
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}

details summary::-webkit-details-marker {
  display: none;
}

details summary::before {
  content: '▶';
  display: inline-block;
  margin-right: 0.5rem;
  transition: transform 0.2s;
}

details[open] summary::before {
  transform: rotate(90deg);
}
</style>