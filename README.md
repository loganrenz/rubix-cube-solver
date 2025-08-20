# Rubik's Cube Solver

A modern, mobile-first 3D Rubik's Cube solver built with Vue 3, TypeScript, Vite, and Tailwind CSS. Features an interactive 3D visualization, step-by-step solution playback, and full mobile optimization with a focus on iPhone compatibility.

![Rubik's Cube Solver](https://img.shields.io/badge/Vue.js-3.5-4FC08D?logo=vue.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7.1-646CFF?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1-06B6D4?logo=tailwindcss)

## Features

- **3D Visualization**: Interactive 3D cube rendered with Three.js
- **Layer-by-Layer Solver**: Implements the beginner-friendly CFOP method
- **Step-by-Step Playback**: Watch the solution with adjustable speed controls
- **Mobile-First Design**: Optimized for touch devices, especially iPhone
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Layout**: Adapts seamlessly from mobile to desktop
- **Touch Gestures**: Swipe to rotate the cube on mobile devices
- **Solution Display**: Grouped by solving stages with move notation
- **Manual Controls**: Apply individual moves to learn algorithms

## Tech Stack

- **Frontend Framework**: Vue 3 (Composition API)
- **Build Tool**: Vite
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **3D Graphics**: Three.js
- **Testing**: Vitest
- **Package Manager**: npm

## Getting Started

### Prerequisites

- Node.js 16+ and npm 8+
- Modern web browser with WebGL support

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd rubiks-cube-solver
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Running Tests

```bash
# Run tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## Usage Guide

### Basic Operations

1. **Scramble**: Click the "Scramble" button to randomize the cube
2. **Solve**: Click "Solve" to calculate the solution
3. **Playback**: Use the playback controls to watch the solution:
   - ▶ Play: Auto-play the solution
   - ⏸ Pause: Pause the animation
   - ⏮/⏭ Step: Move one step backward/forward
   - Speed slider: Adjust animation speed

### 3D Cube Controls

- **Desktop**: Click and drag to rotate the cube view
- **Mobile**: Touch and swipe to rotate
- **Zoom**: Scroll wheel (desktop) or pinch (mobile)

### Move Notation

- `F/B/U/D/L/R`: Face turns (Front/Back/Up/Down/Left/Right)
- `'`: Counter-clockwise (e.g., F' = Front counter-clockwise)
- `2`: 180° turn (e.g., F2 = Front 180°)

### Mobile Features

- Optimized for iPhone and iOS Safari
- Touch-friendly controls with adequate sizing
- Responsive layout with collapsible panels
- Safe area handling for devices with notches
- Haptic feedback support (where available)

## Project Structure

```
rubiks-cube-solver/
├── src/
│   ├── components/       # Vue components
│   │   ├── CubeVisualization.vue
│   │   ├── ControlPanel.vue
│   │   ├── SolutionDisplay.vue
│   │   ├── HelpModal.vue
│   │   └── AppHeader.vue
│   ├── composables/      # Vue composables
│   │   ├── useCube.ts
│   │   └── useTheme.ts
│   ├── types/           # TypeScript types
│   │   └── cube.ts
│   ├── utils/           # Utility functions
│   │   ├── cubeModel.ts
│   │   ├── solver.ts
│   │   └── notation.ts
│   ├── tests/           # Unit tests
│   │   ├── cubeModel.test.ts
│   │   └── solver.test.ts
│   ├── App.vue          # Root component
│   ├── main.ts          # Entry point
│   └── style.css        # Global styles
├── public/              # Static assets
├── index.html           # HTML template
├── vite.config.ts       # Vite configuration
├── tailwind.config.js   # Tailwind configuration
├── postcss.config.js    # PostCSS configuration
├── tsconfig.json        # TypeScript configuration
└── package.json         # Project dependencies
```

## Key Components

### CubeModel

The core data structure representing the cube state. Handles move application, scrambling, and state management.

### LayerByLayerSolver

Implements the solving algorithm using these stages:

1. White cross formation
2. First layer corners
3. Second layer edges
4. Yellow cross
5. Yellow cross positioning
6. Yellow corner positioning
7. Yellow corner orientation

### CubeVisualization

Three.js-based 3D rendering with touch gesture support and mobile optimizations.

## Performance Optimizations

- Lazy loading for better initial load time
- Efficient Three.js rendering with proper cleanup
- Debounced resize handlers
- Optimized bundle size with tree-shaking
- CSS purging for minimal styles
- Touch event passive listeners

## Browser Support

- Chrome 79+
- Safari 13+ (iOS Safari optimized)
- Firefox 72+
- Edge 79+

## Mobile Testing

For best results when testing on iPhone:

1. Use Safari Developer Tools for remote debugging
2. Test on actual devices when possible
3. Use iOS Simulator with various iPhone models
4. Enable touch simulation in desktop browsers

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the MIT License.

## Assumptions & Design Decisions

- **3x3 Only**: The solver is specifically designed for 3x3 cubes
- **Layer-by-Layer**: Uses the beginner-friendly method rather than advanced algorithms
- **Mobile-First**: UI decisions prioritize mobile usability over desktop features
- **Touch Optimization**: All interactions are designed for touch-first interaction
- **Performance**: Animations are capped at 60fps for smooth mobile performance

## Future Enhancements

- [ ] Support for other cube sizes (2x2, 4x4, etc.)
- [ ] Advanced solving methods (CFOP, Roux, ZZ)
- [ ] Time tracking and statistics
- [ ] Custom cube state input via camera
- [ ] Offline PWA support
- [ ] Multiplayer racing mode
- [ ] Tutorial mode with guided solving
