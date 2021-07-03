let timerFunction = null;
let rowHeight = 20;

const startAnimation = () => {
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
	let circle = document.getElementById("circle1");
	let x = circle.getAttribute("cx");
	let newX = 4 + parseInt(x);
	if (rowHeight > 100) {
		rowHeight = 20
	}

	if (newX > 360) {
		newX = 20;
		rowHeight += 20;
	}
	circle.setAttribute("cy", rowHeight);
	circle.setAttribute("cx", newX);
}



let clicks = 0;
let radius = 2;

// document.addEventListener('click', function (e) {
// 	if (!e.target.closest('#svg')) return;
// 	if (e.target.id === 'svg' || e.target.classList.contains('circle')) {
// 		if (clicks <= 10) {
// 			++clicks
// 			radius += clicks;
// 		} else {
// 			clicks = 0;
// 			radius = 2;
// 		}
// 	}
// }, false);

function paintWithMouse(e) {

	const targ = e.target
	if (!targ.closest('#svg')) return;
	const eraseMode = e.ctrlKey;
	console.log(e.ctrlKey);

	// console.log('e target mousemove',e.target);

	if ((targ.id === 'svg' || targ.classList.contains('circle')) && !eraseMode) {
		if (targ.children.length > 250) {
			const firstCircleChild = [...targ.children].find(child => child.classList.contains('circle'));
			targ.removeChild(firstCircleChild);
			// console.log('removed child circle');
		}
		let newStroke = document.createElementNS("http://www.w3.org/2000/svg", "circle");
		newStroke.setAttribute("r", radius);
		newStroke.setAttribute("cx", e.x);
		newStroke.setAttribute("cy", e.y);
		newStroke.setAttribute("fill", "#000");
		newStroke.classList.add('circle', `circle${targ.children.length + 1}`)
		targ.appendChild(newStroke)
	} else if (targ.classList.contains('circle') && eraseMode) {
		svgEl = targ.parentElement;
		console.log('erase', targ, svgEl);
		svg.removeChild(targ)
	}
}



document.addEventListener('mousedown', function (e) {
	const targ = e.target
	if (!targ.closest('#svg') && !targ.classList.contains('circle')) return;
	paintWithMouse(e)
	if (targ.id === 'svg' || targ.classList.contains('circle')) {
		if (clicks <= 10) {
			++clicks
			radius += clicks;
		} else {
			clicks = 0;
			radius = 2;
		}
	}

	document.addEventListener('mousemove', paintWithMouse, true);

	document.addEventListener('mouseup', function (e) {
		document.removeEventListener("mousemove", paintWithMouse, true);
	});
})



// document.addEventListener('click', function (e) {
// 	const targ = e.target
// 	console.log(targ);
// 	if (!targ.closest('#svg') || targ.classList.contains('circle')) return;

// 	if (targ.id === 'svg' || targ.classList.contains('circle')) {
// 		if (clicks <= 10) {
// 			++clicks
// 			radius += clicks;
// 		} else {
// 			clicks = 0;
// 			radius = 2;
// 		}

// 	}
// paintWithMouse(e)
// 	// document.addEventListener('mousemove', paintWithMouse, true);

// 	// document.addEventListener('mouseup', function (e) {
// 	// 	document.removeEventListener("mousemove", paintWithMouse, true);
// 	});
// })
