import Node from '../data-models/Node.model.js';
import TextNode from './TextNode.js';
import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
const { date, array, utils, text, help } = ham;
const { from, race, interval, of , fromEvent, merge, empty, Subject } = rxjs;
const { bufferTime, bufferCount, first, repeat, throttleTime, debounceTime, buffer, switchMap, concatMap, mergeMap, take, filter, scan, takeWhile, startWith, tap, map, mapTo } = rxjs.operators;

const _SVG_NS = 'http://www.w3.org/2000/svg';

const vertexType = {
  rect: 'rect',
  circle: 'circle',
}

// VERTEX
export default class extends Node {
  constructor(pos, vertexSubjects, zIndex, color, graph, fill = '#ffffff', stroke = '#000000', type = 'rect') {
    super(document.createElementNS(_SVG_NS, 'g'));
    this.element = this.value
    this.graph = graph;
    this.shape = document.createElementNS(_SVG_NS, type)
    this.textNode = new TextNode(document.createElementNS('http://www.w3.org/2000/svg', 'text'), this);
    this.edges = new Map();
    this.zIndex = zIndex;
    this.isActive;
    this._isSelected = false;
    this.prevent = false;
    this.clickDelayTimer;

    this.init(pos, color);

    this.vertexSelectSubject$ = vertexSubjects.click$
      .pipe(
        filter((e) => this.textNode.editMode === false),
        map(({ detail }) => {
          if (this.isSelected === false && this.isEventSource(detail.target)) {
            this.isSelected = true;
          } else {
            this.isSelected = false;
          }
          return event;
        }),
        map(({ detail }) => {
          if (this.isSelected === true) {
          } else {
          }
          return event;
        }),
      ).subscribe();

    // this.vertexMove$ = vertexSubjects.move$
      // .pipe(
      //   filter(({ detail }, i) => this.isEventSource(detail.currentTarget)),
      //   map(({ detail }) => {
      //     // const evt = new CustomEvent('vertex-move', { bubbles: true, detail: { target: this.element } });
      //     // this.element.dispatchEvent(evt);
      //     // if (this.textNode.editMode === false) {
      //     // this.isSelected = !this.isSelected;
      //     // }
      //     return event;
      //   }),
      // )

    // this.vertexInactive$ = vertexSubjects.inactive$
      // .pipe(
      //   filter(({ detail }, i) => this.isEventSource(detail.target)),
      //   map(({ detail }) => {
      //     if (this.textNode.editMode === false) this.isSelected = !this.isSelected;
      //     return event;
      //   }),
      // )

    this.click$ = fromEvent(this.element, 'click')
      .pipe(
        filter(({ currentTarget }) => this.isEventSource(currentTarget)),
        map(evt => ({ type: evt.type, target: evt.currentTarget, event: evt }))
      );

    this.dblclicks$ = fromEvent(this.element, 'dblclick')
      .pipe(
        filter(({ currentTarget }, i) => this.isEventSource(currentTarget)),
        map(evt => ({ type: evt.type, target: evt.currentTarget, event: evt }))
      );

    this.clickSubscription = merge(this.click$, this.dblclicks$).pipe(
      debounceTime(300),
      map(({ type, target, event }) => {
        if (type === 'click') {
          const evt = new CustomEvent('vertex-click', { bubbles: true, detail: { target: this.element } });
          this.element.dispatchEvent(evt);
        } else if (type === 'dblclick') this.textNode.editMode = !this.textNode.editMode;
        return event;
      }),
    ).subscribe();

    this.touchstart$ = fromEvent(this.element, 'touchstart')
      .pipe(
        filter(({ currentTarget }) => this.isSelected === true && this.isEventSource(currentTarget)),
        tap(() => this.isActive = true),
        map(evt => evt),
      );

    this.touchmove$ = fromEvent(this.element, 'touchmove')
      .pipe(
        filter(({ currentTarget }) => this.isActive === true && this.isEventSource(currentTarget)),
        map(e => {
          if (!this.isSelected) this.isActive = false;
          return this.isActive ? e : null
        }),
        map(e => {
          if (!this.isActive || e == null) return;
          this.setCoords({
            x: parseInt(e.touches[0].pageX) - (this.width / 2),
            y: parseInt(e.touches[0].pageY) - (this.height),
          })
          return e;
        }),
      );

    this.touchend$ = fromEvent(this.element, 'touchend')
      .pipe(
        filter(({ currentTarget }) => this.isActive === true && this.isEventSource(currentTarget)),
        map(e => {
          this.isActive = false;
          return { x: this.x, y: this.y }
        }),
      );

    this.touchSubscription = this.touchstart$
      .pipe(
        switchMap(() => this.touchmove$.pipe(switchMap(() => this.touchend$), )),
      ).subscribe()

    // this.blurSubscription =
    // merge(fromEvent(this.element, 'blur'), fromEvent(this.shape, 'blur'), )
    // .pipe(
    //   filter(x => this.isSelected === true),
    //   map(evt => this.isSelected = false),
    // ).subscribe()
  }

  isEventSource(target) {
    if (!target) return;
    return [this.element].includes(target);
  }


  init(pos, color) {
    this.classList('add', 'vertex', )
    this.element.dataset.nodeType = 'rect'
    this.element.dataset.nodeId = 'node1'

    this.shape.classList.add('rect');
    this.shape.setAttributeNS(null, 'stroke-width', '2');
    this.shape.setAttributeNS(null, 'stroke', color);
    this.shape.setAttributeNS(null, 'fill', color);
    this.shape.setAttributeNS(null, 'fill', color);

    this.textNode.element.classList.add('vertex-text')
    this.textNode.element.textContent = ' '
    this.textNode.element.setAttributeNS(null, 'text-anchor', 'middle');

    // this.blurHandler = this.handleBlur.bind(this)
    // this.selectedHandler = this.handleSelected.bind(this)
    // this.touchStartHandler = this.handleTouchStart.bind(this)
    // this.touchMoveHandler = this.handleTouchMove.bind(this)
    // this.touchEndHandler = this.handleTouchEnd.bind(this)

    this.element.appendChild(this.shape);
    this.element.appendChild(this.textNode.element);

    this.setCoords(pos);
    this.setSize(pos);
  }

  classList(keyword, ...classes) {
    if (classes.length === 0 || !['add', 'remove'].includes(keyword)) return;
    this.element.classList[keyword](...classes)
    // this.shape.classList[keyword](...classes)
    if (!this.element.classList.contains('selected-vertex')) {
      this.shape.classList.remove(...classes)
    }
  }

  setRotate(angle) {
    let newPos = pos = this.position;
    newPos.x2 = pos - radius * Math.cos(angle);
    newPos.y2 = pos - radius * Math.sin(angle);
    this.setPosition(newPos);
  }

  setCoords({ x, y }) {
    this.x = x
    this.y = y
    this.textNode.element.setAttribute('x', this.centroid.x - ((parseInt(this.textNode.element.getAttribute('width')) || 0) / 2))
    this.textNode.element.setAttribute('y', this.centroid.y + ((parseInt(this.textNode.element.getAttribute('height')) || 0) / 2));
  }

  setSize({ width, height }) {
    this.width = width
    this.height = height
  }

  getTextAttribute(attr) {}
  setTextAttribute(attr, value) {
    this.textNode.element.setAttribute('x', this.centroid.x - ((parseInt(this.textNode.element.getAttribute('width')) || 0) / 2))
    this.textNode.element.setAttribute('y', this.centroid.y + ((parseInt(this.textNode.element.getAttribute('height')) || 0) / 2));
  }

  updateTextPosition(alignment = 'center') {
    this.textNode.element.setAttribute('x', this.centroid.x)
    this.textNode.element.setAttribute('y', this.centroid.y)
  }

  get isSelected() {
    return this._isSelected
  }

  set isSelected(newValue) {
    this._isSelected = newValue
    this.classList(this.isSelected ? 'add' : 'remove', 'selected-vertex')
  }

  get centroid() {
    return {
      x: (this.x + this.width / 2) || 0,
      y: (this.y + this.height / 2) || 0,
    }
  }

  get size() { return { width: this.width, height: this.height, } }

  get coords() { return { x: this.x, y: this.y, } }

  get position() { return { x: this.x, y: this.y, width: this.width, height: this.height, } }
  set position({ x, y, width, height }) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  get x() { return parseInt(this.shape.getAttribute('x')) || 0 }
  set x(newValue) {
    this.shape.setAttribute('x', newValue)
    this.updateTextPosition();
  }

  get y() { return parseInt(this.shape.getAttribute('y')) || 0 }
  set y(newValue) {
    this.shape.setAttribute('y', newValue)
    this.updateTextPosition();
  }

  get width() { return parseInt(this.shape.getAttribute('width')) || 0 }
  set width(newValue) {
    this.shape.setAttribute('width', newValue)
    this.updateTextPosition();
  }

  get height() { return parseInt(this.shape.getAttribute('height')) || 0; } //return this.shape.getAttribute('height') }

  set height(newValue) {
    this.shape.setAttribute('height', newValue)
    this.updateTextPosition();
  }
}