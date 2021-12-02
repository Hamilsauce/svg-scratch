import Line from './Line.js';
import Rect from './Rect.js';

// const graphMode = 'EDGE' || 'SELECT' || 'DRAW' || 'DELETE'
const graphMode = {
  DRAW: 'DRAW',
  SELECT: 'SELECT',
  EDGE: 'EDGE',
  DELETE: 'DELETE'
}

// Graph
export default class {
  constructor(el, color) {
    this.element = el;
    this._nodes = new Map();
    this.selectedVertices = [];
    this._redoList = [];

    this._selectedNode = null;
    this._selectedNodeZPosition = null;


    this._graphMode

    this._selectMode = false;
    this._addEdgeMode = false;
    this.drawMode = 'rect';

    this._shapeColor = color || '#ffffff';
    this.edgeDirection = 'UNDIRECTED';

    this.setSize();

    this.element.addEventListener('node-select', this.handleNodeSelect.bind(this))
    this.element.addEventListener('click', this.handleClick.bind(this))
    this.element.ontouchstart = this.mouseDown.bind(this);
    this.element.ontouchend = this.mouseUp.bind(this);
    this.element.onmouseout = this.mouseUp.bind(this);
    this.element.ontouchmove = this.mouseMove.bind(this);
  }

  handleClick(e) {
    console.log('handleClick', e);
    if (this.addEdgeMode === true && this.nodes.has(e.detail.target)) {
      this.selectedVertices.push(this.nodes.get(e.detail.target))
      this.nodes.get(e.detail.target).value.classList.add('selected-node')

      if (this.selectedVertices.length === 2) {
        const [src, dest] = this.selectedVertices
        this.addEdge(src, dest)
        this.addEdgeMode = false;
        this.selectedVertices = [];
      }
    }
  }

  handleNodeSelect(e) {
    console.log('handleNodeSelect', e);
    if (this.selectedNode) this.resetShapeZPosition();
    // this.selectedNodeZPosition = this.element.nodes.get(e.detail.target.element)
    this.selectedNodeZPosition = [...this.element.children].findIndex((c) => c === e.detail.target.element);
    if (this.selectMode || this.addEdgeMode) {
      this.selectedNode = this.nodes.get(e.detail.target.element)
      console.log('this.nodes.get(e.detail.target.element).element', this.nodes.get(e.detail.target.element))
    }

    console.log('[...this.nodes]', [...this.nodes])
    // this.handleClick(e)
  }
  mouseDown(event) {
    const targ = event.target;
    console.log({ targ });
    console.log('this', this)
    if (!(this.selectMode || this.addEdgeMode)) {
      if (true) {

      }
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
      } else if (this.drawMode === 'rect') {
        const rect = new Rect({
          x: event.touches[0].pageX,
          y: event.touches[0].pageY,
          width: 0,
          height: 0,
        }, this._shapeColor, this);
        this.current = rect;
        this.addVertex(rect)
      }
    } else {}
    event.stopPropagation()
  }


  get addEdgeMode() { return this._addEdgeMode }
  set addEdgeMode(newValue) {
    this._addEdgeMode = newValue
    if (newValue === false) {
      this.selectedVertices.forEach(v => {
        v.value.classList.remove('selected-node')
      });
      this.selectedVertices = []
    }
  }

  // TODO Use this to create new svg nodes
  addVertex(vertex) {
    if (this.nodes.has(vertex.element)) {
      return this.nodes.get(vertex.element);
    } else {
      this.nodes.set(vertex.element, vertex);
      this.element.appendChild(vertex.element);
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
    this.element.removeChild(value)
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

    this.element.appendChild(line.element);
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
    if (this.element.lastChild && this.nodes.has(this.element.lastChild)) {
      const target = this.nodes.get(this.element.lastChild)
      this.redoList.push(target)
      this.removeVertex(target.element)
    }
  }

  redo() {
    if (this.redoList.length > 0) {
      const node = this.redoList.pop();
      this.addVertex(node.element, node) //this.element.appendChild(this.redoList.pop())
    }
  }

  resetShapeZPosition() {
    const refNode = this.element.children[this.selectedNodeZPosition]
    this.selectedNode.classList.remove('selected-node')
    this.selectedNode.classList.add('prev-selected-shape')
    this.element.insertBefore(this.selectedNode, refNode)
  }

  toggleSelectMode(s) {
    if (this.selectMode) {} else {
      if (this.selectedNode) {
        this.selectedNode.classList.remove('selected-node')
        this.resetShapeZPosition();
      }
    }
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
          pos.x2 = event.touches[0].pageX;
          pos.y2 = event.touches[0].pageY;
          this.current.setPosition(pos);

        } else if (this.drawMode === 'rect') {
          this.current.setSize({
            width: event.touches[0].pageX - (this.current.x + 30),
            height: event.touches[0].pageY - (this.current.y + 30)
          });
        }
      }
    } else {
      // this.handleClick(event)
      const node = this.nodes.get(this.selectedNode)
      node.setCoords({
        x: parseInt(event.touches[0].pageX) - (node.width / 2),
        y: parseInt(event.touches[0].pageY) - (node.height),
      });

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
    this.element.setAttribute('width', window.innerWidth);
    this.element.setAttribute('height', window.innerHeight);
  }

  get redoList() { return this._redoList };
  set redoList(newValue) { this._redoList = newValue };

  get nodes() { return this._nodes };
  set nodes(newValue) {
    this._nodes = newValue
  };

  get shapeColor() { return this._shapeColor };
  set shapeColor(c) { this._shapeColor = c };

  get selectedNodeZPosition() { return this._selectedNodeZPosition }
  set selectedNodeZPosition(z) { this._selectedNodeZPosition = z };

  get selectMode() { return this._selectMode };
  set selectMode(s) {
    this._selectMode = s;
    this.toggleSelectMode(s);
  }

  get selectedNode() { return this._selectedNode };
  set selectedNode(el) {
    console.log({ el });
    if (this.selectMode && !this.addEdgeMode) {
      if (this.selectedNode != el) {
        if (this.selectedNode != undefined) this._selectedNode.classList.remove('selected-node')
        else {
          console.log('this.selectedNode', this.selectedNode)
          this.selectedNode.element.classList.add('selected-node')
          this.selectedNodeZPosition = [...this.element.children].findIndex((c) => {
            return c == el
          })
        }
        this.element.removeChild(this._selectedNode);
        this.element.insertBefore(this._selectedNode, this.element.children[-1]);
      } else {
        this.selectedNode.classList.remove('selected-node')
        // this.selectedNode = undefined;
      }
    }
  };
}