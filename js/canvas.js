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
    this.setOffsets_X_and_Y();
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

  setOffsets_X_and_Y() {
    const domRect = canvas.getBoundingClientRect();
    const { left, top } = domRect;

    this.offsetX = left;
    this.offsetY = top;
  }

  drawRectangles() {
    this.clear();

    arrayOfRectangles.forEach(rectData => {
      const { x, y, width, height } = rectData;

      this.ctx.fillStyle = rectData.fillColor;
      this.ctx.fillRect(x, y, width, height);
    });
  }

  clear() {
    const { width, height } = this.canvas;

    this.ctx.clearRect(0, 0, width, height);
  }

  checkRectangles_A_and_B_forIntersection(rectA, rectB) {
    const topSideOfRectA = rectA.y;
    const leftSideOfRectA = rectA.x;
    const rightSideOfRectA = rectA.x + rectA.width;
    const bottomSideOfRectA = rectA.y + rectA.height;
    const topSideOfRectB = rectB.y;
    const leftSideOfRectB = rectB.x;
    const rightSideOfRectB = rectB.x + rectB.width;
    const bottomSideOfRectB = rectB.y + rectB.height;

    if (bottomSideOfRectA <= topSideOfRectB || rightSideOfRectA <= leftSideOfRectB) {
      return false;
    }

    if (topSideOfRectA >= bottomSideOfRectB || rightSideOfRectB <= leftSideOfRectA) {
      return false;
    }

    return true;
  }

  checkRectangleForIntersection(rectA) {
    let isCrossed = false;

    arrayOfRectangles.forEach(rectB => {
      if (rectA !== rectB && this.checkRectangles_A_and_B_forIntersection(rectA, rectB)) isCrossed = true;
    });

    return isCrossed;
  }

  setCrossedPropToRectangles() {
    arrayOfRectangles.forEach(rect => {
      rect.isCrossed = this.checkRectangleForIntersection(rect) ? true : false;
    });
  }

  setColorPropToRectangles() {
    arrayOfRectangles.forEach(rect => {
      rect.fillColor = rect.isCrossed ? redColorInHex : startedRectangleFillColor;
    });
  }

  getCurrentXandY(e) {
    return { currentX: e.clientX - this.offsetX, currentY: e.clientY - this.offsetY };
  }

  mouseDownHandler(e) {
    const { currentX, currentY } = this.getCurrentXandY(e);

    this.isDragOk = false;

    arrayOfRectangles.forEach(rect => {
      if (currentX > rect.x && currentX < rect.x + rect.width && currentY > rect.y && currentY < rect.y + rect.height) {
        this.startX = rect.x;
        this.startY = rect.y;
        this.isDragOk = true;
        rect.isDragging = true;
      }
    });

    this.prevX = currentX;
    this.prevY = currentY;
  }

  mouseMoveHandler(e) {
    if (!this.isDragOk) {
      return null;
    }

    const { currentX, currentY } = this.getCurrentXandY(e);
    const xMovedDistance = currentX - this.prevX;
    const yNovedDistance = currentY - this.prevY;

    arrayOfRectangles.forEach(rect => {
      if (rect.isDragging) {
        rect.x += xMovedDistance;
        rect.y += yNovedDistance;
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

    arrayOfRectangles.forEach(rectA => {
      if (!rectA.isDragging) {
        return null;
      }

      rectA.isDragging = false;

      arrayOfRectangles.forEach(rectB => {
        if (rectB.isCrossed) {
          rectA.x = this.startX;
          rectA.y = this.startY;
        }
      });

      this.setCrossedPropToRectangles();
      this.setColorPropToRectangles();
      this.drawRectangles();
    });
  }
}
