import Node from './Node.js';

const _SVG_NS = 'http://www.w3.org/2000/svg';

// RECT
export default class extends Node {
  constructor(pos, color, graph) {
    super(document.createElementNS(_SVG_NS, 'rect'));
    this.graph = graph;
    this.element = this.value
    this.element.classList.add('rect');
    this.element.setAttributeNS(null, 'stroke-width', '2');
    this.element.setAttributeNS(null, 'stroke', color);
    this.element.setAttributeNS(null, 'fill', color);

    // this.element.setAttributeNS(null, 'stroke-width', '2');
    // this.element.setAttributeNS(null, 'stroke-fill', 'red');
    // this.element.setAttribute(null, 'fill', color);
    this.setCoords(pos);
    this.setSize(pos);
    this.element.addEventListener('click', this.handleClick.bind(this));
  }

  get centroid() {
    return {
      x: parseInt(this.x) + (parseInt(this.width) / 2),
      y: parseInt(this.y) + (parseInt(this.height) / 2),
    }
  }


  handleClick(e) {
    if (this.graph.selectMode) {
      const evt = new CustomEvent('shapeSelected', { bubbles: true, detail: { event: e } })
      e.target.dispatchEvent(evt);
      console.log('shape click w select mide on', evt);
    }
    console.log('this.centroid', this.centroid)
  }

  setCoords({ x, y }) {
    this.x = x
    this.y = y
  }

  setSize({width, height}) {
    console.log('height', height)
    console.log('width, width', width)
    this.width = width
    this.height =  height
    // this.element.setAttribute('width', width || 0);
    // this.element.setAttribute('height', height || 0);
  }

  // TODO Replace getPosition with get position
  get position() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    }
  }
  
  set position({x, y, width, height}) {
    this._position =  {
      x: x ? x : this.position.x,
      y: y ? y : this.position.y,
      width: width ? width : this.position.width,
      height: height ? height : this.position.height,
    }
  }
  getPosition() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    }
  }
  // getPosition() {
  //   return {
  //     x: this.element.getAttribute('x'),
  //     y: this.element.getAttribute('y'),
  //     width: this.element.getAttribute('width'),
  //     height: this.element.getAttribute('height'),
  //   }
  // }

  setRotate(angle) {
    let newPos = pos = this.getPosition();
    newPos.x2 = pos - radius * Math.cos(angle);
    newPos.y2 = pos - radius * Math.sin(angle);
    this.setPosition(newPos);
  }

  getHtmlEl() {
    return this.element;
  }

  get x() { return this.element.getAttribute('x') }
  set x(newValue) { this.element.setAttribute('x', newValue) }
  get y() { return this.element.getAttribute('y') }
  set y(newValue) { this.element.setAttribute('y', newValue) }
  get width() { return this.element.getAttribute('width') }
  set width(newValue) { this.element.setAttribute('width', newValue) }
  get height() { return this.element.getAttribute('height') }
  set height(newValue) { this.element.setAttribute('height', newValue) }

}