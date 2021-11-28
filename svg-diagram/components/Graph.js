import Line from './Line.js';
import Rect from './Rect.js';

export default class {
  constructor(el) {
    this.svg = el;
    this._shapeColor = '#ffffff';
    this._selectedShape = undefined;
    this._selectedShapeZPosition = null;
    this._selectMode = false;

    this.svgElements = [];
    this._nodes = [];
    this.edgeDirection = 'UNDIRECTED';

    this._redoList = [];
    this.drawMode = 'line';

    this._addEdgeMode = false;
    this.selectedVertices = [];

    this.setSize();
    // this.svg.addEventListener('option-change', this.handleOptionChange.bind(this))
    this.svg.addEventListener('shapeSelected', this.handleShapeSelect.bind(this))
    this.svg.ontouchstart = this.mouseDown.bind(this);
    this.svg.ontouchend = this.mouseUp.bind(this);
    this.svg.onmouseout = this.mouseUp.bind(this);
    this.svg.ontouchmove = this.mouseMove.bind(this);


  }

  get addEdgeMode() { return this._addEdgeMode }
  set addEdgeMode(newValue) { this._addEdgeMode = newValue }


  // TODO Use this to create new svg nodes
  addVertex(value) {
    if (this.nodes.has(value)) {
      return this.nodes.get(value);
    } else {
      const vertex = new Node(value);
      this.nodes.set(value, vertex);
      return vertex;
    }
  }
  // TODO Use this to Remove new svg nodes
  removeVertex(value) {
    // TRY MAKING VALUE BE SVG ELEMENT
    const current = this.nodes.get(value);
    if (!current) return;
    for (const node of this.nodes.values()) {
      node.removeAdjacent(current);
    }
    return this.nodes.delete(value);
  }

  addEdge(source, destination) {
    const sourceNode = this.addVertex(source);
    const destinationNode = this.addVertex(destination);
    sourceNode.addAdjacent(destinationNode);
    if (this.edgeDirection === Graph.UNDIRECTED) destinationNode.addAdjacent(sourceNode);
    this.addEdgeMode = !this.addEdgeMode;

    return [sourceNode, destinationNode];
  }

  removeEdge(source, destination) {
    const sourceNode = this.nodes.get(source);
    const destinationNode = this.nodes.get(destination);
    if (!(sourceNode || destinationNode)) return;
    sourceNode.removeAdjacent(destinationNode);
    if (this.edgeDirection === Graph.UNDIRECTED) destinationNode.removeAdjacent(sourceNode)
    return [sourceNode, destinationNode];
  }




  undo() { if (this.svg.lastChild) this.redoList.push(this.svg.removeChild(this.svg.lastChild)) }
  redo() { if (this.redoList.length > 0) this.svg.appendChild(this.redoList.pop()) }

  resetShapeZPosition() {
    const refNode = this.svg.children[this.selectedShapeZPosition]
    this.selectedShape.classList.remove('selected-shape')
    this.selectedShape.classList.add('prev-selected-shape')
    this.svg.insertBefore(this.selectedShape, refNode)
  }

  toggleSelectMode(s) {
    if (this.selectMode) {
      console.log('toggle on', this);
    } else {
      if (this.selectedShape) {
        this.selectedShape.classList.remove('selected-shape')
        this.resetShapeZPosition();
      }
    }
  }

  handleShapeSelect(e) {
    console.log({ e });
    if (this.selectedShape) this.resetShapeZPosition();
    this.selectedShapeZPosition = [...this.svg.children].findIndex((c) => c = e.target);
    if (this.selectMode) this.selectedShape = e.target
  }

  moveSelectedShape(e) {
    const targ = e.target;
    let xPos = Math.round(parseInt(e.touches[0].pageX));
    let yPos = e.touches[0].pageY;
    let currX = targ.style.left.replace('px', '');
    let currY = targ.style.top;

    targ.style.left = `${parseInt(xPos) - 75}px`
    targ.style.top = `${parseInt(yPos) - 75}px`
    targ.style.zIndex = 30;
  }

  mouseDown(event) {
    if (!this._selectMode) {
      this.drawStart = true;
      if (this.drawMode === 'line') {
        const line = new Line({
          x1: event.touches[0].pageX,
          y1: event.touches[0].pageY,
          x2: event.touches[0].pageX,
          y2: event.touches[0].pageY
        }, this._shapeColor, this);

        this.current = line;
        this.svg.appendChild(line.getHtmlEl());
      } else if (this.drawMode === 'rect') {
        const rect = new Rect({
          x: event.touches[0].pageX,
          y: event.touches[0].pageY,
          width: 30,
          height: 30,
        }, this._shapeColor, this);

        this.current = rect;
        this.svg.appendChild(rect.getHtmlEl());
      }
    } else this.moveSelectedShape(event)
  }


  mouseUp(event) {
    this.drawStart = false;
    this.current = null;
  }

  mouseMove(event) {
    if (!this.selectMode) {
      if (this.drawStart && this.current) {
        if (this.drawMode === 'line') {
          let pos = this.current.getPosition();
          pos.x2 = event.touches[0].clientX;
          pos.y2 = event.touches[0].clientY;
          this.current.setPosition(pos);

        } else if (this.drawMode === 'rect') {
          this.current.setSize({
            width: event.touches[0].pageX - (this.current.position.x + 300),
            height: event.touches[0].pageY - (this.current.position.y + 300)
          });
        }
      }
    } else {
      this.selectedShape.setAttribute('x', event.touches[0].pageX - (parseInt(this._selectedShape.getAttribute('width')) / 2));
      this.selectedShape.setAttribute('y', event.touches[0].pageY - (parseInt(this._selectedShape.getAttribute('height'))));
    }
  }

  setSize() {
    this.svg.setAttribute('width', window.innerWidth);
    this.svg.setAttribute('height', window.innerHeight);
  }

  get redoList() { return this._redoList };
  set redoList(newValue) { this._redoList = newValue };

  get nodes() { return this._nodes };
  set nodes(newValue) { this._nodes = newValue };

  get shapeColor() { return this._shapeColor };
  set shapeColor(c) { this._shapeColor = c };

  get selectedShapeZPosition() { return this._selectedShapeZPosition }
  set selectedShapeZPosition(z) { this._selectedShapeZPosition = z };

  get selectMode() { return this._selectMode };
  set selectMode(s) {
    this._selectMode = s;
    this.toggleSelectMode(s);
  }

  get selectedShape() { return this._selectedShape };
  set selectedShape(el) {
    if (this.selectMode && !this.addEdgeMode) {
      if (this._selectedShape != el) {
        if (this._selectedShape != undefined) this._selectedShape.classList.remove('selected-shape')
        this._selectedShape = el;
        this._selectedShape.classList.add('selected-shape')
        this.selectedShapeZPosition = [...this.svg.children].findIndex((c) => {
          return c == el
        })
        this.svg.removeChild(this._selectedShape);
        this.svg.insertBefore(this._selectedShape, this.svg.children[-1]);
      } else {
        this.selectedShape.classList.remove('selected-shape')
        this.selectedShape = undefined;
      }
    }
  };
}