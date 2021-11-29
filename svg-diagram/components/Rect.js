import Node from './Node.js';

const _SVG_NS = 'http://www.w3.org/2000/svg';

// RECT
export default class extends Node {
  constructor(pos, color, graph) {
    super(
      document.createElementNS(_SVG_NS, 'rect')
    );
    this.element = this.value
    this.group = document.createElementNS(_SVG_NS, 'g')
    this.text = document.createElementNS(_SVG_NS, 'text')
    this.graph = graph;
    this.init(pos, color)

    this.edges = new Map();
    this.element.addEventListener('click', this.handleClick.bind(this));
  }

  init(pos, color) {
    this.element.classList.add('rect');

    // const rect = document.createElementNS(_SVG_NS, 'rect')
    // const g = document.createElementNS(_SVG_NS, 'g')
    this.group.classList.add('node');

    // rect.classList.add('rect');
    this.element.setAttributeNS(null, 'stroke-width', '2');
    this.element.setAttributeNS(null, 'stroke', color);
    this.element.setAttributeNS(null, 'fill', color);
    this.setCoords(pos);
    this.setSize(pos);

    this.text.textContent = 'texter!'
    this.text.style.fill = 'pink'

    this.group.appendChild(this.element);
    this.group.appendChild(this.text);
    // this.group = g;
  }

  handleClick(e) {
    if (this.graph.selectMode) {
      const evt = new CustomEvent('shapeSelected', { bubbles: true, detail: { event: e } })
      e.target.dispatchEvent(evt);
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
    this.group.setAttribute('x', x)
    this.group.setAttribute('y', y)


  }

  setSize({ width, height }) {
    this.width = width
    this.height = height
    this.group.width = width
    this.group.height = height
    this.text.setAttribute('x', this.centroid.x)// - (parseInt(this.text.getAttribute('width')) / 2))
    this.text.setAttribute('y', this.centroid.y)// - (parseInt(this.text.getAttribute('height')) / 2))
    // this.text.setAttribute('y', this.centroid.y)



  }

  get position() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    }
  }

  set position({ x, y, width, height }) {
    this._position = {
      x: x ? x : this.position.x,
      y: y ? y : this.position.y,
      width: width ? width : this.position.width,
      height: height ? height : this.position.height,
    }
  }

  get x() { return this.element.getAttribute('x') }
  set x(newValue) { this.element.setAttribute('x', newValue) }
  get y() { return this.element.getAttribute('y') }
  set y(newValue) { this.element.setAttribute('y', newValue) }
  get width() { return this.element.getAttribute('width') }
  set width(newValue) { this.element.setAttribute('width', newValue) }
  get height() { return this.element.getAttribute('height') }
  set height(newValue) { this.element.setAttribute('height', newValue) }

  get size() { return { width: parseInt(this.width), height: parseInt(this.height), } }
  get coords() { return { x: parseInt(this.x), y: parseInt(this.y), } }
  get centroid() { return { x: parseInt(this.x) + (parseInt(this.width) / 2), y: parseInt(this.y) + (parseInt(this.height) / 2), } }
}