<template>
    <div ref="containerRef" class="cube-container relative w-full h-full touch-manipulation">
        <canvas ref="canvasRef" class="w-full h-full" />
        <div v-if="isLoading" class="absolute inset-0 flex items-center justify-center bg-gray-900/20">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Color, Move } from '../types/cube'
import type { CubeState } from '../types/cube'

const props = defineProps<{
    cubeState: CubeState
    currentMove?: Move | null | undefined
    isDark: boolean
}>()

const containerRef = ref<HTMLDivElement>()
const canvasRef = ref<HTMLCanvasElement>()
const isLoading = ref(true)

let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let controls: OrbitControls
let cubeGroup: THREE.Group
let animationId: number

const colorMap: Record<Color, string> = {
    [Color.WHITE]: '#FFFFFF',
    [Color.YELLOW]: '#FFD500',
    [Color.RED]: '#B71234',
    [Color.ORANGE]: '#FF5800',
    [Color.GREEN]: '#009E60',
    [Color.BLUE]: '#0046AD'
}

const facePositions = [
    { face: 'right', rotation: [0, Math.PI / 2, 0], position: [1.5, 0, 0] },
    { face: 'left', rotation: [0, -Math.PI / 2, 0], position: [-1.5, 0, 0] },
    { face: 'up', rotation: [-Math.PI / 2, 0, 0], position: [0, 1.5, 0] },
    { face: 'down', rotation: [Math.PI / 2, 0, 0], position: [0, -1.5, 0] },
    { face: 'front', rotation: [0, 0, 0], position: [0, 0, 1.5] },
    { face: 'back', rotation: [0, Math.PI, 0], position: [0, 0, -1.5] }
]

const createSticker = (color: Color, x: number, y: number) => {
    const geometry = new THREE.PlaneGeometry(0.85, 0.85)
    const material = new THREE.MeshPhongMaterial({
        color: colorMap[color],
        side: THREE.DoubleSide,
        specular: 0x222222,
        shininess: 30
    })
    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.set(x, y, 0.01)
    return mesh
}

const createCubeFace = (faceColors: Color[][], faceInfo: typeof facePositions[0]) => {
    const group = new THREE.Group()

    // Create black backing
    const backingGeometry = new THREE.PlaneGeometry(3, 3)
    const backingMaterial = new THREE.MeshPhongMaterial({
        color: 0x000000,
        side: THREE.DoubleSide
    })
    const backing = new THREE.Mesh(backingGeometry, backingMaterial)
    group.add(backing)

    // Add stickers
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            const x = (col - 1) * 1
            const y = (1 - row) * 1
            const sticker = createSticker(faceColors[row][col], x, y)
            group.add(sticker)
        }
    }

    // Apply rotation and position
    group.rotation.set(faceInfo.rotation[0], faceInfo.rotation[1], faceInfo.rotation[2])
    group.position.set(faceInfo.position[0], faceInfo.position[1], faceInfo.position[2])

    return group
}

const createRubiksCube = () => {
    cubeGroup = new THREE.Group()

    // Create cube structure (black inner cube)
    const cubeGeometry = new THREE.BoxGeometry(2.9, 2.9, 2.9)
    const cubeMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 })
    const innerCube = new THREE.Mesh(cubeGeometry, cubeMaterial)
    cubeGroup.add(innerCube)

    // Add faces
    const state = props.cubeState
    const faces = [
        { colors: state.right.colors, info: facePositions[0] },
        { colors: state.left.colors, info: facePositions[1] },
        { colors: state.up.colors, info: facePositions[2] },
        { colors: state.down.colors, info: facePositions[3] },
        { colors: state.front.colors, info: facePositions[4] },
        { colors: state.back.colors, info: facePositions[5] }
    ]

    faces.forEach(({ colors, info }) => {
        const face = createCubeFace(colors, info)
        cubeGroup.add(face)
    })

    scene.add(cubeGroup)
}

const updateCube = () => {
    if (!cubeGroup) return

    // Remove old cube
    scene.remove(cubeGroup)
    cubeGroup.traverse((child) => {
        if (child instanceof THREE.Mesh) {
            child.geometry.dispose()
            if (child.material instanceof THREE.Material) {
                child.material.dispose()
            }
        }
    })

    // Create new cube with updated state
    createRubiksCube()
}

const initThreeJS = () => {
    if (!containerRef.value || !canvasRef.value) return

    // Scene setup
    scene = new THREE.Scene()
    scene.background = new THREE.Color(props.isDark ? 0x1f2937 : 0xf3f4f6)

    // Camera setup
    const aspect = containerRef.value.clientWidth / containerRef.value.clientHeight
    camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000)
    camera.position.set(5, 5, 5)
    camera.lookAt(0, 0, 0)

    // Renderer setup
    renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.value,
        antialias: true,
        alpha: true
    })
    renderer.setSize(containerRef.value.clientWidth, containerRef.value.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(5, 5, 5)
    directionalLight.castShadow = true
    directionalLight.shadow.camera.near = 0.1
    directionalLight.shadow.camera.far = 20
    directionalLight.shadow.camera.left = -5
    directionalLight.shadow.camera.right = 5
    directionalLight.shadow.camera.top = 5
    directionalLight.shadow.camera.bottom = -5
    scene.add(directionalLight)

    // Controls
    controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.minDistance = 5
    controls.maxDistance = 15
    controls.enablePan = false
    controls.touches = {
        ONE: THREE.TOUCH.ROTATE,
        TWO: THREE.TOUCH.DOLLY_ROTATE
    }

    // Create cube
    createRubiksCube()

    isLoading.value = false
}

const animate = () => {
    animationId = requestAnimationFrame(animate)

    controls.update()

    // Subtle rotation when idle
    if (cubeGroup && !controls.enabled) {
        cubeGroup.rotation.y += 0.001
    }

    renderer.render(scene, camera)
}

const handleResize = () => {
    if (!containerRef.value || !camera || !renderer) return

    const width = containerRef.value.clientWidth
    const height = containerRef.value.clientHeight

    camera.aspect = width / height
    camera.updateProjectionMatrix()

    renderer.setSize(width, height)
}

// Touch gesture handling for mobile
let touchStartX = 0
let touchStartY = 0
let touchStartTime = 0

const handleTouchStart = (e: TouchEvent) => {
    if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX
        touchStartY = e.touches[0].clientY
        touchStartTime = Date.now()
    }
}

const handleTouchEnd = (e: TouchEvent) => {
    if (e.changedTouches.length === 1 && Date.now() - touchStartTime < 300) {
        const deltaX = e.changedTouches[0].clientX - touchStartX
        const deltaY = e.changedTouches[0].clientY - touchStartY

        // Detect swipe gestures
        if (Math.abs(deltaX) > 50 || Math.abs(deltaY) > 50) {
            // Emit swipe event for parent to handle cube moves
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                // Horizontal swipe
                console.log(deltaX > 0 ? 'Swipe right' : 'Swipe left')
            } else {
                // Vertical swipe
                console.log(deltaY > 0 ? 'Swipe down' : 'Swipe up')
            }
        }
    }
}

onMounted(() => {
    initThreeJS()
    animate()

    window.addEventListener('resize', handleResize)
    containerRef.value?.addEventListener('touchstart', handleTouchStart, { passive: true })
    containerRef.value?.addEventListener('touchend', handleTouchEnd, { passive: true })
})

onUnmounted(() => {
    cancelAnimationFrame(animationId)
    window.removeEventListener('resize', handleResize)
    containerRef.value?.removeEventListener('touchstart', handleTouchStart)
    containerRef.value?.removeEventListener('touchend', handleTouchEnd)

    // Cleanup Three.js resources
    if (renderer) {
        renderer.dispose()
    }
    if (cubeGroup) {
        cubeGroup.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.geometry.dispose()
                if (child.material instanceof THREE.Material) {
                    child.material.dispose()
                }
            }
        })
    }
})

// Watch for cube state changes
watch(() => props.cubeState, () => {
    updateCube()
}, { deep: true })

// Watch for theme changes
watch(() => props.isDark, (isDark) => {
    if (scene) {
        scene.background = new THREE.Color(isDark ? 0x1f2937 : 0xf3f4f6)
    }
})
</script>

<style scoped>
.cube-container {
    min-height: 300px;
}

@media (max-width: 640px) {
    .cube-container {
        min-height: 250px;
    }
}
</style>
