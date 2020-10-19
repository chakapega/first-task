import { Canvas } from './canvas.js';

const selectedCanvas = document.querySelector('#canvas');
const canvas = new Canvas(selectedCanvas);

canvas.start();
