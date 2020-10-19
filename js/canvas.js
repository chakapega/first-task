import { arrayOfRectangles } from './rectangles.js';
import { canvasWindowIndent, startedRectangleFillColor, redColorInHex, stickyDistance } from './shared/constants.js';

export class Canvas {
  constructor(selectedCanvas) {
    this.canvas = selectedCanvas;
    this.ctx = this.canvas.getContext('2d');
    this.draggingRect;
    this.isDragOk = false;
    this.offsetX;
    this.offsetY;
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

    arrayOfRectangles.forEach(rect => {
      if (rect.isSticked && !rect.isCrossed) {
        const { stickedX, stickedY, width, height } = rect;

        this.ctx.fillStyle = rect.fillColor;
        this.ctx.fillRect(stickedX, stickedY, width, height);
      } else {
        const { x, y, width, height } = rect;

        this.ctx.fillStyle = rect.fillColor;
        this.ctx.fillRect(x, y, width, height);
      }
    });
  }

  clear() {
    const { width, height } = this.canvas;

    this.ctx.clearRect(0, 0, width, height);
  }

  isRectangle_a_and_b_crossed(rectA, rectB) {
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

  isRectangle_a_and_b_sticked(rectA, rectB) {
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

  isCrossedRectangle(rectA) {
    return arrayOfRectangles.reduce((accumulator, rectB) => {
      if (rectA !== rectB && this.isRectangle_a_and_b_crossed(rectA, rectB)) accumulator = true;

      return accumulator;
    }, false);
  }

  isStickedRectangle(rectA) {
    return arrayOfRectangles.reduce((accumulator, rectB) => {
      if (rectA !== rectB && this.isRectangle_a_and_b_sticked(rectA, rectB)) accumulator = true;

      return accumulator;
    }, false);
  }

  setStickedPropToRectangles() {
    arrayOfRectangles.forEach(rect => {
      rect.isSticked = this.isStickedRectangle(rect) ? true : false;
    });
  }

  setCrossedPropToRectangles() {
    arrayOfRectangles.forEach(rect => {
      rect.isCrossed = this.isCrossedRectangle(rect) ? true : false;
    });
  }

  setColorPropToRectangles() {
    arrayOfRectangles.forEach(rect => {
      rect.fillColor = rect.isCrossed ? redColorInHex : startedRectangleFillColor;
    });
  }

  setStickedSideToDraggingRectangle(draggingRect, standingRect) {
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
        draggingRect.stickedSide = 'top-left';
      } else {
        draggingRect.stickedSide = 'left-top';
      }
    } else if (draggingRectCenter.x > standingRectCenter.x && draggingRectCenter.y < standingRectCenter.y) {
      if (draggingRectCenter.x - standingRectCenter.x < standingRectCenter.y - draggingRectCenter.y) {
        draggingRect.stickedSide = 'top-right';
      } else {
        draggingRect.stickedSide = 'right-top';
      }
    } else if (draggingRectCenter.x > standingRectCenter.x && draggingRectCenter.y > standingRectCenter.y) {
      if (draggingRectCenter.x - standingRectCenter.x > draggingRectCenter.y - standingRectCenter.y) {
        draggingRect.stickedSide = 'right-bottom';
      } else {
        draggingRect.stickedSide = 'bottom-right';
      }
    } else if (draggingRectCenter.x < standingRectCenter.x && draggingRectCenter.y > standingRectCenter.y) {
      if (standingRectCenter.x - draggingRectCenter.x > draggingRectCenter.y - standingRectCenter.y) {
        draggingRect.stickedSide = 'left-bottom';
      } else {
        draggingRect.stickedSide = 'bottom-left';
      }
    }
  }

  getNearestStickedRectangleToDraggingRectangle(draggingRect, arrayOfStickedRects) {
    const getDistanceBetweenRects = (rectA, rectB) => {
      const centerOfRectA = {
        x: rectA.x + rectA.width / 2,
        y: rectA.y + rectA.height / 2,
      };
      const centerOfRectB = {
        x: rectB.x + rectB.width / 2,
        y: rectB.y + rectB.height / 2,
      };

      return Math.sqrt((centerOfRectB.x - centerOfRectA.x) ** 2 + (centerOfRectB.y - centerOfRectA.y) ** 2);
    };

    const arrayOfDistancesBetweenRects = [];
    let nearestStickedRectangle;
    let minimalDistance;

    arrayOfStickedRects.forEach(stickedRect => {
      arrayOfDistancesBetweenRects.push(getDistanceBetweenRects(draggingRect, stickedRect));
    });

    minimalDistance = Math.min(...arrayOfDistancesBetweenRects);

    arrayOfDistancesBetweenRects.forEach((distance, index) => {
      if (distance === minimalDistance) {
        nearestStickedRectangle = arrayOfStickedRects[index];
      }
    });

    return nearestStickedRectangle;
  }

  changeCoordinatesOfStickingRectangles() {
    const draggingAndStickingRect = this.draggingRect.isSticked ? this.draggingRect : null;
    const arrayOfStandingAndStickingRects = arrayOfRectangles.filter(rect => !rect.isDragging && rect.isSticked);

    if (draggingAndStickingRect) {
      const nearestStandingAndStickingRect = this.getNearestStickedRectangleToDraggingRectangle(
        draggingAndStickingRect,
        arrayOfStandingAndStickingRects
      );

      this.setStickedSideToDraggingRectangle(draggingAndStickingRect, nearestStandingAndStickingRect);

      switch (draggingAndStickingRect.stickedSide) {
        case 'top-left':
          draggingAndStickingRect.stickedX = nearestStandingAndStickingRect.x;
          draggingAndStickingRect.stickedY = nearestStandingAndStickingRect.y - draggingAndStickingRect.height;
          break;
        case 'top-right':
          draggingAndStickingRect.stickedX =
            nearestStandingAndStickingRect.x + nearestStandingAndStickingRect.width - draggingAndStickingRect.width;
          draggingAndStickingRect.stickedY = nearestStandingAndStickingRect.y - draggingAndStickingRect.height;
          break;
        case 'bottom-right':
          draggingAndStickingRect.stickedX =
            nearestStandingAndStickingRect.x + nearestStandingAndStickingRect.width - draggingAndStickingRect.width;
          draggingAndStickingRect.stickedY = nearestStandingAndStickingRect.y + nearestStandingAndStickingRect.height;
          break;
        case 'bottom-left':
          draggingAndStickingRect.stickedX = nearestStandingAndStickingRect.x;
          draggingAndStickingRect.stickedY = nearestStandingAndStickingRect.y + nearestStandingAndStickingRect.height;
          break;
        case 'left-bottom':
          draggingAndStickingRect.stickedX = nearestStandingAndStickingRect.x - draggingAndStickingRect.width;
          draggingAndStickingRect.stickedY =
            nearestStandingAndStickingRect.y + nearestStandingAndStickingRect.height - draggingAndStickingRect.height;
          break;
        case 'left-top':
          draggingAndStickingRect.stickedX = nearestStandingAndStickingRect.x - draggingAndStickingRect.width;
          draggingAndStickingRect.stickedY = nearestStandingAndStickingRect.y;
          break;
        case 'right-top':
          draggingAndStickingRect.stickedX = nearestStandingAndStickingRect.x + nearestStandingAndStickingRect.width;
          draggingAndStickingRect.stickedY = nearestStandingAndStickingRect.y;
          break;
        case 'right-bottom':
          draggingAndStickingRect.stickedX = nearestStandingAndStickingRect.x + nearestStandingAndStickingRect.width;
          draggingAndStickingRect.stickedY =
            nearestStandingAndStickingRect.y + nearestStandingAndStickingRect.height - draggingAndStickingRect.height;
          break;

        default:
          break;
      }

      const { stickedX, stickedY } = draggingAndStickingRect;

      draggingAndStickingRect.arrayOfPrevStickedCoordinates.push({ stickedX, stickedY });
    }

    if (arrayOfStandingAndStickingRects.length) {
      arrayOfStandingAndStickingRects.forEach(rect => {
        rect.stickedX = rect.x;
        rect.stickedY = rect.y;
      });
    }
  }

  getCurrentXandY(e) {
    return { currentX: e.clientX - this.offsetX, currentY: e.clientY - this.offsetY };
  }

  removeStickedCoordinates() {
    arrayOfRectangles.forEach(rect => {
      if (!rect.isSticked) {
        delete rect.stickedX;
        delete rect.stickedY;
      }
    });
  }

  changeCoordinatesOfRectangleIfHaveStickyCoordinates() {
    arrayOfRectangles.forEach(rect => {
      if (rect.stickedX && rect.stickedY) {
        rect.x = rect.stickedX;
        rect.y = rect.stickedY;
      }
    });
  }

  mouseDownHandler(e) {
    const { currentX, currentY } = this.getCurrentXandY(e);

    for (let i = 0; i < arrayOfRectangles.length; i++) {
      if (
        currentX >= arrayOfRectangles[i].x &&
        currentX <= arrayOfRectangles[i].x + arrayOfRectangles[i].width &&
        currentY >= arrayOfRectangles[i].y &&
        currentY <= arrayOfRectangles[i].y + arrayOfRectangles[i].height
      ) {
        this.draggingRect = arrayOfRectangles[i];
        this.draggingRect.startX = arrayOfRectangles[i].x;
        this.draggingRect.startY = arrayOfRectangles[i].y;
        this.draggingRect.isDragging = true;
        this.draggingRect.prevCurrentX = currentX;
        this.draggingRect.prevCurrentY = currentY;
        this.draggingRect.arrayOfPrevStickedCoordinates = [];
        this.isDragOk = true;

        break;
      }
    }
  }

  mouseMoveHandler(e) {
    if (!this.isDragOk) return null;

    const { currentX, currentY } = this.getCurrentXandY(e);
    const xMovedDistance = currentX - this.draggingRect.prevCurrentX;
    const yMovedDistance = currentY - this.draggingRect.prevCurrentY;

    this.draggingRect.x += xMovedDistance;
    this.draggingRect.y += yMovedDistance;
    this.draggingRect.prevCurrentX = currentX;
    this.draggingRect.prevCurrentY = currentY;
    this.setStickedPropToRectangles();
    this.setCrossedPropToRectangles();
    this.removeStickedCoordinates();
    this.changeCoordinatesOfStickingRectangles();
    this.setColorPropToRectangles();
    this.drawRectangles();
  }

  mouseUpHandler() {
    if (!this.draggingRect) return null;

    this.isDragOk = false;
    this.draggingRect.isDragging = false;

    if (this.draggingRect.isCrossed) {
      this.draggingRect.x = this.draggingRect.startX;
      this.draggingRect.y = this.draggingRect.startY;

      this.setStickedPropToRectangles();
      this.setCrossedPropToRectangles();
      this.setColorPropToRectangles();
      this.removeStickedCoordinates();
      this.changeCoordinatesOfStickingRectangles();

      const { stickedX, stickedY } = this.draggingRect.arrayOfPrevStickedCoordinates[0];

      if (this.draggingRect.isSticked) {
        this.draggingRect.stickedX = stickedX;
        this.draggingRect.stickedY = stickedY;
      }

      this.drawRectangles();
    }

    this.changeCoordinatesOfRectangleIfHaveStickyCoordinates();
  }
}
