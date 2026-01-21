//Select buttons
const cursor = document.querySelector('.cursor');
const rect = document.querySelector('.rect');
const text = document.querySelector('.text');
const canvas = document.querySelector('#main')

// Global State
let elements = [];
let selectedElement = null;

cursor.addEventListener('click', ()=>{
  cursor.classList.add('active')
})


let rectWidth = 500
let rectHeight = 500
rect.addEventListener("click", () => {
  let data = {
    id: Date.now(),
    type: "rectangle",
    x: 50,
    y: 50,
    width: rectWidth,
    height: rectHeight
  };

  elements.push(data);
  renderElement(data);
});

function renderElement(data){
  const ele = document.createElement('div');
  ele.classList.add('rect-box');

  ele.style.left = data.x + "px";
  ele.style.top = data.y + "px";
  ele.style.width = data.width + "px";
  ele.style.height = data.height + "px";

  ele.dataset.id = data.id
  canvas.appendChild(ele);
}

