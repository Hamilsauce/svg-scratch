import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js'
const { DOM } = ham

// EVENT AGGREGATOR
export default class {
  constructor(els) {
    this.els = els

    this.els.drawRectToggle.addEventListener('change', e => {
      this.dispatch({ source: e.target, type: 'draw-mode', data: e.target.checked ? 'rect' : 'line' })
    });

    this.els.selectModeToggle.addEventListener('change', e => {
      this.dispatch({ source: e.target, type: 'graph-mode', data: e.target.checked ? 'select' : 'draw'  })
    });

    this.els.shapeColorPicker.addEventListener('input', e => {
      this.dispatch({ source: e.target, type: 'color-selection', data: e.target.value })
    });

    this.els.deleteButton.addEventListener('click', e => {
      this.dispatch({ source: e.target, type: 'delete', data: null })
    });
    
    this.els.undoButton.addEventListener('click', e => {
      this.dispatch({ source: e.target, type: 'undo', data: null })
    });
    
    this.els.redoButton.addEventListener('click', e => {
      this.dispatch({ source: e.target, type: 'redo', data: null })
    });
    
    this.els.addEdgeButton.addEventListener('click', e => {
      this.dispatch({ source: e.target, type: 'graph-mode', data: 'edge' })
    });
    
    this.els.addEdgeConfirmButton.addEventListener('click', e => {
      this.dispatch({ source: e.target, type: 'add-edge-confirm', data: null })
    });
  }

  add(eventType = 'click', func) {}

  dispatch({ source, type, data }) {
    source.dispatchEvent(new CustomEvent(
      'option-change', {
        bubbles: true,
        detail: {
          type: type,
          data: data,
        }
      }))
  }
}
