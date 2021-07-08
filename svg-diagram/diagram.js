import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js'

ham.qs('#draw-rect-toggle')
	.addEventListener('change', e => {
		const evt = new CustomEvent('drawchange', { bubbles: true, detail: { drawRect: e.target.checked } })
		e.target.dispatchEvent(evt);
	})

ham.qs('#select-mode-toggle')
	.addEventListener('change', e => {
		const evt = new CustomEvent('selectModeChange', { bubbles: true, detail: { selectMode: e.target.checked } })
		e.target.dispatchEvent(evt);
		console.log(evt);
	})

ham.qs('#shape-color-picker')
	.addEventListener('input', e => {
		const evt = new CustomEvent('shapeColorChange', { bubbles: true, detail: { color: e.target.value } })
		e.target.dispatchEvent(evt);
		console.log(evt);
	})

ham.qs('.app')
	.addEventListener('drawchange', e => {
		console.log('drawchange');
	})


const handleColorChange = (e) => {
	window.graph.shapeColor = e.detail.color;
}


ham.qs('.app')
	.addEventListener('shapeColorChange', e => {
		window.graph.shapeColor = e.detail.color;
	})
	
ham.qs('.app')
	.addEventListener('selectModeChange', e => {
		window.graph.selectMode = e.detail.selectMode;
	})





// translateLine()


// startAnimation()

// {
// 	startAnimation
// }