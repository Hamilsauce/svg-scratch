import Line from './Line.js';
import Rect from './Rect.js';

// Graph
export default class {
  constructor(el) {
    this.svg = el;
    this._shapeColor = '#ffffff';
    this._selectedShape = undefined;
    this._selectedShapeZPosition = null;
    this._selectMode = false;
    this.selectedVertices = [];

    this._nodes = new Map();
    this.svgElements = [];
    this.edgeDirection = 'UNDIRECTED';

    this._redoList = [];
    this.drawMode = 'rect';

    this._addEdgeMode;
    this.addEdgeMode = false;

    this.setSize();
    // this.svg.addEventListener('option-change', this.handleOptionChange.bind(this))
    this.svg.addEventListener('shapeSelected', this.handleShapeSelect.bind(this))
    this.svg.addEventListener('click', this.handleClick.bind(this))
    this.svg.ontouchstart = this.mouseDown.bind(this);
    this.svg.ontouchend = this.mouseUp.bind(this);
    this.svg.onmouseout = this.mouseUp.bind(this);
    this.svg.ontouchmove = this.mouseMove.bind(this);
  }

  handleClick(e) {
    if (this.addEdgeMode === true && this.nodes.has(e.target)) {
      this.selectedVertices.push(this.nodes.get(e.target))
      this.nodes.get(e.target).value.classList.add('selected-shape')

      if (this.selectedVertices.length === 2) {
        const [src, dest] = this.selectedVertices
        this.addEdge(src, dest)
        this.addEdgeMode = false;
        this.selectedVertices = [];
      }
    }
  }


  get addEdgeMode() { return this._addEdgeMode }
  set addEdgeMode(newValue) {
    this._addEdgeMode = newValue
    if (newValue === false) {
      this.selectedVertices.forEach(v => {
        v.value.classList.remove('selected-shape')
      });
      this.selectedVertices = []
    }
  }


  // TODO Use this to create new svg nodes
  addVertex(value, vertex) {
    if (this.nodes.has(value)) {
      return this.nodes.get(value);
    } else {
      this.nodes.set(value, vertex);
      this.svg.appendChild(value);
      return vertex;
    }
  }
  // TODO Use this to Remove new svg nodes
  removeVertex(value) {
    const current = this.nodes.get(value);
    if (!current) return;
    for (const node of this.nodes.values()) {
      node.removeAdjacent(current);
    }
    this.svg.removeChild(value)
    return this.nodes.delete(value);
  }

  addEdge(source, destination) {
    const sourceNode = this.addVertex(source.element);
    const destinationNode = this.addVertex(destination.element);
    sourceNode.addAdjacent(destinationNode);

    if (this.edgeDirection === 'UNDIRECTED') destinationNode.addAdjacent(sourceNode);

    const line = new Line({
      x1: sourceNode.centroid.x,
      y1: sourceNode.centroid.y,
      x2: destinationNode.centroid.x,
      y2: destinationNode.centroid.y,
    }, this._shapeColor, this);

    this.svg.appendChild(line.element);
    sourceNode.edges.set(line.element, { nodeOrder: 0, element: line.element })
    destinationNode.edges.set(line.element, { nodeOrder: 1, element: line.element })
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


  undo() {
    if (this.svg.lastChild && this.nodes.has(this.svg.lastChild)) {
      const target = this.nodes.get(this.svg.lastChild)
      this.redoList.push(target)
      this.removeVertex(target.element)
    }
  }
  
  redo() {
    if (this.redoList.length > 0) {
      const node = this.redoList.pop();
      this.addVertex(node.element, node) //this.svg.appendChild(this.redoList.pop())
    }
  }

  resetShapeZPosition() {
    const refNode = this.svg.children[this.selectedShapeZPosition]
    this.selectedShape.classList.remove('selected-shape')
    this.selectedShape.classList.add('prev-selected-shape')
    this.svg.insertBefore(this.selectedShape, refNode)
  }

  toggleSelectMode(s) {
    if (this.selectMode) {
      // console.log('toggle on', this);
    } else {
      if (this.selectedShape) {
        this.selectedShape.classList.remove('selected-shape')
        this.resetShapeZPosition();
      }
    }
  }

  handleShapeSelect(e) {
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
    if (!(this._selectMode || this.addEdgeMode)) {
      this.drawStart = true;
      if (this.drawMode === 'line') {
        const line = new Line({
          x1: event.touches[0].pageX,
          y1: event.touches[0].pageY,
          x2: event.touches[0].pageX,
          y2: event.touches[0].pageY
        }, this._shapeColor, this);

        this.current = line;
        this.addVertex(line.element, line)
        // this.svg.appendChild(line.getHtmlEl());
      } else if (this.drawMode === 'rect') {
        const rect = new Rect({
          x: event.touches[0].pageX,
          y: event.touches[0].pageY,
          width: 30,
          height: 30,
        }, this._shapeColor, this);

        this.current = rect;
        this.addVertex(rect.group, rect)
        // this.svg.appendChild(rect.element);
      }
    } else this.moveSelectedShape(event)
  }


  mouseUp(event) {
    this.drawStart = false;
    this.current = null;
  }

  mouseMove(event) {
    event.preventDefault();
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
      const node = this.nodes.get(this.selectedShape)
      if (node.edges.size > 0) {
        node.edges.forEach((edge, edgeValue) => {
          if (edge.nodeOrder === 0) {
            edge.element.setAttribute('x1', node.centroid.x)
            edge.element.setAttribute('y1', node.centroid.y)

          } else {
            edge.element.setAttribute('x2', node.centroid.x)
            edge.element.setAttribute('y2', node.centroid.y)

          }
        })



      }
    }
  }

  setSize() {
    this.svg.setAttribute('width', window.innerWidth);
    this.svg.setAttribute('height', window.innerHeight);
  }

  get redoList() { return this._redoList };
  set redoList(newValue) { this._redoList = newValue };

  get nodes() {
    console.log('this._nodes get', this._nodes);
    return this._nodes
  };
  set nodes(newValue) {
    console.log('this._nodes set', this._nodes);
    this._nodes = newValue
  };

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