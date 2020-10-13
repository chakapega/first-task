import { arrayOfRectangles } from './rectangles.js';

export class Canvas {
  constructor() {
    this.canvas = document.querySelector('#canvas');
    this.ctx = this.canvas.getContext('2d');
    this.isDragOk = false;
    this.xStart;
    this.yStart;
  }

  start() {
    this.setSize();
    this.setOffsetXandY();
    this.renderStartedRectangles();
    this.addMouseDownHandler();
    this.addMouseMoveHandler();
    this.addMouseUpHandler();
  }

  setSize() {
    const { innerWidth: width, innerHeight: height } = window;

    this.canvas.width = width - 40;
    this.canvas.height = height - 40;
  }

  setOffsetXandY() {
    const domRect = canvas.getBoundingClientRect();
    const { left, top } = domRect;

    this.offsetX = left;
    this.offsetY = top;
  }

  draw() {
    this.clear();
    this.ctx.fillStyle = 'black';

    arrayOfRectangles.forEach((rectangleData) => {
      const { x, y, width, height } = rectangleData;

      this.ctx.fillRect(x, y, width, height);
    });
  }

  clear() {
    const { width, height } = this.canvas;

    this.ctx.clearRect(0, 0, width, height);
  }

  renderStartedRectangles() {
    this.draw();
  }

  addMouseDownHandler() {
    this.canvas.addEventListener('mousedown', (e) => {
      console.log('mousedown');
      e.preventDefault();
      e.stopPropagation();

      const currentX = e.clientX - this.offsetX;
      const currentY = e.clientY - this.offsetY;

      this.isDragOk = false;

      arrayOfRectangles.forEach((rectangle) => {
        if (
          currentX > rectangle.x &&
          currentX < rectangle.x + rectangle.width &&
          currentY > rectangle.y &&
          currentY < rectangle.y + rectangle.height
        ) {
          this.isDragOk = true;
          rectangle.isDragging = true;
        }
      });

      this.xStart = currentX;
      this.yStart = currentY;
    });
  }

  addMouseMoveHandler() {
    this.canvas.addEventListener('mousemove', (e) => {
      console.log('mousemove');
      if (this.isDragOk) {
        e.preventDefault();
        e.stopPropagation();

        const currentX = e.clientX - this.offsetX;
        const currentY = e.clientY - this.offsetY;
        const xMovedDistance = currentX - this.xStart;
        const yNovedDistance = currentY - this.yStart;

        arrayOfRectangles.forEach((rectangle) => {
          if (rectangle.isDragging) {
            rectangle.x += xMovedDistance;
            rectangle.y += yNovedDistance;
          }
        });

        this.draw();
        this.xStart = currentX;
        this.yStart = currentY;
      }
    });
  }

  addMouseUpHandler() {
    this.canvas.addEventListener('mouseup', (e) => {
      e.preventDefault();
      e.stopPropagation();

      this.isDragOk = false;

      arrayOfRectangles.forEach((rectangle) => {
        if (rectangle.isDragging === true) rectangle.isDragging = false;
      });
    });
  }
}
