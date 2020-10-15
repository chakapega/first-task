import { arrayOfRectangles } from './rectangles.js';
import { canvasWindowIndent, startedRectangleFillColor, redColorInHex, stickyDistance } from './shared/constants.js';

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

  checkRectangles_A_and_B_forSticking(rectA, rectB) {
    const topSideOfRectA = rectA.y - stickyDistance;
    const leftSideOfRectA = rectA.x - stickyDistance;
    const rightSideOfRectA = rectA.x + rectA.width + stickyDistance;
    const bottomSideOfRectA = rectA.y + rectA.height + stickyDistance;
    const topSideOfRectB = rectB.y - stickyDistance;
    const leftSideOfRectB = rectB.x - stickyDistance;
    const rightSideOfRectB = rectB.x + rectB.width + stickyDistance;
    const bottomSideOfRectB = rectB.y + rectB.height + stickyDistance;

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

  checkRectangleForSticking(rectA) {
    let isSticked = false;

    arrayOfRectangles.forEach(rectB => {
      if (rectA !== rectB && this.checkRectangles_A_and_B_forSticking(rectA, rectB)) isSticked = true;
    });

    return isSticked;
  }

  setStickedPropToRectangles() {
    arrayOfRectangles.forEach(rect => {
      rect.isSticked = this.checkRectangleForSticking(rect) ? true : false;
    });
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

  setStickedPositionToDraggingRectangle(draggingRect, standingRect) {
    const draggingRectCenter = {
      x: draggingRect.x + draggingRect.width / 2,
      y: draggingRect.y + draggingRect.height / 2,
    };
    const standingRectCenter = {
      x: standingRect.x + standingRect.width / 2,
      y: standingRect.y + standingRect.height / 2,
    };

    if (draggingRectCenter.x < standingRectCenter.x && draggingRectCenter.y < standingRectCenter.y) {
      if (standingRectCenter.x - draggingRectCenter.x < standingRectCenter.y - draggingRectCenter.y) {
        draggingRect.stickedPosition = 'top-left';
      } else {
        draggingRect.stickedPosition = 'left-top';
      }
    } else if (draggingRectCenter.x > standingRectCenter.x && draggingRectCenter.y < standingRectCenter.y) {
      if (draggingRectCenter.x - standingRectCenter.x < standingRectCenter.y - draggingRectCenter.y) {
        draggingRect.stickedPosition = 'top-right';
      } else {
        draggingRect.stickedPosition = 'right-top';
      }
    } else if (draggingRectCenter.x > standingRectCenter.x && draggingRectCenter.y > standingRectCenter.y) {
      if (draggingRectCenter.x - standingRectCenter.x > draggingRectCenter.y - standingRectCenter.y) {
        draggingRect.stickedPosition = 'right-bottom';
      } else {
        draggingRect.stickedPosition = 'bottom-right';
      }
    } else if (draggingRectCenter.x < standingRectCenter.x && draggingRectCenter.y > standingRectCenter.y) {
      if (standingRectCenter.x - draggingRectCenter.x > draggingRectCenter.y - standingRectCenter.y) {
        draggingRect.stickedPosition = 'left-bottom';
      } else {
        draggingRect.stickedPosition = 'bottom-left';
      }
    }
  }

  changeCoordinatesOfRectangleForConcatenation() {
    const [draggingAndStickingRect] = arrayOfRectangles.filter(rect => rect.isDragging && rect.isSticked);
    const [standingAndStickedRect] = arrayOfRectangles.filter(rect => !rect.isDragging && rect.isSticked);

    if (!draggingAndStickingRect) return null;

    this.setStickedPositionToDraggingRectangle(draggingAndStickingRect, standingAndStickedRect);

    switch (draggingAndStickingRect.stickedPosition) {
      case 'top-left':
        draggingAndStickingRect.x = standingAndStickedRect.x;
        draggingAndStickingRect.y = standingAndStickedRect.y - draggingAndStickingRect.height;
        break;
      case 'top-right':
        draggingAndStickingRect.x =
          standingAndStickedRect.x + standingAndStickedRect.width - draggingAndStickingRect.width;
        draggingAndStickingRect.y = standingAndStickedRect.y - draggingAndStickingRect.height;
        break;
      case 'bottom-right':
        draggingAndStickingRect.x =
          standingAndStickedRect.x + standingAndStickedRect.width - draggingAndStickingRect.width;
        draggingAndStickingRect.y = standingAndStickedRect.y + standingAndStickedRect.height;
        break;
      case 'bottom-left':
        draggingAndStickingRect.x = standingAndStickedRect.x;
        draggingAndStickingRect.y = standingAndStickedRect.y + standingAndStickedRect.height;
        break;
      case 'left-bottom':
        draggingAndStickingRect.x = standingAndStickedRect.x - draggingAndStickingRect.width;
        draggingAndStickingRect.y =
          standingAndStickedRect.y + standingAndStickedRect.height - draggingAndStickingRect.height;
        break;
      case 'left-top':
        draggingAndStickingRect.x = standingAndStickedRect.x - draggingAndStickingRect.width;
        draggingAndStickingRect.y = standingAndStickedRect.y;
        break;
      case 'right-top':
        draggingAndStickingRect.x = standingAndStickedRect.x + standingAndStickedRect.width;
        draggingAndStickingRect.y = standingAndStickedRect.y;
        break;
      case 'right-bottom':
        draggingAndStickingRect.x = standingAndStickedRect.x + standingAndStickedRect.width;
        draggingAndStickingRect.y =
          standingAndStickedRect.y + standingAndStickedRect.height - draggingAndStickingRect.height;
        break;

      default:
        break;
    }
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
    if (!this.isDragOk) return null;

    const { currentX, currentY } = this.getCurrentXandY(e);
    const xMovedDistance = currentX - this.prevX;
    const yNovedDistance = currentY - this.prevY;

    arrayOfRectangles.forEach(rect => {
      if (rect.isDragging) {
        rect.x += xMovedDistance;
        rect.y += yNovedDistance;
      }
    });

    this.setCrossedPropToRectangles();
    this.setStickedPropToRectangles();
    this.changeCoordinatesOfRectangleForConcatenation();
    this.setColorPropToRectangles();
    this.drawRectangles();
    this.prevX = currentX;
    this.prevY = currentY;
  }

  mouseUpHandler() {
    this.isDragOk = false;

    arrayOfRectangles.forEach(rectA => {
      if (!rectA.isDragging) return null;

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
