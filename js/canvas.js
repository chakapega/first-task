import { arrayOfRectangles } from './rectangles.js';

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

ctx.fillStyle = "black";

const renderStartedRectangles = () => {
  let sumOfHeightsRenderedRectangles = 0;

  arrayOfRectangles.forEach((rectangleData, index) => {
    const { width, height } = rectangleData;

    if (index === 0) {
      ctx.fillRect(20, 20, width, height);
    } else {
      ctx.fillRect(20, ((index + 1) * 20) + sumOfHeightsRenderedRectangles, width, height);
    }

    sumOfHeightsRenderedRectangles += height;
  })
}

renderStartedRectangles();
