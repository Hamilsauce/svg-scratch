import Node from './Node.js';

export default class extends Node {
  constructor(pos, color, graph) {
    super()
    this.graph = graph;
    this.element = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    this.element.classList.add('line');
    this.element.setAttribute('stroke', color);
    this.element.setAttribute('width', 9);
    this.element.setAttribute('stroke-width', '');
    this.setPosition(pos);
    console.log('line.', this);
  }

  get element() { return this._element };
  set element(newValue) { this._element = newValue }

  setPosition(pos) {
    this.element.setAttribute('x1', pos.x1);
    this.element.setAttribute('y1', pos.y1);
    this.element.setAttribute('x2', pos.x2);
    this.element.setAttribute('y2', pos.y2);
  }

  getPosition() {
    return {
      x1: this.element.getAttribute('x1'),
      y1: this.element.getAttribute('y1'),
      x2: this.element.getAttribute('x2'),
      y2: this.element.getAttribute('y2'),
    };
  }

  setRotate(angle) {
    let newPos = pos = this.getPosition();
    newPos.x2 = pos - radius * Math.cos(angle);
    newPos.y2 = pos - radius * Math.sin(angle);
    this.setPosition(newPos);
  }

  getHtmlEl() {
    return this.element;
  }
}

// class Rect {
//   constructor(pos, color, graph) {
//     this.graph = graph;
//     this.element = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
//     this.element.classList.add('rect');
//     this.element.setAttribute('stroke', 'red');
//     this.element.setAttribute('fill', color);
//     this.element.setAttribute('stroke-width', '2');
//     this.setCoords(pos);
//     this.setSize(pos);
//     this.element.addEventListener('click', this.handleClick.bind(this));
//   }

//   handleClick(e) {
//     if (this.graph.selectMode) {
//       const evt = new CustomEvent('shapeSelected', { bubbles: true, detail: { event: e } })
//       e.target.dispatchEvent(evt);
//       console.log('shape click w select mide on', evt);
//     }
//   }

//   setCoords(pos) {
//     this.element.setAttribute('x', pos.x);
//     this.element.setAttribute('y', pos.y);
//   }

//   setSize(width, height) {
//     this.element.setAttribute('width', width);
//     this.element.setAttribute('height', height);
//   }

//   getPosition() {
//     return {
//       x: this.element.getAttribute('x'),
//       y: this.element.getAttribute('y'),
//       width: this.element.getAttribute('width'),
//       height: this.element.getAttribute('height'),
//     }
//   }

//   setRotate(angle) {
//     let newPos = pos = this.getPosition();
//     newPos.x2 = pos - radius * Math.cos(angle);
//     newPos.y2 = pos - radius * Math.sin(angle);
//     this.setPosition(newPos);
//   }

//   getHtmlEl() {
//     return this.element;
//   }
// }

// Graph

// class Graph {
// 	constructor(el) {
// 		this._shapeColor = 'grey';
// 		this._selectedShape = undefined;
// 		this._selectedShapeZPosition = null;
// 		this._selectMode = false;
// 		this.element = el;
// 		this.elements = [];
// 		this.drawMode = 'line';
// 		this.setSize();

// 		this.element.addEventListener('shapeSelected', this.handleShapeSelect.bind(this))
// 		// this.element.addEventListener('shapeColorChange', this.handleColorChange.bind(this))
// 		this.element.ontouchstart = this.mouseDown.bind(this);
// 		this.element.ontouchend = this.mouseUp.bind(this);
// 		this.element.onmouseout = this.mouseUp.bind(this);
// 		this.element.ontouchmove = this.mouseMove.bind(this);
// 	}

// 	resetShapeZPosition() {
// 		const refNode = this.element.children[this.selectedShapeZPosition]
// 		this.selectedShape.classList.remove('selected-shape')
// 		this.selectedShape.classList.add('prev-selected-shape')
// 		this.element.insertBefore(this.selectedShape, refNode)
// 	}

// 	toggleSelectMode(s) {
// 		if (this.selectMode) {
// 			console.log('toggle on', this);
// 		} else {
// 			if (this.selectedShape) {
// 				this.selectedShape.classList.remove('selected-shape')
// 				this.resetShapeZPosition();
// 			}
// 		}
// 	}

// 	handleShapeSelect(e) {
// 		if (this.selectedShape) this.resetShapeZPosition();

// 		this.selectedShapeZPosition = [...this.element.children].findIndex((c) => c = e.target);

// 		if (this.selectMode) this.selectedShape = e.target
// 	}

// 	moveSelectedShape(e) {
// 		const targ = e.target;
// 		let xPos = Math.round(parseInt(e.touches[0].pageX));
// 		let yPos = e.touches[0].pageY;
// 		let currX = targ.style.left.replace('px', '');
// 		let currY = targ.style.top;

// 		targ.style.left = `${parseInt(xPos) - 75}px`
// 		targ.style.top = `${parseInt(yPos) - 75}px`
// 		targ.style.zIndex = 30;
// 	}

// 	mouseDown(event) {
// 		if (!this._selectMode) {
// 			this.drawStart = true;
// 			if (this.drawMode === 'line') {
// 				const line = new Line({
// 					x1: event.touches[0].pageX,
// 					y1: event.touches[0].pageY,
// 					x2: event.touches[0].pageX,
// 					y2: event.touches[0].pageY
// 				}, this._shapeColor, this);

// 				this.current = line;
// 				this.element.appendChild(line.getHtmlEl());
// 			} else if (this.drawMode === 'rect') {
// 				const rect = new Rect({
// 					x: event.touches[0].pageX,
// 					y: event.touches[0].pageY,
// 					width: 30,
// 					height: 30,
// 				}, this._shapeColor, this);

// 				this.current = rect;
// 				this.element.appendChild(rect.getHtmlEl());
// 			}
// 		} else this.moveSelectedShape(event)
// 	}


// 	mouseUp(event) {
// 		this.drawStart = false;
// 		this.current = null;
// 	}

// 	mouseMove(event) {
// 		if (!this.selectMode) {
// 			if (this.drawStart && this.current) {
// 				if (this.drawMode === 'line') {
// 					let pos = this.current.getPosition();
// 					pos.x2 = event.touches[0].clientX;
// 					pos.y2 = event.touches[0].clientY;
// 					this.current.setPosition(pos);

// 				} else if (this.drawMode === 'rect') {
// 					let pos = this.current.getPosition();
// 					pos.width = event.touches[0].pageX - (pos.x + 300);
// 					pos.height = event.touches[0].pageY - (pos.y + 300);
// 					this.current.setSize(pos.width, pos.height);
// 				}
// 			}
// 		} else {
// 			this.selectedShape.setAttribute('x', event.touches[0].pageX - (parseInt(this._selectedShape.getAttribute('width')) / 2));
// 			this.selectedShape.setAttribute('y', event.touches[0].pageY - (parseInt(this._selectedShape.getAttribute('height'))));
// 		}
// 	}

// 	setSize() {
// 		this.element.setAttribute('width', window.innerWidth);
// 		this.element.setAttribute('height', window.innerHeight);
// 	}

// 	get shapeColor() { return this._shapeColor };
// 	set shapeColor(c) { this._shapeColor = c };

// 	get selectedShapeZPosition() { return this._selectedShapeZPosition }
// 	set selectedShapeZPosition(z) { this._selectedShapeZPosition = z };

// 	get selectMode() { return this._selectMode };
// 	set selectMode(s) {
// 		this._selectMode = s;
// 		this.toggleSelectMode(s);
// 	}

// 	get selectedShape() { return this._selectedShape };
// 	set selectedShape(el) {
// 		if (this._selectedShape != el) {
// 			if (this._selectedShape != undefined) this._selectedShape.classList.remove('selected-shape')
// 			this._selectedShape = el;
// 			this._selectedShape.classList.add('selected-shape')
// 			this.selectedShapeZPosition = [...this.element.children].findIndex((c) => {
// 				return c == el
// 			})
// 			this.element.removeChild(this._selectedShape);
// 			this.element.insertBefore(this._selectedShape, this.element.children[-1]);
// 		} else {
// 			this.selectedShape.classList.remove('selected-shape')
// 			this.selectedShape = undefined;
// 		}
// 	};

// }