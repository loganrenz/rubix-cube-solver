<template>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <AppHeader :is-dark="isDark" @toggle-theme="toggleTheme" />

        <main class="container mx-auto px-4 py-6">
            <div class="max-w-md mx-auto text-center">
                <h1 class="text-2xl font-bold text-pink-500 mb-4">Random Kids Name Wheel</h1>

                <div id="input-section" class="mb-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <input v-model="nameInput" @keyup.enter="addName" type="text" placeholder="Enter a name"
                        class="px-3 py-2 w-full sm:w-64 border rounded" />
                    <div class="flex gap-2">
                        <button @click="addName" class="px-4 py-2 bg-green-600 text-white rounded w-full sm:w-auto">Add</button>
                        <button @click="clearAll" class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded w-full sm:w-auto">Clear</button>
                    </div>
                </div>

                <ul id="names-list" class="mb-3 max-h-48 overflow-auto">
                    <li v-for="(name, index) in names" :key="index"
                        class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 mx-auto my-1 p-2 w-full flex items-center justify-between rounded">
                        <span class="truncate text-left">{{ name }}</span>
                        <button @click="removeName(index)" class="px-2 py-1 bg-red-600 text-white rounded ml-2">Remove</button>
                    </li>
                </ul>

                <button @click="spinWheel" :disabled="isSpinning || names.length < 2"
                    class="px-4 py-2 bg-blue-600 text-white rounded my-2 disabled:opacity-50 disabled:cursor-not-allowed w-full">
                    Spin the Wheel!
                </button>

                <div id="wheel-container" class="relative mx-auto border-2 border-gray-700 rounded-full overflow-hidden"
                    :style="{ width: sizePx, height: sizePx }">
                    <canvas ref="wheelCanvas" id="wheel" class="w-full h-full transition-transform ease-out duration-[5000ms]"></canvas>
                    <div id="pointer" class="absolute -top-2 left-1/2 -translate-x-1/2" style="width: 0; height: 0; border-left: 15px solid transparent; border-right: 15px solid transparent; border-bottom: 30px solid red;"></div>
                </div>

                <div id="result" class="mt-4 text-2xl text-orange-600 min-h-[2.25rem]">{{ resultText }}</div>
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
    const targetAngle = (360 * 5) + (360 - (randomIndex * sliceAngle + sliceAngle / 2));

    const canvas = wheelCanvas.value;
    if (!canvas) return;
    canvas.style.transition = 'transform 5s ease-out';
    canvas.style.transform = `rotate(${targetAngle}deg)`;

    setTimeout(() => {
        const selectedName = names.value[randomIndex];
        resultText.value = `Selected: ${selectedName}`;
        canvas.style.transition = 'none';
        canvas.style.transform = 'rotate(0deg)';
        isSpinning = false;
    }, 5000);
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
