import Node from '../data-models/Node.model.js';
import TextNode from './TextNode.js';
import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
const { date, array, utils, text, help } = ham;

const _SVG_NS = 'http://www.w3.org/2000/svg';

const vertexType = {
  rect: 'rect',
  circle: 'circle',
}

// VERTEX
export default class extends Node {
  constructor(pos, zIndex, color, graph, fill = '#ffffff', stroke = '#000000', type = 'rect') {
    super(document.createElementNS(_SVG_NS, 'g'));

    this.element = this.value
    this.graph = graph;
    this.shape = document.createElementNS(_SVG_NS, type)
    this.textNode = new TextNode(document.createElementNS('http://www.w3.org/2000/svg', 'text'), this);
    this.edges = new Map();
    this._isSelected = false;
    this.zIndex = zIndex;
    this.isActive;
    this.clickDelayTimer;
    this.prevent = false;

    this.init(pos, color);

    // this.element.addEventListener('click', this.clickHandler);
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

    this.textNode.element.classList.add('vertex-text')
    this.textNode.element.textContent = 'texter!'
    this.textNode.element.setAttributeNS(null, 'text-anchor', 'middle');

    this.doubleClickHandler = this.handleDoubleClick.bind(this)
    this.clickHandler = this.handleClick.bind(this)
    this.blurHandler = this.handleBlur.bind(this)
    this.selectedHandler = this.handleSelected.bind(this)
    this.touchStartHandler = this.handleTouchStart.bind(this)
    this.touchMoveHandler = this.handleTouchMove.bind(this)
    this.touchEndHandler = this.handleTouchEnd.bind(this)

    this.element.appendChild(this.shape);
    this.element.appendChild(this.textNode.element);

    this.element.addEventListener('node-selected', this.selectedHandler)
  
    this.element.addEventListener('click', this.clickHandler)
    this.element.addEventListener('dblclick', this.doubleClickHandler);
    // this.element.addEventListener('click', this.toggleSelect.bind(this));
    // ham.event.longPress(this.element, 700, this.toggleSelect.bind(this))
    // this.shape.addEventListener('touchstart', this.handleTouchStart.bind(this));

    this.setCoords(pos);
    this.setSize(pos);
  }

  classList(keyword, ...classes) {
    if (classes.length === 0 || !['add', 'remove'].includes(keyword)) return;
    this.element.classList[keyword](...classes)
    this.shape.classList[keyword](...classes)

  }

  handleSelected(e) {
    console.log('heard', e);
    // const evt = new CustomEvent('vertex-deselect', { bubbles: true, detail: { target: this.element } })
    // this.element.dispatchEvent(evt);

  }


  handleBlur(e) {
    const evt = new CustomEvent('vertex-deselect', { bubbles: true, detail: { target: this.element } })
    this.element.dispatchEvent(evt);

  }

  // toggleSelect(e)click{
  //   this.isSelected = !this.isSelected
  //   if (this.isSelected === true) {
  //     console.log('ckicj');
  //     const evt = new CustomEvent('vertex-select', { bubbles: true, detail: { target: this.element } })
  //     this.element.dispatchEvent(evt);
  //   } else {
  //     const evt = new CustomEvent('vertex-deselect', { bubbles: true, detail: { target: this.element } })
  //     this.element.dispatchEvent(evt);
  //   }
  //   e.stopPropagation()
  // }

  handleClick(e) {
    this.clickDelayTimer = setTimeout(() => {
      if (!this.prevent) {
        // if (this.isSelected !== true) {
        console.log('ckicj');
        const evt = new CustomEvent('vertex-click', { bubbles: true, detail: { target: this.element } })
        this.element.dispatchEvent(evt);
        // }  else {
        //   console.log('ckicj');
        //   const evt = new CustomEvent('vertex-click', { bubbles: true, detail: { target: this.element } })
        //   this.element.dispatchEvent(evt);
        // }

      }
      this.prevent = false;
    }, 500);

    e.stopPropagation()
  }

  handleDoubleClick(e) {
    clearTimeout(this.clickDelayTimer);
    this.prevent = true;
    console.log('in handleDoubleClick');
    this.textNode.editMode = !this.textNode.editMode
    // e.preventDefault();
    e.stopPropagation();
  }



  handleTouchStart(e) {
    if (this.isSelected == true) {
      console.log('in handleTouchStart');
      this.isActive = true;
      this.element.addEventListener('touchmove', this.touchMoveHandler);
      this.element.addEventListener('vertex-move', this.touchMoveHandler);
      this.element.addEventListener('touchend', this.touchEndHandler);

      // const evt = new CustomEvent('vertex-click', { bubbles: true, detail: { target: this.element } })
      // this.element.dispatchEvent(evt);
    } else {}
    // e.preventDefault();
    e.stopPropagation();
  }

  handleTouchMove(e) {
    console.log('in handleTouch move');
    if (this.isActive === true) {
      const evt = new CustomEvent('vertex-move', { bubbles: true, detail: { target: this.element, event: e } })
      this.element.dispatchEvent(evt);
    } else {}
    e.stopPropagation();
  }

  handleTouchEnd(e) {
    e.stopPropagation();
    // e.preventDefault();
    console.log('in handleTouchEnd');
    // if (this.isActive === true) {
    const evt = new CustomEvent('vertex-inactive', { bubbles: true, detail: { target: this.element } })
    this.element.dispatchEvent(evt);
    // } else {}
    this.isActive = false;
    this.element.addEventListener('vertex-move', this.touchMoveHandler);
    // this.element.removeEventListener('touchmove', this.touchMoveHandler);
    this.element.removeEventListener('touchend', this.touchEndHandler);
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

  get isSelected() { return this._isSelected }
  // set isSelected(newValue) {
  //   this._isSelected = newValue
  //   if (this.isSelected === true) {
  //     this.element.addEventListener('touchstart', this.handleTouchStart.bind(this));
  //     this.element.removeEventListener('click', this.handleClick.bind(this));
  //     this.element.classList.add('selected-vertex')
  //     console.log('tstart');
  //   } else {
  //     this.element.classList.remove('selected-vertex')
  //     this.element.removeEventListener('touchstart', this.handleTouchStart.bind(this));
  //     this.element.removeEventListener('touchend', this.handleTouchStart.bind(this));
  //     this.element.removeEventListener('touchstart', this.handleTouchStart.bind(this));
  //     this.element.addEventListener('click', this.handleClick.bind(this));

  //   }

  //   // this.shape.setAttribute('x', newValue)
  //   // this.updateTextPosition();
  // }

  set isSelected(newValue) {
    this._isSelected = newValue
    if (this.isSelected === true) {
      this.element.addEventListener('blur', this.blurHandler);
      this.element.addEventListener('touchstart', this.touchStartHandler);
      // this.element.removeEventListener('click', this.clickHandler);
      // this.element.addEventListener('click', this.clickHandler);
      this.classList('add', 'selected-vertex')
      // this.element.addEventListener('touchmove', this.handleTouchMove.bind(this));
      // this.element.addEventListener('touchend', this.handleTouchEnd.bind(this));

      //   console.log('tstart');
    } else {
      // this.element.classList.remove('selected-vertex');
      console.log('this after isselect change', this);
      this.classList('remove', 'selected-vertex')
      // this.element.addEventListener('click', this.clickHandler);
      this.element.removeEventListener('touchstart', this.touchStartHandler);
      this.element.removeEventListener('touchend', this.touchEndHandler);
      this.element.addEventListener('vertex-move', this.touchMoveHandler);
      // this.element.removeEventListener('touchmove', this.touchMoveHandler);
      this.element.removeEventListener('blur', this.blurHandler);
    }
    console.log('this isSelected', this);
    // this.shape.setAttribute('x', newValue)
    // this.updateTextPosition();
  }

  get centroid() {
    // console.log('(this.x + this.width / 2) || 0,', (this.x + this.width / 2) || 0)
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