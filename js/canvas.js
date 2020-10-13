import { arrayOfRectangles } from './rectangles.js';

export class Canvas {
  constructor() {
    this.canvas = document.querySelector('#canvas');
    this.ctx = this.canvas.getContext('2d');
  }

  setSize() {
    const { innerWidth: width, innerHeight: height } = window;

    this.canvas.width = width - 40;
    this.canvas.height = height - 40;
  }

  renderStartedRectangles() {
    let sumOfHeightsRenderedRectangles = 0;

    this.ctx.fillStyle = 'black';

    arrayOfRectangles.forEach((rectangleData, index) => {
      const { width, height } = rectangleData;

      if (index === 0) {
        this.ctx.fillRect(20, 20, width, height);
      } else {
        this.ctx.fillRect(
          20,
          (index + 1) * 20 + sumOfHeightsRenderedRectangles,
          width,
          height
        );
      }

      sumOfHeightsRenderedRectangles += height;
    });
  }
}
