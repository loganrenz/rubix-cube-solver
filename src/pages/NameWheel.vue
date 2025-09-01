<template>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <AppHeader :is-dark="isDark" @toggle-theme="toggleTheme" />

        <main class="container mx-auto px-4 py-6">
            <div class="text-center">
                <h1 class="text-2xl font-bold text-pink-500 mb-4">Random Kids Name Wheel</h1>

                <div id="input-section" class="mb-4">
                    <input v-model="nameInput" @keyup.enter="addName" type="text" placeholder="Enter a name"
                        class="px-3 py-2 w-64 border rounded mr-2" />
                    <button @click="addName" class="px-4 py-2 bg-green-600 text-white rounded">Add Name</button>
                </div>

                <ul id="names-list" class="mb-2">
                    <li v-for="(name, index) in names" :key="index"
                        class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 mx-auto my-1 p-2 w-64 flex items-center justify-between">
                        <span class="truncate">{{ name }}</span>
                        <button @click="removeName(index)" class="px-2 py-1 bg-red-600 text-white rounded">Remove</button>
                    </li>
                </ul>

                <button @click="spinWheel" class="px-4 py-2 bg-blue-600 text-white rounded my-2">Spin the Wheel!</button>

                <div id="wheel-container" class="relative mx-auto border-2 border-gray-700 rounded-full overflow-hidden" style="width: 400px; height: 400px;">
                    <canvas ref="wheelCanvas" id="wheel" width="400" height="400" class="transition-transform ease-out duration-[5000ms]"></canvas>
                    <div id="pointer" class="absolute -top-2 left-1/2 -translate-x-1/2" style="width: 0; height: 0; border-left: 15px solid transparent; border-right: 15px solid transparent; border-bottom: 30px solid red;"></div>
                </div>

                <div id="result" class="mt-4 text-2xl text-orange-600">{{ resultText }}</div>
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import AppHeader from '../components/AppHeader.vue';
import { useTheme } from '../composables/useTheme';

const { isDark, toggleTheme } = useTheme();

const nameInput = ref('');
const names = ref<string[]>([]);
const wheelCanvas = ref<HTMLCanvasElement | null>(null);
const resultText = ref('');

let isSpinning = false;

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

const drawWheel = () => {
    const canvas = wheelCanvas.value;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (names.value.length === 0) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = canvas.width / 2;
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
    drawWheel();
});
</script>
