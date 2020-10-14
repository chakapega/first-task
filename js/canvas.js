import { arrayOfRectangles } from './rectangles.js';
import { canvasWindowIndent, startedRectangleFillColor, redColorInHex } from './shared/constants.js';

export class Canvas {
  constructor(selectedCanvas) {
    this.canvas = selectedCanvas;
    this.ctx = this.canvas.getContext('2d');
    this.isDragOk = false;
    this.offsetX;
    this.offsetY;
    this.prevX;
    this.prevY;
    this.startX;
    this.startY;
  }

  start() {
    this.setSize();
    this.setOffsetXandY();
    this.drawRectangles();
    this.canvas.addEventListener('mousedown', this.mouseDownHandler.bind(this));
    this.canvas.addEventListener('mousemove', this.mouseMoveHandler.bind(this));
    this.canvas.addEventListener('mouseup', this.mouseUpHandler.bind(this));
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

  checkingForIntersectionOfRectAandB(rectA, rectB) {
    const topSideOfRectangleA = rectA.y;
    const leftSideOfRectangleA = rectA.x;
    const rightSideOfRectangleA = rectA.x + rectA.width;
    const bottomSideOfRectangleA = rectA.y + rectA.height;
    const topSideOfRectangleB = rectB.y;
    const leftSideOfRectangleB = rectB.x;
    const rightSideOfRectangleB = rectB.x + rectB.width;
    const bottomSideOfRectangleB = rectB.y + rectB.height;

    if (bottomSideOfRectangleA <= topSideOfRectangleB || rightSideOfRectangleA <= leftSideOfRectangleB) {
      return false;
    }

    if (topSideOfRectangleA >= bottomSideOfRectangleB || rightSideOfRectangleB <= leftSideOfRectangleA) {
      return false;
    }

    return true;
  }

  checkRectangleForIntersection(rectA) {
    let isCrossed = false;

    arrayOfRectangles.forEach(rectB => {
      if (rectA !== rectB && this.checkingForIntersectionOfRectAandB(rectA, rectB)) {
        isCrossed = true;
      }
    });

    return isCrossed;
  }

  setCrossedPropToRectangles() {
    arrayOfRectangles.forEach(rect => {
      if (this.checkRectangleForIntersection(rect)) {
        rect.isCrossed = true;
      } else {
        rect.isCrossed = false;
      }
    });
  }

  setColorPropToRectangles() {
    arrayOfRectangles.forEach(rect => {
      if (rect.isCrossed) {
        rect.fillColor = redColorInHex;
      } else {
        rect.fillColor = startedRectangleFillColor;
      }
    });
  }

  mouseDownHandler(e) {
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
        this.startX = rectangle.x;
        this.startY = rectangle.y;
        this.isDragOk = true;
        rectangle.isDragging = true;
      }
    });

    this.prevX = currentX;
    this.prevY = currentY;
  }

  mouseMoveHandler(e) {
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
        this.setCrossedPropToRectangles();
        this.setColorPropToRectangles();
      }
    });

    this.drawRectangles();
    this.prevX = currentX;
    this.prevY = currentY;
  }

  mouseUpHandler() {
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

        this.setCrossedPropToRectangles();
        this.setColorPropToRectangles();
        this.drawRectangles();
      }
    });
  }
}
