import { arrayOfRectangles } from './rectangles.js';
import { canvasWindowIndent, startedRectangleFillColor, redColorInHex } from './shared/constants.js';

export class Canvas {
  constructor(selectedCanvas) {
    this.canvas = selectedCanvas;
    this.ctx = this.canvas.getContext('2d');
    this.isDragOk = false;
    this.prevX;
    this.prevY;
    this.startX;
    this.startY;
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

    this.canvas.width = width - canvasWindowIndent;
    this.canvas.height = height - canvasWindowIndent;
  }

  setOffsetXandY() {
    const domRect = canvas.getBoundingClientRect();
    const { left, top } = domRect;

    this.offsetX = left;
    this.offsetY = top;
  }

  drawRectangles() {
    this.clear();

    arrayOfRectangles.forEach(rectangleData => {
      const { x, y, width, height } = rectangleData;
      this.ctx.fillStyle = rectangleData.fillColor;
      this.ctx.fillRect(x, y, width, height);
    });
  }

  clear() {
    const { width, height } = this.canvas;

    this.ctx.clearRect(0, 0, width, height);
  }

  renderStartedRectangles() {
    this.drawRectangles();
  }

  checkRectanglesForIntersection(rectangleA, rectangleB) {
    const topSideOfRectangleA = rectangleA.y;
    const leftSideOfRectangleA = rectangleA.x;
    const rightSideOfRectangleA = rectangleA.x + rectangleA.width;
    const bottomSideOfRectangleA = rectangleA.y + rectangleA.height;
    const topSideOfRectangleB = rectangleB.y;
    const leftSideOfRectangleB = rectangleB.x;
    const rightSideOfRectangleB = rectangleB.x + rectangleB.width;
    const bottomSideOfRectangleB = rectangleB.y + rectangleB.height;

    if (bottomSideOfRectangleA <= topSideOfRectangleB || rightSideOfRectangleA <= leftSideOfRectangleB) {
      return false;
    }

    if (topSideOfRectangleA >= bottomSideOfRectangleB || rightSideOfRectangleB <= leftSideOfRectangleA) {
      return false;
    }

    return true;
  }

  addMouseDownHandler() {
    this.canvas.addEventListener('mousedown', e => {
      e.preventDefault();
      e.stopPropagation();

      const currentX = e.clientX - this.offsetX;
      const currentY = e.clientY - this.offsetY;

      this.isDragOk = false;

      arrayOfRectangles.forEach(rectangle => {
        if (
          currentX > rectangle.x &&
          currentX < rectangle.x + rectangle.width &&
          currentY > rectangle.y &&
          currentY < rectangle.y + rectangle.height
        ) {
          this.isDragOk = true;
          rectangle.isDragging = true;
          this.startX = rectangle.x;
          this.startY = rectangle.y;
        }
      });

      this.prevX = currentX;
      this.prevY = currentY;
    });
  }

  addMouseMoveHandler() {
    this.canvas.addEventListener('mousemove', e => {
      e.preventDefault();
      e.stopPropagation();

      this.moveRectangle(e);
    });
  }

  moveRectangle(e) {
    if (!this.isDragOk) {
      return null;
    }

    const currentX = e.clientX - this.offsetX;
    const currentY = e.clientY - this.offsetY;
    const xMovedDistance = currentX - this.prevX;
    const yNovedDistance = currentY - this.prevY;

    arrayOfRectangles.forEach(rectangle => {
      if (rectangle.isDragging) {
        rectangle.x += xMovedDistance;
        rectangle.y += yNovedDistance;

        arrayOfRectangles.forEach(addRect => {
          if (rectangle !== addRect) {
            if (this.checkRectanglesForIntersection(rectangle, addRect)) {
              addRect.fillColor = redColorInHex;
              addRect.isCrossed = true;
            } else {
              addRect.fillColor = startedRectangleFillColor;
              addRect.isCrossed = false;
            }
          }
        });
      }
    });

    this.drawRectangles();
    this.prevX = currentX;
    this.prevY = currentY;
  }

  addMouseUpHandler() {
    this.canvas.addEventListener('mouseup', e => {
      e.preventDefault();
      e.stopPropagation();

      this.isDragOk = false;

      arrayOfRectangles.forEach(rectangle => {
        if (rectangle.isDragging) {
          rectangle.isDragging = false;

          arrayOfRectangles.forEach(addRect => {
            if (addRect.isCrossed) {
              rectangle.x = this.startX;
              rectangle.y = this.startY;
            }
          });

          this.drawRectangles();
        }
      });
    });
  }
}
