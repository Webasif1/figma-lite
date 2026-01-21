//Select buttons
const cursor = document.querySelector(".cursor");
const rect = document.querySelector(".rect");
const text = document.querySelector(".text");
const canvas = document.querySelector("#main");

// Global State
let elements = [];
let selectedElement = null;
let rectWidth = 500;
let rectHeight = 300;
let rectTop, rectLeft;

cursor.addEventListener("click", () => {
  cursor.classList.add("active");
});

//Rectangle
rect.addEventListener("click", () => {
  // min and max number random position
  function randomMinMax(max, min) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  rectTop = randomMinMax(60, 50);
  rectLeft = randomMinMax(60, 50);
  let data = {
    id: Date.now(),
    type: "rectangle",
    x: rectTop,
    y: rectLeft,
    width: rectWidth,
    height: rectHeight,
  };

  elements.push(data);
  renderElement(data);
});

// Render Rectangle
function renderElement(data) {
  const ele = document.createElement("div");
  ele.classList.add("rect-box");

  ele.style.left = data.x + "px";
  ele.style.top = data.y + "px";
  ele.style.width = data.width + "px";
  ele.style.height = data.height + "px";

  ele.dataset.id = data.id;
  ele.dataset.type = data.type;

  ele.addEventListener("click", () => selectElement(ele));

  canvas.appendChild(ele);
}

// Selected Element
function selectElement(el) {
  if (selectedElement) {
    selectedElement.classList.remove("selected");
  }

  selectedElement = el;
  el.classList.add("selected");
}

// Dragging
let isDragging = false;
let offsetX = 0;
let offsetY = 0;
canvas.addEventListener(
  "mousedown",
  (event) => {
    box = event.target.classList.contains("selected");
    if (box) {
      isDragging = true;
      offsetX = event.clientX - selectedElement.getBoundingClientRect().left;
      offsetY = event.clientY - selectedElement.getBoundingClientRect().top;
      selectedElement.style.cursor = "grabbing";

      event.preventDefault();
    }
  },
  false,
);

canvas.addEventListener(
  "mousemove",
  (event) => {
    if (isDragging) {
      const canvasRect = canvas.getBoundingClientRect();
      let x = event.clientX - canvasRect.left - offsetX;
      let y = event.clientY - canvasRect.top - offsetY;

      // Keep inside canvas
      x = Math.max(
        0,
        Math.min(x, canvas.clientWidth - selectedElement.offsetWidth),
      );
      y = Math.max(
        0,
        Math.min(y, canvas.clientHeight - selectedElement.offsetHeight),
      );

      selectedElement.style.left = x + "px";
      selectedElement.style.top = y + "px";
    }
  },
  false,
);

document.addEventListener("mouseup", () => {
  isDragging = false;
});

console.log(selectedElement);

// Remove selected element
canvas.addEventListener("mousedown", (e) => {
  if (e.target === canvas && selectedElement) {
    selectedElement.classList.remove("selected");
    selectedElement = null;
  }
});
