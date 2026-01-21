//Select buttons
const cursor = document.querySelector(".cursor");
const rect = document.querySelector(".rect");
const text = document.querySelector(".text");
const canvas = document.querySelector("#main");

// Global State
let elements = [];
let selectedElement = null;
let rectWidth = 400;
let rectHeight = 300;
let rectTop = null;
let rectLeft = null;

cursor.addEventListener("click", () => {
  cursor.classList.add("active");
});
// min and max number random position
function randomMinMax(max, min) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
//Create Rectangle
rect.addEventListener("click", () => {
  rectLeft = randomMinMax(200, 50);
  rectTop = randomMinMax(300, 50);

  let data = {
    id: Date.now(),
    type: "rectangle",
    x: rectLeft,
    y: rectTop,
    width: rectWidth,
    height: rectHeight,
  };

  elements.push(data);
  renderElement(data);
  saveToLocalStorage()
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

  ele.addEventListener("mousedown", () => selectElement(ele));

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
    if (event.target === selectedElement) {
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

canvas.addEventListener("mousedown", (e) => {
  if (e.target === canvas && selectedElement) {
    selectedElement.classList.remove("selected");
    selectedElement = null;
  }
});

// Update Element
function updateElementPosition(id, x, y) {
  const el = elements.find((item) => item.id == id);
  if (!el) return;

  el.x = x;
  el.y = y;
}

// Remove selected element
document.addEventListener("mouseup", () => {
  if (isDragging && selectedElement) {
    const id = selectedElement.dataset.id;
    const x = parseInt(selectedElement.style.left, 10);
    const y = parseInt(selectedElement.style.top, 10);

    updateElementPosition(id, x, y);
    saveToLocalStorage()
  }

  isDragging = false;

  if (selectedElement) {
    selectedElement.style.cursor = "move";
  }
});

// Add to localstorage
function saveToLocalStorage() {
  localStorage.setItem("figma-lite-elements", JSON.stringify(elements));
}

function loadFromLocalStorage() {
  const saved = localStorage.getItem("figma-lite-elements");
  if (!saved) return;

  elements = JSON.parse(saved);
  canvas.innerHTML = "";
  elements.forEach(renderElement);
}
window.addEventListener("DOMContentLoaded", () => {
  loadFromLocalStorage();
});
