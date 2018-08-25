export var isDragging = false

document.addEventListener('mousedown', () => {
  isDragging = true
}, true)

document.addEventListener('mouseup', () => {
  isDragging = false
}, true)

document.addEventListener('mouseout', () => {
  isDragging = false
}, true)
