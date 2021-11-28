import Node from './Node.js';

const _SVG_NS = 'http://www.w3.org/2000/svg';

// RECT
export default class extends Node {
  constructor(pos, color, graph) {
    super();
    this.graph = graph;
    this.el = document.createElementNS(_SVG_NS, 'rect');
    this.el.classList.add('rect');
    this.el.setAttributeNS(null, 'stroke-width', '2');
    this.el.setAttributeNS(null, 'stroke', color);
    this.el.setAttributeNS(null, 'fill', color);

    // this.el.setAttributeNS(null, 'stroke-width', '2');
    // this.el.setAttributeNS(null, 'stroke-fill', 'red');
    // this.el.setAttribute(null, 'fill', color);
    this.setCoords(pos);
    this.setSize(pos);
    this.el.addEventListener('click', this.handleClick.bind(this));
  }

  get centroid() {
    // console.log('[this.width,this.height]', [this.width, this.height])
    // console.log('[this.x,this.y]', [this.x, this.y])
    return {
      x: this.x + (this.width / 2),
      y: this.y + (this.height / 2),
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
    // this.el.setAttribute('width', width || 0);
    // this.el.setAttribute('height', height || 0);
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
  //     x: this.el.getAttribute('x'),
  //     y: this.el.getAttribute('y'),
  //     width: this.el.getAttribute('width'),
  //     height: this.el.getAttribute('height'),
  //   }
  // }

  setRotate(angle) {
    let newPos = pos = this.getPosition();
    newPos.x2 = pos - radius * Math.cos(angle);
    newPos.y2 = pos - radius * Math.sin(angle);
    this.setPosition(newPos);
  }

  getHtmlEl() {
    return this.el;
  }

  get x() { return this.el.getAttribute('x') }
  set x(newValue) { this.el.setAttribute('x', newValue) }
  get y() { return this.el.getAttribute('y') }
  set y(newValue) { this.el.setAttribute('y', newValue) }
  get width() { return this.el.getAttribute('width') }
  set width(newValue) { this.el.setAttribute('width', newValue) }
  get height() { return this.el.getAttribute('height') }
  set height(newValue) { this.el.setAttribute('height', newValue) }

}