// import { arrowLine } from './svg-comp1.js';

// console.log('arrowLine');
// console.log(arrowLine);

// const app = document.querySelector('.app')
// app.appendChild(arrowLine)
// app.insertAdjacentElement("beforeend",arrowLine())
// console.log(app);
console.log('f');
let timerFunction = null;

export const startAnimation = () => {
	if (timerFunction == null) {
		timerFunction = setInterval(animate, 20);
	}
}

const stopAnimation = () => {
	if (timerFunction != null) {
		clearInterval(timerFunction);
		timerFunction = null;
	}
}

const animate = () => {
	console.log('ani');
	let circle = document.getElementById("line1");
	let x = circle.getAttribute("cx");
	let newX = 2 + parseInt(x);
	if (newX > 500) {
		newX = 20;
	}
	circle.setAttribute("cx", newX);
}

// const stopAnimation = () => {
// 	if (timerFunction != null) {
// 		clearInterval(timerFunction);
// 		timerFunction = null;
// 	}
// }

const translateLine = () => {
	const svg = document.querySelector('#line1')
	console.log(svg) ;
	let trans = 'rotate(300);'
	svg.setAttribute('transform', trans);
	  


}

translateLine()


// startAnimation()

{
	startAnimation
}