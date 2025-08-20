<template>
    <Teleport to="body">
        <Transition name="modal">
            <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto" @click.self="close">
                <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
                    <!-- Backdrop -->
                    <div class="fixed inset-0 bg-gray-900/75 transition-opacity" @click="close"></div>

                    <!-- Modal -->
                    <div
                        class="relative inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                        <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <!-- Header -->
                            <div class="flex items-center justify-between mb-4">
                                <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">
                                    How to Use Rubik's Cube Solver
                                </h3>
                                <button @click="close"
                                    class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none">
                                    <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <!-- Content -->
                            <div class="mt-2 space-y-4 text-sm text-gray-600 dark:text-gray-300">
                                <section>
                                    <h4 class="font-semibold text-gray-900 dark:text-gray-100 mb-2">Getting Started</h4>
                                    <ul class="space-y-1 list-disc list-inside">
                                        <li>Click <strong>Scramble</strong> to randomize the cube</li>
                                        <li>Click <strong>Solve</strong> to calculate the solution</li>
                                        <li>Use playback controls to watch the solution step-by-step</li>
                                        <li>Click <strong>Reset</strong> to return to solved state</li>
                                    </ul>
                                </section>

                                <section>
                                    <h4 class="font-semibold text-gray-900 dark:text-gray-100 mb-2">3D Cube Controls
                                    </h4>
                                    <ul class="space-y-1 list-disc list-inside">
                                        <li><strong>Rotate:</strong> Click and drag (or touch and swipe)</li>
                                        <li><strong>Zoom:</strong> Scroll (or pinch on mobile)</li>
                                        <li><strong>Auto-rotate:</strong> Cube rotates when idle</li>
                                    </ul>
                                </section>

                                <section>
                                    <h4 class="font-semibold text-gray-900 dark:text-gray-100 mb-2">Move Notation</h4>
                                    <div class="grid grid-cols-2 gap-2 text-xs">
                                        <div><code class="font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded">F</code>
                                            - Front clockwise</div>
                                        <div><code class="font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded">F'</code>
                                            - Front counter-clockwise</div>
                                        <div><code class="font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded">B</code>
                                            - Back clockwise</div>
                                        <div><code class="font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded">B'</code>
                                            - Back counter-clockwise</div>
                                        <div><code class="font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded">U</code>
                                            - Up (top) clockwise</div>
                                        <div><code class="font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded">U'</code>
                                            - Up counter-clockwise</div>
                                        <div><code class="font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded">D</code>
                                            - Down clockwise</div>
                                        <div><code class="font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded">D'</code>
                                            - Down counter-clockwise</div>
                                        <div><code class="font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded">L</code>
                                            - Left clockwise</div>
                                        <div><code class="font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded">L'</code>
                                            - Left counter-clockwise</div>
                                        <div><code class="font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded">R</code>
                                            - Right clockwise</div>
                                        <div><code class="font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded">R'</code>
                                            - Right counter-clockwise</div>
                                    </div>
                                    <p class="mt-2 text-xs">
                                        <strong>Note:</strong> Adding <code
                                            class="font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded">2</code> means
                                        180° turn (e.g., F2)
                                    </p>
                                </section>

                                <section>
                                    <h4 class="font-semibold text-gray-900 dark:text-gray-100 mb-2">Solving Method</h4>
                                    <p>This solver uses the layer-by-layer method:</p>
                                    <ol class="mt-1 space-y-1 list-decimal list-inside">
                                        <li>White cross on top</li>
                                        <li>White corners (first layer)</li>
                                        <li>Middle layer edges</li>
                                        <li>Yellow cross</li>
                                        <li>Position yellow edges</li>
                                        <li>Position yellow corners</li>
                                        <li>Orient yellow corners</li>
                                    </ol>
                                </section>

                                <section>
                                    <h4 class="font-semibold text-gray-900 dark:text-gray-100 mb-2">Mobile Tips</h4>
                                    <ul class="space-y-1 list-disc list-inside">
                                        <li>Use two fingers to zoom in/out</li>
                                        <li>Tap buttons instead of clicking</li>
                                        <li>Landscape mode provides more space</li>
                                        <li>Solution steps scroll independently</li>
                                    </ul>
                                </section>
                            </div>
                        </div>

                        <!-- Footer -->
                        <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            <button @click="close" class="w-full sm:w-auto btn-primary">
                                Got it!
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import { watch } from 'vue'

const props = defineProps<{
    isOpen: boolean
}>()

const emit = defineEmits<{
    close: []
}>()

const close = () => emit('close')

// Close on escape key
const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && props.isOpen) {
        close()
    }
}

watch(() => props.isOpen, (isOpen) => {
    if (isOpen) {
        document.addEventListener('keydown', handleEscape)
        document.body.style.overflow = 'hidden'
    } else {
        document.removeEventListener('keydown', handleEscape)
        document.body.style.overflow = ''
    }
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
    transition: transform 0.3s ease;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
    transform: scale(0.95);
}
</style>
