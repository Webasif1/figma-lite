//Select
const cursor = document.querySelector(".cursor");
const rect = document.querySelector(".rect");
const text = document.querySelector(".text");
const canvas = document.querySelector("#main");

// Global State
let elements = [];
let selectedElement = null;
let eleWidth = 300;
let eleHeight = 200;
let eleTop = null;
let eleLeft = null;

cursor.addEventListener("click", () => {
  cursor.classList.add("active");
});
// min and max number random position
function randomMinMax(max, min) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function topLeftPosition() {
  eleLeft = randomMinMax(200, 50);
  eleTop = randomMinMax(300, 50);
}
//Create Rectangle
rect.addEventListener("click", () => {
  topLeftPosition();
  let data = {
    id: Date.now(),
    type: "rectangle",
    x: eleLeft,
    y: eleTop,
    width: eleWidth,
    height: eleHeight,
  };

  elements.push(data);
  renderElement(data);
  saveToLocalStorage();
});

// Create text
text.addEventListener("click", () => {
  topLeftPosition();
  let data = {
    id: Date.now(),
    type: "text",
    x: eleLeft,
    y: eleTop,
    content: "Type...",
    fontSize: 16,
    width: eleWidth,
    height: eleHeight,
  };

  elements.push(data);
  renderElement(data);
  saveToLocalStorage();
});

// Render ui
function renderElement(data) {
  let ele;

  if (data.type === "rectangle") {
    ele = document.createElement("div");
    ele.classList.add("rect-box");
  }
  if (data.type === "text") {
    ele = document.createElement("h1");
    ele.classList.add("text-box");
    ele.contentEditable = true;
    ele.innerText = data.content;
    ele.style.fontSize = data.fontSize + "px";
  }
  ele.style.left = data.x + "px";
  ele.style.top = data.y + "px";
  ele.dataset.id = data.id;
  ele.dataset.type = data.type;
  ele.style.width = data.width + "px";
  ele.style.height = data.height + "px";

  ele.addEventListener("mousedown", () => selectElement(ele));

  // Save text changes
  if (data.type === "text") {
    ele.addEventListener("input", () => {
      const el = elements.find((item) => item.id == data.id);
      if (el) {
        el.content = ele.innerText;
        saveToLocalStorage();
      }
    });
  }

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
    if (!selectedElement) return;
    const isText = selectedElement.dataset.type === "text";
    if (isText && !event.altKey) {
      return;
    }
    if (event.target === selectedElement) {
      isDragging = true;
      offsetX = event.clientX - selectedElement.getBoundingClientRect().left;
      offsetY = event.clientY - selectedElement.getBoundingClientRect().top;
      selectedElement.style.cursor = "grabbing";
      event.preventDefault();
    }
  },
  false
);

canvas.addEventListener(
  "mousemove",
  (event) => {
    if (isDragging) {
      const canvasRect = canvas.getBoundingClientRect();
      let x = event.clientX - canvasRect.left - offsetX;
      let y = event.clientY - canvasRect.top - offsetY;

      // To keep inside canvas
      x = Math.max(
        0,
        Math.min(x, canvas.clientWidth - selectedElement.offsetWidth)
      );
      y = Math.max(
        0,
        Math.min(y, canvas.clientHeight - selectedElement.offsetHeight)
      );

      selectedElement.style.left = x + "px";
      selectedElement.style.top = y + "px";
    }
  },
  false
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
    saveToLocalStorage();
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
loadFromLocalStorage();
