
var mouseDown = false;
var mouseDownX = 0;
var mouseDownY = 0;
var gridX = 0;
var gridY = 0;


const LEFT_MOUSE_BUTTON = 0;

function onMouseDown(evt) {
    console.log('evt', evt);
      // const {touches} = evt

  // if (evt.button == LEFT_MOUSE_BUTTON) {
    // evt.preventDefault();
    mouseDown = true;
    mouseDownX = evt.pageX;
    mouseDownY = evt.pageY;
  // }
}

function onMouseUp(evt) {
  // if (evt.button == LEFT_MOUSE_BUTTON) {
    evt.preventDefault();
    mouseDown = false;
  // }
}

surface.addEventListener("pointerleave", onMouseLeave, false);
// surface.addEventListener("pointerdown", onMouseLeave, false);

// If the mouse moves out of the surface area, the mouse up event will not trigger,
// so we clear the mouseDown flag so that scrolling does not resume "by itself" 
// when the user moves the mouse back onto the surface, which would otherwise 
// require the user to click to clear the mouseDown flag.
function onMouseLeave(evt) {
  evt.preventDefault();
  mouseDown = false;
}
// The default:
var gridCellW = 80;
var gridCellH = 80;


var dx = gridX % gridCellW;
var dy = gridY % gridCellH;


// resizeGrid(100, 100, 20, 20);



// Programmatically change the grid spacing for the larger grid cells and smaller grid cells.
function resizeGrid(lw, lh, sw, sh) {
  gridCellW = lw;
  gridCellH = lh;
  var elLargeGridRect = document.getElementById("largeGridRect");
  var elLargeGridPath = document.getElementById("largeGridPath");
  var elLargeGrid = document.getElementById("largeGrid");

  var elSmallGridPath = document.getElementById("smallGridPath");
  var elSmallGrid = document.getElementById("smallGrid");

  var elSvg = document.getElementById("svg");
  var elSurface = document.getElementById("surface");
  var elGrid = document.getElementById("grid");

  elLargeGridRect.setAttribute("width", lw);
  elLargeGridRect.setAttribute("height", lh);

  elLargeGridPath.setAttribute("d", "M " + lw + " 0 H 0 V " + lh);
  elLargeGrid.setAttribute("width", lw);
  elLargeGrid.setAttribute("height", lh);

  elSmallGridPath.setAttribute("d", "M " + sw + " 0 H 0 V " + sh);
  elSmallGrid.setAttribute("width", sw);
  elSmallGrid.setAttribute("height", sh);

  elGrid.setAttribute("x", -lw);
  elGrid.setAttribute("y", -lh);

  var svgW = +elSvg.getAttribute("width");
  var svgH = +elSvg.getAttribute("height");

  elSurface.setAttribute("width", svgW + lw * 2);
  elSurface.setAttribute("height", svgH + lh * 2);

  elSurface.setAttribute("x", -lw);
  elSurface.setAttribute("y", -lh);

  elSurface.setAttribute("width", svgW + lw * 2);
  elSurface.setAttribute("height", svgH + lh * 2);
}


// function onMouseMove(evt) {
//   if (mouseDown) {
//     evt.preventDefault();
//     var mouseX = evt.pageX;
//     var mouseY = evt.pageY;
//     var mouseDX = mouseX - mouseDownX;
//     var mouseDY = mouseY - mouseDownY;
//     gridX += mouseDX;
//     gridY += mouseDY;
//     mouseDownX = mouseX;
//     mouseDownY = mouseY;
//     var svg = document.getElementById("svg");
//     var surface = svg.getElementById("surface");
//     var dx = gridX % 80;
//     var dy = gridY % 80;
//     surface.setAttribute("transform", "translate(" + dx + "," + dy + ")");
//   }
// }



function onMouseMove(evt) {
 console.log('suk', evt);
  if (mouseDown) {
    evt.preventDefault();
    var mouseX = evt.pageX;
    var mouseY = evt.pageY;
    var mouseDX = mouseX - mouseDownX;
    var mouseDY = mouseY - mouseDownY;
    gridX += mouseDX;
    gridY += mouseDY;
    mouseDownX = mouseX;
    mouseDownY = mouseY;
    var surface = document.getElementById("surface");

    var dx = gridX % gridCellW;
    var dy = gridY % gridCellH;
    surface.setAttribute("transform", "translate(" + dx + "," + dy + ")");

    var objects = document.getElementById("objects");
    objects.setAttribute("transform", "translate(" + gridX + "," + gridY + ")");
  }
}

function initializeSurface() {
  var svg = document.getElementById("svg");
  var surface = svg.getElementById("surface");
  surface.addEventListener("pointerdown", onMouseDown, false);
  // surface.addEventListener("pointerup", onMouseUp, false);
  // surface.addEventListener("pointermove", onMouseMove, false);
  // surface.addEventListener("touchend", onMouseLeave, false);
}

initializeSurface();
