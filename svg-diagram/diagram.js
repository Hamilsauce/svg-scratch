import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js'

console.log(ham);
// ham.log('fuck')
// console.log('fuck');

const createLine = (e) => {
	const newLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
	newLine.setAttribute('x1', '0');
	newLine.setAttribute('y1', '0');
	newLine.setAttribute('x2', '200');
	newLine.setAttribute('y2', '200');
	newLine.setAttribute("stroke", "black")
	document.querySelector("#viewBox").appendChild(newLine);
	console.log('fuck3');
}
// createLine()
// document.querySelector("#viewBox").addEventListener('click', createLine)

// ham.log(ham.qs('#draw-rect-toggle'))
ham.qs('#draw-rect-toggle')
	.addEventListener('change', e => {
		console.log(e.target);
		const evt = new CustomEvent('drawchange', {bubbles: true, detail: {drawRect: e.target.checked}})
		console.log(evt);
	 e.target.dispatchEvent(evt);
	})

ham.qs('.app')
	.addEventListener('drawchange', e => {
		console.log(e);
		// const evt = new CustomEvent('drawModeChange', {detail: e.target.checked})
		// console.log(evt);
		// console.log( e.target.dispatchEvent(evt));
	})


// translateLine()


// startAnimation()

// {
// 	startAnimation
// }