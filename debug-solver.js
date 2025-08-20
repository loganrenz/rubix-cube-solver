// Simple test to debug the solver issue
const { test, expect } = require('vitest');
const { describe, it, beforeEach } = require('vitest');

test('debug solver with solved cube', () => {
  console.log('Starting debug test...');
  // Import the needed files
  const { CubeModel } = require('./src/utils/cubeModel');
  const { LayerByLayerSolver } = require('./src/utils/solver');
  
  const cube = new CubeModel();
  console.log('Created cube, is solved?', cube.isSolved());
  
  const solver = new LayerByLayerSolver(cube);
  const result = solver.solve();
  
  console.log('Solver result:', {
    solved: result.solved,
    moveCount: result.moveCount,
    error: result.error,
    hasSteps: !!result.steps,
    stepsLength: result.steps?.length
  });
  
  if (result.error) {
    console.log('ERROR:', result.error);
  }
  
  expect(result.solved).toBe(true);
});