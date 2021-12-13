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
    this._vertices = new Map();
    this._selectedVertices = [];
    this._redoList = [];
    this.optionActionMap = this.initOptionActions();
    this._selectedVertex = null;
    this._selectedVertexZPosition = null;

    this.activeVertex = null;

    this.graphModeMap = new Map(GRAPH_MODES)
    this._graphMode;
    this.graphMode = graphMode;
    this.drawMode = 'rect';

    this._vertexFill = vertexFill || '#ffffff';
    this.edgeDirection = 'UNDIRECTED';

    this.setSize();
    this.init();
    this.optionsSubject$ = new Subject();

    this.vertexSubjects = {
      click$: new Subject(),
      move$: new Subject(),
      inactive$: new Subject(),
    };

    this.vertexClick$ = fromEvent(this.element, 'vertex-click')
      .pipe(filter(_ => this.graphMode === 'SELECT'), )
      .subscribe(this.vertexSubjects.click$)


    this.touchstart$ = fromEvent(this.element, 'touchstart')
      .pipe(
        filter(_ => this.graphMode === 'DRAW'),
        map(x => this.mouseDown(x))
      );
    this.touchmove$ = fromEvent(this.element, 'touchmove')
      .pipe(
        map(x => this.mouseMove(x))
      );
    this.touchend$ = fromEvent(this.element, 'touchend')
      .pipe(
        map(x => this.mouseUp(x)),
      );

    this.touchSubscription = this.touchstart$
      .pipe(
        switchMap(e => {
          return this.touchmove$
            .pipe(
              switchMap(e => this.touchend$)
            )
        })
      ).subscribe()




    this.vertexMove$ = fromEvent(this.element, 'vertex-move')
      .pipe(
        filter(_ => this.graphMode === 'SELECT'),
        // filter(_ => this.graphMode === 'SELECT'),
      )
    // .subscribe(this.vertexSubjects.move$)

    this.vertexInactive$ = fromEvent(this.element, 'vertex-inactive')
      .pipe(filter(_ => this.graphMode === 'SELECT'), )
    // .subscribe(this.vertexSubjects.inactive$)

    // this.element.addEventListener('touchmove', this.vertexMoveHandler)

  }

  init() {
    this.selectVertexHandler = this.selectVertex.bind(this)
    this.vertexMoveHandler = this.vertexMove.bind(this)
    this.vertexInactiveHandler = this.vertexInactive.bind(this)
    this.mouseDownHandler = this.mouseDown.bind(this)
    this.deselectVertexHandler = this.deselectVertex.bind(this)
    this.mouseUpHandler = this.mouseUp.bind(this)
    this.mouseMoveHandler = this.mouseMove.bind(this);
    // this.element.addEventListener('touchstart', this.mouseDownHandler);
    // this.element.addEventListener('vertex-move', this.vertexMoveHandler);
    // this.element.addEventListener('vertex-move', this.vertexMoveHandler)
  }

  get selectedVerticesMap() {
    return new Map(this.children.filter((ch, i) => {
      return this.vertices.get(ch).isSelected === true
    }).map((ch, i) => [ch, this.vertices.get(ch)]));
  };

  deselectVertex(e) {
    console.log('vertec deselect', e);
    const targetVertex = e.detail.target;
    const targetNode = this.vertices.get(targetVertex);
    // targetNode.isSelected = false;
  }

  vertexInactive(event) {
    console.log('this.vertices.get(event.detail.target)', this.vertices.get(event.detail.target))
    this.vertices.get(event.detail.target).isSelected = false;
    this.element.removeEventListener('vertex-move', this.vertexMoveHandler);
    this.element.removeEventListener('vertex-inactive', this.vertexInactiveHandlerHandler);
    const evt = new CustomEvent('vertex-inactive', { bubbles: false, detail: { target: this.element } })
    targetVertex.dispatchEvent(evt)
    // } else if (['SELECT', 'EDGE'].includes(this.graphMode)) {
    // this.element.removeEventListener('touchend', this.mouseUpHandler);
    // this.element.removeEventListener('mouseout', this.mouseUpHandler);
    // this.element.removeEventListener('touchmove', this.mouseMoveHandler);
    // }
  }


  selectVertex(e) {
    console.log('selectVertex e', e);
    const targetVertex = e.detail.target;
    const targetNode = this.vertices.get(targetVertex);

    const evt = new CustomEvent('node-selected', { bubbles: false, detail: { data: 'got u' } })
    targetVertex.dispatchEvent(evt)

    if (this.graphMode === 'SELECT') {

      // console.log('!this.selectedVertices.includes(targetVertex)', !this.selectedVertices.includes(targetVertex))
      if (
        !this.selectedVertices.includes(targetVertex)
        // && !this.activeVertex === targetNode.element
      ) {
        // console.log('targetVertex, targetNode', [targetVertex,targetNode])
        // targetNode.isSelected = true //!targetNode.isSelected;
        this.activeVertex = targetNode.element
        // this.element.addEventListener('vertex-deselect', this.deselectVertexHandler);
        // this.element.addEventListener('vertex-move', this.vertexMoveHandler);
        // this.element.addEventListener('vertex-inactive', this.vertexInactiveHandlerHandler);
      } else {
        // targetNode.isSelected = false;
        this.activeVertex = null
        // this.element.removeEventListener('vertex-deselect', this.deselectVertexHandler);
        this.element.removeEventListener('vertex-inactive', this.vertexInactiveHandlerHandler);
        this.element.removeEventListener('vertex-move', this.vertexMoveHandler);
      }
    } else if (this.graphMode === 'EDGE') {
      this.selectedVertices.push(targetVertex)
      // this.element.addEventListener('vertex-select', this.deselectVertexHandler);
      if (this.selectedVertices.length === 2) {
        const [src, dest] = this.selectedVertices
        this.addEdge(src, dest)
        this.vertices.get(src).isSelected = false;
        this.vertices.get(dest).isSelected = false;
        this.selectedVertices = [];
      }
    }
  }

  vertexMove({ detail }) {
    // TODO event currently a TOUCHEVENT
    // console.log('detail',);detail
    const event = detail.event
    const vertex = this.vertices.get(detail.target)
    // console.log('vertex in GRAPH VERTECMOVE', vertex)
    if (['SELECT', 'EDGE'].includes(this.graphMode)) {
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
  }

  mouseDown(event) {
    event.stopPropagation()
    const targ = event.target;
    if (this.graphMode === 'DRAW') {
      this.drawStart = true;
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

  mouseMove(event) {
    // TAKES A TOUCHEVENT
    event.preventDefault();
    if (this.graphMode === 'DRAW') {
      if (this.drawStart) {
        if (this.drawMode === 'rect') {
          this.current.setSize({
            width: event.touches[0].pageX - (this.current.x + 30),
            height: event.touches[0].pageY - (this.current.y + 30)
          });
        }
      }
    }
    else if (['SELECT', 'EDGE'].includes(this.graphMode)) {
      // console.log('snorp');
    }
  }

  mouseUp(event) {
    this.drawStart = false;
    this.current = null;
    // if (this.graphMode === 'DRAW') {
    //   this.element.removeEventListener('touchend', this.mouseUpHandler);
    //   this.element.removeEventListener('mouseout', this.mouseUpHandler);
    //   this.element.removeEventListener('touchmove', this.mouseMoveHandler);
    // }
    // else if (['SELECT', 'EDGE'].includes(this.graphMode)) {
    //   // this.element.removeEventListener('touchend', this.mouseUpHandler);
    //   // this.element.removeEventListener('mouseout', this.mouseUpHandler);
    //   // this.element.removeEventListener('touchmove', this.mouseMoveHandler);
    // }

  }


  getVertexZ(vertex) {
    if (!vertex) return;
    const index = this.children.indexOf(vertex)
    return index === -1 ? null : index;
  }

  handleEdgeMode(e) {
    // console.log('k', e);
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

  setSize() {
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

    if (this.graphMode === 'DRAW') {
      // this.element.removeEventListener('vertex-click', this.selectVertexHandler);
      // this.element.removeEventListener('vertex-deselect', this.deselectVertexHandler);
      // this.element.removeEventListener('vertex-move', this.vertexMoveHandler);
      this.element.addEventListener('touchstart', this.mouseDownHandler);
    }
    else if (['EDGE', 'SELECT'].includes(this.graphMode)) {
      // console.log('edgr sel');
      this.element.removeEventListener('touchstart', this.mouseDownHandler);
      this.element.removeEventListener('touchend', this.mouseUpHandler);
      this.element.removeEventListener('mouseout', this.mouseUpHandler);
      this.element.removeEventListener('touchmove', this.mouseMoveHandler);
      // this.element.addEventListener('vertex-click', this.selectVertexHandler);
      // this.element.addEventListener('vertex-select', this.selectVertexHandler);
      // this.element.addEventListener('vertex-deselect', this.deselectVertexHandler);

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
    // console.log('deleteVertex this', this);
    // console.log('deleteVertex this.selectedVertices', this.selectedVertices);
    // console.log('deleteVertex this.selectedVerticesMap', [...this.selectedVerticesMap]);
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