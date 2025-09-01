<template>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <AppHeader :is-dark="isDark" @toggle-theme="toggleTheme" />

        <main class="container mx-auto px-4 py-6">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start max-w-5xl mx-auto">
                <section class="order-2 lg:order-1">
                    <div id="wheel-card" class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
                        <div class="text-center mb-3">
                            <h1 class="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">Random Kids Name Wheel</h1>
                            <p class="text-sm text-gray-500 dark:text-gray-400">Tap add, then spin to pick a name</p>
                        </div>
                        <div id="wheel-container" class="relative mx-auto border-4 border-gray-900 dark:border-gray-200 rounded-full overflow-hidden select-none"
                            :style="{ width: sizePx, height: sizePx }">
                            <canvas ref="wheelCanvas" id="wheel" class="block transition-transform ease-out duration-[5000ms]"></canvas>
                            <div id="pointer" class="absolute -top-3 left-1/2 -translate-x-1/2"
                                style="width: 0; height: 0; border-left: 18px solid transparent; border-right: 18px solid transparent; border-bottom: 34px solid #ef4444;"></div>
                            <div class="absolute inset-0 flex items-center justify-center">
                                <div class="w-16 h-16 rounded-full bg-white/80 dark:bg-gray-900/80 backdrop-blur border border-gray-200 dark:border-gray-700 flex items-center justify-center text-xs font-semibold text-gray-700 dark:text-gray-200">Spin</div>
                            </div>
                        </div>
                        <div id="result" class="mt-4 text-center text-2xl font-bold text-orange-600 min-h-[2.25rem]">{{ resultText }}</div>
                        <button @click="spinWheel" :disabled="isSpinning || names.length < 2"
                            class="mt-2 w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99]">
                            Spin the Wheel
                        </button>
                    </div>
                </section>

                <aside class="order-1 lg:order-2">
                    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
                        <div class="flex gap-2 mb-3">
                            <input v-model="nameInput" @keyup.enter="addName" type="text" placeholder="Enter a name"
                                class="px-3 py-2 flex-1 border rounded" />
                            <button @click="addName" class="px-4 py-2 bg-green-600 text-white rounded">Add</button>
                        </div>
                        <div class="flex flex-wrap gap-2 mb-3">
                            <button @click="loadDefaults" class="px-3 py-1.5 bg-indigo-600 text-white rounded text-sm">Load Default 8</button>
                            <button @click="clearAll" class="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded text-sm">Clear</button>
                        </div>
                        <div class="flex flex-wrap gap-2 max-h-48 overflow-auto">
                            <span v-for="(name, index) in names" :key="index"
                                class="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-pink-50 text-pink-700 border border-pink-200 dark:bg-pink-900/20 dark:text-pink-200 dark:border-pink-800">
                                <span class="max-w-[9rem] truncate">{{ name }}</span>
                                <button @click="removeName(index)" class="text-pink-600 hover:text-pink-800 dark:text-pink-300">×</button>
                            </span>
                        </div>
                        <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">Saved locally on this device.</p>
                    </div>
                </aside>
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch, computed } from 'vue';
import AppHeader from '../components/AppHeader.vue';
import { useTheme } from '../composables/useTheme';

const { isDark, toggleTheme } = useTheme();

const nameInput = ref('');
const names = ref<string[]>([]);
const wheelCanvas = ref<HTMLCanvasElement | null>(null);
const resultText = ref('');

let isSpinning = false;

const size = ref(360);
const sizePx = computed(() => `${size.value}px`);

const STORAGE_KEY = 'nameWheel.names';
const DEFAULT_NAMES = ['Claire', 'Jack', 'Ben', 'Lily', 'Lucy', 'Tucker', 'Charlie', 'Bryce'];

const addName = () => {
    const name = nameInput.value.trim();
    if (name) {
        names.value.push(name);
        nameInput.value = '';
        drawWheel();
    }
};

const removeName = (index: number) => {
    names.value.splice(index, 1);
    drawWheel();
};

const clearAll = () => {
    names.value = [];
    resultText.value = '';
    saveNames();
    drawWheel();
};

const loadDefaults = () => {
    names.value = [...DEFAULT_NAMES];
    resultText.value = '';
    saveNames();
    drawWheel();
};

const updateCanvasDimensions = () => {
    const canvas = wheelCanvas.value;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(size.value * dpr);
    canvas.height = Math.floor(size.value * dpr);
    canvas.style.width = `${size.value}px`;
    canvas.style.height = `${size.value}px`;
};

const updateSize = () => {
    const viewportWidth = window.innerWidth || 360;
    const margin = 40; // match container padding for mobile
    const maxSize = 420;
    const calculated = Math.max(240, Math.min(maxSize, viewportWidth - margin));
    size.value = calculated;
    updateCanvasDimensions();
};

const drawWheel = () => {
    const canvas = wheelCanvas.value;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    // reset transform and clear at device pixel resolution
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (names.value.length === 0) return;

    const dpr = window.devicePixelRatio || 1;
    ctx.scale(dpr, dpr);
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = width / 2;
    const angle = (2 * Math.PI) / names.value.length;
    const colors = ['#ffadad', '#ffd6a5', '#fdffb6', '#caffbf', '#9bf6ff', '#a0c4ff', '#bdb2ff', '#ffc6ff'];

    names.value.forEach((name, i) => {
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, i * angle, (i + 1) * angle);
        ctx.closePath();
        ctx.fillStyle = colors[i % colors.length];
        ctx.fill();
        ctx.stroke();

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(i * angle + angle / 2);
        ctx.textAlign = 'right';
        ctx.fillStyle = '#000';
        ctx.font = '16px Arial';
        ctx.fillText(name, radius - 10, 10);
        ctx.restore();
    });
};

const spinWheel = () => {
    if (isSpinning) return;
    if (names.value.length < 2) {
        alert('Please add at least two names!');
        return;
    }
    drawWheel();
    resultText.value = '';
    isSpinning = true;

    const randomIndex = Math.floor(Math.random() * names.value.length);
    const sliceAngle = 360 / names.value.length;
    const baseRotations = 6 + Math.floor(Math.random() * 3); // 6-8 full spins
    const targetAngle = (360 * baseRotations) + (360 - (randomIndex * sliceAngle + sliceAngle / 2));

    const canvas = wheelCanvas.value;
    if (!canvas) return;
    canvas.style.transition = 'transform 4500ms cubic-bezier(0.12, 0.11, 0, 1)';
    canvas.style.transform = `rotate(${targetAngle}deg)`;

    setTimeout(() => {
        const selectedName = names.value[randomIndex];
        resultText.value = `Selected: ${selectedName}`;
        canvas.style.transition = 'none';
        canvas.style.transform = 'rotate(0deg)';
        isSpinning = false;
    }, 4600);
};

onMounted(() => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed)) {
                names.value = parsed.filter((v) => typeof v === 'string');
            }
        }
        if (names.value.length === 0) {
            names.value = [...DEFAULT_NAMES];
        }
    } catch {}
    updateSize();
    drawWheel();
    window.addEventListener('resize', updateSize, { passive: true });
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', updateSize);
});

const saveNames = () => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(names.value));
    } catch {}
};

watch(names, saveNames, { deep: true });
</script>
