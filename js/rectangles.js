const rectanglesContainer = document.querySelector('.rectangles-container');

const arrayOfRectangles = [
  {
    width: 120,
    height: 60,
    id: Date.now(),
  },
  {
    width: 170,
    height: 60,
    id: Date.now(),
  },
  {
    width: 80,
    height: 60,
    id: Date.now(),
  },
];

arrayOfRectangles.forEach((rectangleData) => {
  const { width, height } = rectangleData;
  const rectangle = document.createElement('div');
  const text = document.createElement('span');

  rectangle.classList.add('rectangle');

  text.textContent = `${width}x${height}`;
  rectangle.appendChild(text);

  rectanglesContainer.appendChild(rectangle);
});
