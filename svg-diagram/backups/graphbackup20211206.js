import Line from './Line.js';
import Rect from './Rect.js';
import Vertex from './Vertex.js';
import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
const { date, array, utils, text, help } = ham;
// const graphMode = 'EDGE' || 'SELECT' || 'DRAW' || 'DELETE'
help('', 'event')
const GRAPH_MODES = [
  ['DRAW', false],
  ['SELECT', false],
  ['EDGE', false],
  ['DELETE', false],
]


// Graph
export default class {
  constructor(element, vertexFill, graphMode = 'DRAW', seedData = []) {
    this._element = element;
    // this._vertices = new VertexCollection(seedData);
    this._vertices = new Map();
    this._selectedVertices = [];
    this._redoList = [];
    this.optionActionMap = this.initOptionActions();
    this._selectedVertex = null;
    this._selectedVertexZPosition = null;

    this.graphModeMap = new Map(GRAPH_MODES)
    this._graphMode;
    this.graphMode = graphMode;
    this.drawMode = 'rect';

    this._vertexFill = vertexFill || '#ffffff';
    this.edgeDirection = 'UNDIRECTED';

    this.setSize();

    this.element.addEventListener('click', e => {
      console.log('sel verts', this.selectedVertices);

    })
  }

  get children() {
    return [...this.element.children]
  }

  getVertexZ(vertex) {
    if (!vertex) return;
    const index = this.children.indexOf(vertex)
    return index === -1 ? null : index;
  }

  handleEdgeMode(e) {
    console.log('k', e);
    if (this.addEdgeMode === true && this.vertices.has(e.detail.target)) {
      this.selectedVertices.push(this.vertices.get(e.detail.target))
      this.vertices.get(e.detail.target).value.classList.add('selected-vertex')

      if (this.selectedVertices.length === 2) {
        const [src, dest] = this.selectedVertices
        this.addEdge(src, dest)
        this.addEdgeMode = false;
        this.selectedVertices = [];
      }
    }
  }
  get activeGraphMode() {
    return [...this.graphModeMap].reduce((mode, [key, val], i) => value === true ? key : mode, '');
  }

  set activeGraphMode(newValue) {
    this._mode = newValue
  }

  changeGraphMode(incomingMode = '') {
    if (incomingMode !== 'string') return;
    if (this.graphModeMap.has(incomingMode.toUpperCase())) {
      this.graphModeMap.get(this.activeGraphMode) = false;
      this.graphModeMap.get(incomingMode) = true;
    }
  }

  selectVertex(e) {
    const targetVertex = e.detail.target;
    const targetNode = this.vertices.get(targetVertex);
    console.log({ targetVertex });
    if (this.graphMode === 'SELECT') {
      // this.selectedVertices = 
      if (!(this.selectedVertices[0] && this.selectedVertices.includes(targetVertex))) {
        // targetNode.isSelected = true;
        this.selectedVertices.push(targetVertex);
      } else if (tiargetVertex === this.selectedVertices[0]) {
        // targetNode.isSelected = false;
        this.selectedVertices = [];
      }
    } else if (this.graphMode === 'EDGE') {

      this.selectedVertices.push(targetVertex)
      // targetNode.isSelected = true;
      if (this.selectedVertices.length === 2) {
        const [src, dest] = this.selectedVertices
        this.addEdge(src, dest)
        // this.vertices.get(src).isSelected = false;
        // this.vertices.get(dest).isSelected = false;
        this.selectedVertices = [];
      }


    }
    // this.element.addEventListener('vertex-move', this.vertexMove.bind(this), false);


    // console.log('handletargetVertexSelect', e);
    // if (this.selectedVertex) this.resetShapeZPosition();
    // this.selectedVertexZPosition = [...this.element.children].findIndex((child) => child === targetVertex);
    // // this.selectedVertexZPosition = this.element.vertices.get(e.detail.target.element)

    // if (this.graphMode || this.addEdgeMode) {
    //   this.selectedVertex = this.vertices.get(e.detail.target.element)
    //   console.log('this.vertices.get(e.detail.target.element).element', this.vertices.get(e.detail.target.element))
    // }

    console.log('[...this.vertices]', this)
    // this.handleEdgeMode(e)
  }


  mouseDown(event) {
    const targ = event.target;
    if (this.graphMode === 'DRAW') {
      if (true) {

      }
      this.element.addEventListener('touchend', this.mouseUp.bind(this), false);
      this.element.addEventListener('mouseout', this.mouseUp.bind(this), false);
      this.element.addEventListener('touchmove', this.mouseMove.bind(this), false);

      this.drawStart = true;
      if (this.drawMode === 'line') {
        const line = new Line({
          x1: event.touches[0].pageX,
          y1: event.touches[0].pageY,
          x2: event.touches[0].pageX,
          y2: event.touches[0].pageY
        }, this._vertexFill, this);

        this.current = line;
        this.addVertex(line.element, line)
      } else if (this.drawMode === 'rect') {
        // const rect = new Rect({
        //   x: event.touches[0].pageX,
        //   y: event.touches[0].pageY,
        //   width: 0,
        //   height: 0,
        // }, this._vertexFill, this);
        const vertex = new Vertex({
          x: event.touches[0].pageX,
          y: event.touches[0].pageY,
          width: 0,
          height: 0,
        }, this.children.length, this.vertexFill, this);
        this.current = vertex;
        this.addVertex(vertex)
        // this.current = rect;
        // this.addVertex(rect)
      }
    } else {
      this.element.addEventListener('vertex-move', this.vertexMove.bind(this), false);

    }
    event.stopPropagation()
  }


  resetShapeZPosition() {
    const refVertex = this.element.children[this.selectedVertexZPosition]
    this.selectedVertex.classList.remove('selected-vertex')
    this.selectedVertex.classList.add('prev-selected-shape')
    this.element.insertBefore(this.selectedVertex, refVertex)
  }

  mouseUp(event) {
    this.drawStart = false;
    this.current = null;
    if (this.graphMode === 'DRAW') {
      this.element.removeEventListener('touchend', this.mouseUp.bind(this), false);
      this.element.removeEventListener('mouseout', this.mouseUp.bind(this), false);
      this.element.removeEventListener('touchmove', this.mouseMove.bind(this), false);
    }
  }

  vertexMove(e) {

    // this.handleEdgeMode(event)
    console.log('event.detail.target)', event.detail.target)
    const vertex = this.vertices.get(event.detail.target)
    console.log('vertex, VERTICES, event.detail.target after mousemove', [vertex, [...this.vertices], event])
    vertex.setCoords({
      x: parseInt(event.touches[0].pageX) - (vertex.width / 2),
      y: parseInt(event.touches[0].pageY) - (vertex.height),
    });

    if (vertex.edges.size > 0) {
      vertex.edges.forEach((edge, edgeValue) => {
        if (edge.vertexOrder === 0) {
          edge.element.setAttribute('x1', vertex.centroid.x)
          edge.element.setAttribute('y1', vertex.centroid.y)
        } else {
          edge.element.setAttribute('x2', vertex.centroid.x)
          edge.element.setAttribute('y2', vertex.centroid.y)
        }
      })
    }

  }

  mouseMove(event) {


    event.preventDefault();
    if (this.graphMode === 'DRAW') {
      if (this.drawStart && this.current) {
        if (this.drawMode === 'line') {
          let pos = this.current.getPosition();
          pos.x2 = event.touches[0].pageX;
          pos.y2 = event.touches[0].pageY;
          this.current.setPosition(pos);

        }
        else if (this.drawMode === 'rect') {
          this.current.setSize({
            width: event.touches[0].pageX - (this.current.x + 30),
            height: event.touches[0].pageY - (this.current.y + 30)
          });
        }
      }
    }
    else if (['SELECT', 'EDGE'].includes(this.graphMode)) {
      console.log('snorp');
      this.vertexMove.bind(this);
    }
  }

  setSize() {
    this.element.setAttribute('width', window.innerWidth);
    this.element.setAttribute('height', window.innerHeight);
  }


  get graphMode() { return this._graphMode }
  set graphMode(newValue) {
    this.selectedVertices.forEach(v => v.isSelected = false);
    this.selectedVertices = []

    if (this.graphMode === newValue) return;
    this._graphMode = newValue

    if (this.graphMode === 'DRAW') {
      this.element.removeEventListener('vertex-select', this.selectVertex.bind(this), false)
      this.element.addEventListener('touchstart', this.mouseDown.bind(this), false);
    }
    else if (['EDGE', 'SELECT'].includes(this.graphMode)) {
      this.element.addEventListener('vertex-select', this.selectVertex.bind(this), false)
      this.element.removeEventListener('touchstart', this.mouseDown.bind(this), false);
      this.element.removeEventListener('touchend', this.mouseUp.bind(this), false);
      this.element.removeEventListener('mouseout', this.mouseUp.bind(this), false);
      this.element.removeEventListener('touchmove', this.mouseMove.bind(this), false);
    }
  }


  get redoList() { return this._redoList };
  set redoList(newValue) { this._redoList = newValue };

  get element() { return this._element };
  set element(newValue) { this._element = newValue };

  get vertices() { return this._vertices };
  set vertices(newValue) {
    this._vertices = newValue
  };

  get vertexFill() { return this._vertexFill };
  set vertexFill(c) { this._vertexFill = c };

  get selectedVertexZPosition() { return this._selectedVertexZPosition }
  set selectedVertexZPosition(z) { this._selectedVertexZPosition = z };

  // get graphMode() { return this._graphMode };
  // set graphMode(s) {
  //   this._graphMode = s;
  //   this.toggleSelectMode(s);
  // }

  get selectedVertex() { return this._selectedVertex };
  set selectedVertex(newValue) { this._selectedVertex = z };


  get selectedVertices1() { return this._selectedVertices };
  set selectedVertices1(newValue) { this._selectedVertices = newValue };

  get selectedVertices() {
    return this.children.filter((ch, i) => {
      if (ch instanceof SVGGElement) {
        const vertex = this.vertices.get(ch)
        return vertex.isSelected === true
      }

    }).map((ch, i) => {
      return this.vertices.get(ch)
    });
  };

  set selectedVertices(newValue) { this._selectedVertices = newValue };

  // TODO DEPECRATED
  get addEdgeMode() { return this._addEdgeMode }
  set addEdgeMode(newValue) {
    this._addEdgeMode = newValue
    if (newValue === false) {
      this.selectedVertices.forEach(v => {
        v.value.classList.remove('selected-vertex')
      });
      this.selectedVertices = []
    }
  }

  //   if (!el) return;
  //   console.log({ el });
  //   // if (this.graphMode && !this.addEdgeMode) {
  //   // if (this.selectedVertex != el) {
  //   // if (this.selectedVertex != undefined) this.selectedVertex.classList.remove('selected-vertex')
  //   // else {
  //   console.log('this.selectedVertex', this.selectedVertex)
  //   this.selectedVertex.element.classList.add('selected-vertex')
  //   this.selectedVertexZPosition = [...this.element.children].findIndex((c) => {
  //     return c == el
  //   })
  //   // }
  //   this.element.removeChild(this._selectedVertex);
  //   this.element.insertBefore(this._selectedVertex, this.element.children[-1]);
  //   // } else {
  //   this.selectedVertex.classList.remove('selected-vertex')
  //   // this.selectedVertex = undefined;
  //   // }
  //   // }
  // }

  addVertex(vertex) {
    if (this.vertices.has(vertex.element)) {
      return this.vertices.get(vertex.element);
    } else {
      this.vertices.set(vertex.element, vertex);
      this.element.appendChild(vertex.element);
      return vertex;
    }
  }

  removeVertex(value) {
    const current = this.vertices.get(value);
    if (!current) return;
    for (const vertex of this.vertices.values()) {
      vertex.removeAdjacent(current);
    }
    this.element.removeChild(value)
    return this.vertices.delete(value);
  }

  addEdge(source, destination) {
    const sourceVertex = this.addVertex(source.element);
    const destinationVertex = this.addVertex(destination.element);
    sourceVertex.addAdjacent(destinationVertex);

    if (this.edgeDirection === 'UNDIRECTED') destinationVertex.addAdjacent(sourceVertex);

    const line = new Line({
      x1: sourceVertex.centroid.x,
      y1: sourceVertex.centroid.y,
      x2: destinationVertex.centroid.x,
      y2: destinationVertex.centroid.y,
    }, this._vertexFill, this);

    this.element.appendChild(line.element);
    sourceVertex.edges.set(line.element, { vertexOrder: 0, element: line.element })
    destinationVertex.edges.set(line.element, { vertexOrder: 1, element: line.element })
    this.addEdgeMode = !this.addEdgeMode;
    return [sourceVertex, destinationVertex];
  }

  removeEdge(source, destination) {
    const sourceVertex = this.vertices.get(source);
    const destinationVertex = this.vertices.get(destination);
    if (!(sourceVertex || destinationVertex)) return;

    sourceVertex.removeAdjacent(destinationVertex);
    if (this.edgeDirection === Graph.UNDIRECTED) destinationVertex.removeAdjacent(sourceVertex)
    return [sourceVertex, destinationVertex];
  }

  undo() {
    if (this.element.lastChild && this.vertices.has(this.element.lastChild)) {
      const target = this.vertices.get(this.element.lastChild)
      this.redoList.push(target)
      this.removeVertex(target.element)
    }
  }

  redo() {
    if (this.redoList.length > 0) {
      const vertex = this.redoList.pop();
      this.addVertex(vertex.element, vertex) //this.element.appendChild(this.redoList.pop())
    }
  }


  optionAction({ type, data }) {
    if (typeof type != 'string' || !this.optionActionMap.has(type)) return;
    console.log('this.optionActionMap.get(type)', this.optionActionMap.get(type))
    this.optionActionMap.get(type)(data);
  }

  initOptionActions() {
    return new Map(
      [
        [
          'draw-mode',
          (data) => this.drawMode = data
        ],
        [
          'graph-mode',
          (data) => this.graphMode = data
        ],
        [
          'color-selection',
          (data) => this.vertexFill = data
        ],
        [
          'undo',
          (data) => this.undo()
        ],
        [
          'redo',
          (data) => this.redo()
        ],
        [
          'add-edge-mode',
          (data) => this.addEdgeMode = !this.addEdgeMode
        ],
        [
          'add-edge-confirm',
          (data) => this.addEdge(...this.selectedVertices)
        ],
      ]
    );
  }
}