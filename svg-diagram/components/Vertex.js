import Node from './Node.js';
import TextNode from './TextNode.js';

const _SVG_NS = 'http://www.w3.org/2000/svg';

const vertexType = {
  rect: 'rect',
  circle: 'circle',
}

// VERTEX
export default class extends Node {
  constructor(pos, zIndex,color, graph, fill = '#ffffff', stroke = '#000000', type = 'rect') {
    super(document.createElementNS(_SVG_NS, 'g'));

    this.element = this.value
    this.graph = graph;
    this.shape = document.createElementNS(_SVG_NS, type)
    this.textNode = new TextNode(document.createElementNS('http://www.w3.org/2000/svg', 'text'), this);
    this.edges = new Map();
    this._isSelected = false;
this.zIndex = zIndex;
    this.clickDelayTimer;
    this.init(pos, color)

    this.element.addEventListener('dblclick', this.handleDoubleClick.bind(this));
    this.element.addEventListener('click', this.handleClick.bind(this));
    this.element.addEventListener('touchstart', this.handleTouch.bind(this));
  }

  init(pos, color) {
    this.element.classList.add('node');
    this.element.dataset.nodeType = 'rect'
    this.element.dataset.nodeId = 'node1'

    this.shape.classList.add('rect');
    this.shape.setAttributeNS(null, 'stroke-width', '2');
    this.shape.setAttributeNS(null, 'stroke', color);
    this.shape.setAttributeNS(null, 'fill', color);
    this.shape.setAttributeNS(null, 'fill', color);

    this.textNode.element.textContent = 'texter!'
    this.textNode.element.setAttributeNS(null, 'text-anchor', 'middle');
    this.element.appendChild(this.shape);
    this.element.appendChild(this.textNode.element);
    this.setCoords(pos);
    this.setSize(pos);
  }

  handleTouch(e) {
    // if (this.graph.selectMode || this.graph.addEdgeMode) {
    console.log('in handleTouch');
    const evt = new CustomEvent('vertex-select', { bubbles: true, detail: { target: this.element } })
    this.element.dispatchEvent(evt);
    // }
    e.stopPropagation();
    // e.preventDefault();
  }

  handleClick(e) {

    e.stopPropagation();
    // e.preventDefault();
  }

  handleDoubleClick(e) {
    console.log('in handleDoubleClick');
    this.textNode.editMode = !this.textNode.editMode
    e.preventDefault();
    e.stopPropagation();
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

  get isSelected() { return this._isSelected}
  set isSelected(newValue) {
    this._isSelected = newValue
    if (this.isSelected === true) {
      this.element.classList.add('selected-vertex')
    } else {
      this.element.classList.remove('selected-vertex')
    }

    // this.shape.setAttribute('x', newValue)
    // this.updateTextPosition();
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