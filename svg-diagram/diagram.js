// import Line from './Line.js';
// import Graph from './components/Graph.js';
import App from './components/App.js';
console.log({App});
import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js'

const { DOM } = ham

DOM.qs('#draw-rect-toggle')
  .addEventListener('change', e => {
    const evt = new CustomEvent(
      'option-change', {
        bubbles: true,
        detail: {
          type: 'draw-mode',
          data: e.target.checked ? 'rect' : 'line'
        }
      });
      console.log({evt});
    e.target.dispatchEvent(evt);
  })

 DOM.qs('#draw-rect-toggle')
  .addEventListener('change', e => {
    const evt = new CustomEvent('option-change', { bubbles: true, detail: { drawRect: e.target.checked } })
    e.target.dispatchEvent(evt);
  })

DOM.qs('#select-mode-toggle')
  .addEventListener('change', e => {
    const evt = new CustomEvent('select-mode-change', { bubbles: true, detail: { selectMode: e.target.checked } })
    e.target.dispatchEvent(evt);
    console.log(evt);
  });


DOM.qs('#shape-color-picker')
  .addEventListener('input', e => {
    const evt = new CustomEvent('shape-color-change', { bubbles: true, detail: { color: e.target.value } })
    e.target.dispatchEvent(evt);
    console.log(evt);
  });

DOM.qs('#undo-button')
  .addEventListener('click', e => {
    const evt = new CustomEvent('undo-button-click', { bubbles: true, detail: { color: e.target.value } })
    e.target.dispatchEvent(evt);
    console.log(evt);
  })

DOM.qs('.app')
  .addEventListener('draw-mode-change', e => {
    console.log('draw-mode-change');
  })


const handleColorChange = (e) => {
  window.graph.shapeColor = e.detail.color;
}


DOM.qs('.app')
  .addEventListener('shape-color-change', e => {
    window.graph.shapeColor = e.detail.color;
  })

DOM.qs('.app')
  .addEventListener('select-mode-change', e => {
    window.graph.selectMode = e.detail.selectMode;
  })


window.onload = () => {
  // window.graph = new Graph(document.getElementById('graph'));
  window.app = new App(document.getElementById('graph'));

  window.addEventListener('draw-mode-change', e => {
    const mode = e.detail.drawRect
    if (mode) {
      window.graph.drawMode = 'rect'
    } else {
      window.graph.drawMode = 'line'
    }
  });
};


// translateLine()


// startAnimation()

// {
// 	startAnimation
// }