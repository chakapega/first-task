import { Canvas } from './canvas.js';

const canvas = new Canvas();

canvas.setSize();
canvas.setOffsetXandY();
canvas.renderStartedRectangles();
canvas.addMouseDownHandler();
canvas.addMouseMoveHandler();
