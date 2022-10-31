const maxScale = 5,
  minScale = 0.15;

var selected,
  scale = 1,
  svg = document.querySelector('svg');

function beginDrag(e) {
  e.stopPropagation();
  let target = e.target;

  if (target.classList.contains('draggable')) {
    selected = target;
  } else {
    selected = document.querySelector('.main-container');
  }

  selected.dataset.startMouseX = e.clientX;
  selected.dataset.startMouseY = e.clientY;
}

function drag(e) {
  if (!selected) return;
  e.stopPropagation();

  let startX = parseFloat(selected.dataset.startMouseX),
    startY = parseFloat(selected.dataset.startMouseY),
    dx = (e.clientX - startX),
    dy = (e.clientY - startY);

  if (selected.classList.contains('draggable')) {
    let selectedBox = selected.getBoundingClientRect(),
      boundaryBox = selected.parentElement.getBoundingClientRect();

    if (selectedBox.right + dx > boundaryBox.right) {
      dx = (boundaryBox.right - selectedBox.right);
    } else if (selectedBox.left + dx < boundaryBox.left) {
      dx = (boundaryBox.left - selectedBox.left);
    }

    if (selectedBox.bottom + dy > boundaryBox.bottom) {
      dy = (boundaryBox.bottom - selectedBox.bottom);
    }
    else if (selectedBox.top + dy < boundaryBox.top) {
      dy = (boundaryBox.top - selectedBox.top);
    }
  }

  let currentMatrix = selected.transform.baseVal.consolidate().matrix,
    newMatrix = currentMatrix.translate(dx / scale, dy / scale),
    transform = svg.createSVGTransformFromMatrix(newMatrix);

  selected.transform.baseVal.initialize(transform);
  selected.dataset.startMouseX = dx + startX;
  selected.dataset.startMouseY = dy + startY;
}

function endDrag(e) {
  e.stopPropagation();

  if (selected) {
    selected = undefined;
  }
}


function zoom(e) {
  e.stopPropagation();
  e.preventDefault();

  let delta = e.wheelDelta,
    container = document.querySelector('svg .main-container'),
    scaleStep = delta > 0 ? 1.25 : 0.8;

  if (scale * scaleStep > maxScale) {
    scaleStep = maxScale / scale;
  }

  if (scale * scaleStep < minScale) {
    scaleStep = minScale / scale;
  }

  scale *= scaleStep;

  let box = svg.getBoundingClientRect();
  let point = svg.createSVGPoint();
  point.x = e.clientX - box.left;
  point.y = e.clientY - box.top;

  let currentZoomMatrix = container.getCTM();

  point = point.matrixTransform(currentZoomMatrix.inverse());

  let matrix = svg.createSVGMatrix()
    .translate(point.x, point.y)
    .scale(scaleStep)
    .translate(-point.x, -point.y);


  let newZoomMatrix = currentZoomMatrix.multiply(matrix);
  container.transform.baseVal.initialize(svg.createSVGTransformFromMatrix(newZoomMatrix));

  console.log("scale", scale);
  let t = newZoomMatrix;
  console.log("zoomMatrix", t.a, t.b, t.c, t.d, t.e, t.f);
}

document.querySelector('svg').addEventListener('mousedown', beginDrag);
document.querySelector('svg').addEventListener('mousewheel', zoom);
svg.addEventListener('mousemove', drag);
window.addEventListener('mouseup', endDrag);