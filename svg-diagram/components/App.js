import EventBus from '../EventBus.js';
import Graph from './Graph.js';
import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js'
const { DOM } = ham

// APP
export default class {
  constructor(graphEl) {
    this.root = document.querySelector('#app')
    this.graph = new Graph(graphEl);
   
    this.options = [
      ['drawRectToggle', DOM.qs('#draw-rect-toggle')],
      ['selectModeToggle', DOM.qs('#select-mode-toggle')],
      ['shapeColorPicker', DOM.qs('#shape-color-picker')],
      ['undoButton', DOM.qs('#undo-button')],
    ];

    this.els = {
      'drawRectToggle': DOM.qs('#draw-rect-toggle'),
      'selectModeToggle': DOM.qs('#select-mode-toggle'),
      'shapeColorPicker': DOM.qs('#shape-color-picker'),
      'undoButton': DOM.qs('#undo-button'),
    }

    this.eventBus = new EventBus(this.els);
    this.root.addEventListener('option-change', this.handleOptionChange.bind(this))
    console.log(this);
  }
  
  handleOptionChange(e) {
    console.log(e);
    const { data, type } = e.detail
    if (type === 'draw-mode') {
      this.graph.drawMode = data;
    } else if (type === 'select-mode') {
      this.graph.selectMode = data;
    } else if (type === 'color-selection') {
      this.graph.shapeColor = data;
    } else if (type === 'undo') {
      this.graph.undo()
    }
  }

}