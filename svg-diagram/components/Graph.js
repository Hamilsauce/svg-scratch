import Line from './Line.js';
import Rect from './Rect.js';
import Vertex from './Vertex.js';
import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
const { date, array, utils, text, help } = ham;

const { interval, of , fromEvent, merge, empty, Subject } = rxjs;
const { switchMap, mergeMap, take, filter, scan, takeWhile, startWith, tap, map, mapTo } = rxjs.operators;

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
    this.optionActionMap = this.initOptionActions();
    this._vertices = new Map();
    this._redoList = [];
    this._selectedVertexZPosition = null;
    this.activeVertex = null;
    this.graphModeMap = new Map(GRAPH_MODES)
    this._graphMode;
    this.graphMode = graphMode;
    this.drawMode = 'rect';

    this._vertexFill = vertexFill || '#ffffff';
    this.edgeDirection = 'UNDIRECTED';

    this.setSvgSize();

    this.optionsSubject$ = new Subject();

    this.drawActions$ = {
      start: fromEvent(this.element, 'touchstart').pipe(filter(_ => this.graphMode === 'DRAW'), map(x => this.drawStart(x))),
      move: fromEvent(this.element, 'touchmove').pipe(map(x => this.drawMove(x))),
      end: fromEvent(this.element, 'touchend').pipe(map(x => this.drawEnd(x)), ),
    };

    this.drawSubscription = this.drawActions$.start.pipe(
      switchMap(e => this.drawActions$.move.pipe(
        switchMap(e => this.drawActions$.end)))).subscribe();

    this.vertexSubjects = { click$: new Subject(), };

    // BLUR?
    this.vertexClick$ = fromEvent(this.element, 'vertex-click')
      .pipe(filter(_ => this.graphMode === 'SELECT'), )
      .subscribe(this.vertexSubjects.click$)
  }

  get selectedVerticesMap() {
    return new Map(this.children.filter((ch, i) => {
      return this.vertices.get(ch).isSelected === true
    }).map((ch, i) => [ch, this.vertices.get(ch)]));
  };

  // vertexInactive(event) {
  //   console.log('this.vertices.get(event.detail.target)', this.vertices.get(event.detail.target))
  //   this.vertices.get(event.detail.target).isSelected = false;
  //   const evt = new CustomEvent('vertex-inactive', { bubbles: false, detail: { target: this.element } })
  //   targetVertex.dispatchEvent(evt)
  // }

  selectVertex(e) {
    console.log('selectVertex e', e);
    const targetVertex = e.detail.target;
    const targetNode = this.vertices.get(targetVertex);

    const evt = new CustomEvent('node-selected', { bubbles: false, detail: { data: 'got u' } })
    targetVertex.dispatchEvent(evt)

    if (this.graphMode === 'SELECT') {
      if (!this.selectedVertices.includes(targetVertex)) {
        this.activeVertex = targetNode.element
      } else {
        this.activeVertex = null
      }
    } else if (this.graphMode === 'EDGE') {
      this.selectedVertices.push(targetVertex)
      if (this.selectedVertices.length === 2) {
        const [src, dest] = this.selectedVertices
        this.addEdge(src, dest)
        this.vertices.get(src).isSelected = false;
        this.vertices.get(dest).isSelected = false;
        this.selectedVertices = [];
      }
    }
  }

  drawStart(event) {
    event.stopPropagation()
    const targ = event.target;
    if (this.graphMode === 'DRAW') {
      this.isDrawing = true;
      if (this.drawMode === 'rect') {
        const vertex = new Vertex({
          x: event.touches[0].pageX,
          y: event.touches[0].pageY,
          width: 0,
          height: 0,
        }, this.vertexSubjects, this.children.length, this.vertexFill, this);
        this.current = vertex;
        this.addVertex(vertex)
      }
    } else if (['SELECT', 'EDGE'].includes(this.graphMode)) {}
  }

  drawMove(event) {
    // TAKES A TOUCHEVENT
    event.preventDefault();
    if (this.graphMode === 'DRAW') {
      if (this.isDrawing) {
        if (this.drawMode === 'rect') {
          this.current.setSize({
            width: event.touches[0].pageX - (this.current.x + 30),
            height: event.touches[0].pageY - (this.current.y + 30)
          });
        }
      }
    }
    else if (['SELECT', 'EDGE'].includes(this.graphMode)) {}
  }

  drawEnd(event) {
    this.isDrawing = false;
    this.current = null;
  }

  getVertexZ(vertex) {
    if (!vertex) return;
    const index = this.children.indexOf(vertex)
    return index === -1 ? null : index;
  }

  handleEdgeMode(e) {
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

  setSvgSize() {
    this.element.setAttribute('width', window.innerWidth);
    this.element.setAttribute('height', window.innerHeight);
  }

  resetShapeZPosition() {
    const refVertex = this.element.children[this.selectedVertexZPosition]
    this.selectedVertex.classList.remove('selected-vertex')
    this.selectedVertex.classList.add('prev-selected-shape')
    this.element.insertBefore(this.selectedVertex, refVertex)
  }

  changeGraphMode(incomingMode = '') {
    if (incomingMode !== 'string') return;
    if (this.graphModeMap.has(incomingMode.toUpperCase())) {
      this.graphModeMap.get(this.activeGraphMode) = false;
      this.graphModeMap.get(incomingMode) = true;
    }
  }

  get children() {
    return [...this.element.children]
  }

  get activeGraphMode() {
    return [...this.graphModeMap].reduce((mode, [key, val], i) => value === true ? key : mode, '');
  }

  set activeGraphMode(newValue) {
    this._mode = newValue
  }

  get graphMode() { return this._graphMode }
  set graphMode(newValue) {
    this.selectedVertices.forEach(v => v.isSelected = false);
    this.selectedVertices = []

    if (this.graphMode === newValue) return;
    this._graphMode = newValue

    if (this.graphMode === 'DRAW') {}
    else if (['EDGE', 'SELECT'].includes(this.graphMode)) {}

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

  get selectedVertices1() { return this._selectedVertices };
  set selectedVertices1(newValue) { this._selectedVertices = newValue };

  get selectedVertices() {
    return this.children.filter((ch, i) => {
      return this.vertices.get(ch).isSelected === true
    }) //.map((ch, i) => this.vertices.get(ch));
  };

  set selectedVertices(newValue) { this._selectedVertices = newValue };

  // TODO DEPECRATED
  // get addEdge() { return this._addEdgeMode }
  // set addEdge(newValue) {
  //   this._addEdgeMode = newValue
  //   if (newValue === false) {
  //     this.selectedVertices.forEach(v => {
  //       v.value.classList.remove('selected-vertex')
  //     });
  //     this.selectedVertices = []
  //   }
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
    for (const vertex of this.vertices.values()) vertex.removeAdjacent(current);
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

  deleteVertex() {
    if (this.graphMode === 'SELECT' && this.activeVertex !== null) {
      this.undo(this.activeVertex)
    }
  }

  undo(target = null) {
    if (target !== null) {
      const node = this.vertices.get(target)
      this.redoList.push(node)
      this.removeVertex(node.element)

    } else {

      if (this.element.lastChild && this.vertices.has(this.element.lastChild)) {
        const target = this.vertices.get(this.element.lastChild)
        this.redoList.push(target)
        this.removeVertex(target.element)
      }
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
    else this.optionActionMap.get(type)(data);
  }

  initOptionActions() {
    return new Map(
      [
        ['draw-mode', (data) => this.drawMode = data],
        ['graph-mode', (data) => this.graphMode = data],
        ['color-selection', (data) => this.vertexFill = data],
        ['undo', (data) => this.undo()],
        ['delete', (data) => this.deleteVertex()],
        ['redo', (data) => this.redo()],
        ['add-edge-mode', (data) => this.addEdgeMode = !this.addEdgeMode],
        ['add-edge-confirm', (data) => this.addEdge(...this.selectedVertices)],
      ]
    );
  }
}