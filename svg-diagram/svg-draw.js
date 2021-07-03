let arrowMode = false;
document.querySelector('.arrow-checkbox')
	.addEventListener('change', e => {
		arrowMode = e.target.checked;
		let targ = e.target;
		console.log(arrowMode);
	})




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

// !!! TOUCH PAINTING


function paintWithFinger(e) {
	const targ = e.target
	if (!targ.closest('#svg')) return;
	const eraseMode = e.ctrlKey;
	const touches = e.touches

	if ((targ.id === 'svg' || targ.classList.contains('circle')) && !eraseMode) {
		if (targ.children.length > 250) {
			const firstCircleChild = [...targ.children].find(child => child.classList.contains('circle'));
			targ.removeChild(firstCircleChild);
		}

		let newStroke = document.createElementNS("http://www.w3.org/2000/svg", "circle");
		let xPos = Math.round(parseInt(e.touches[0].clientX));
		let yPos = e.touches[0].clientY;

		newStroke.setAttribute("r", radius);
		newStroke.setAttribute("cx", xPos);
		newStroke.setAttribute("cy", yPos);
		newStroke.setAttribute("fill", "#000");
		newStroke.classList.add('circle', `circle${targ.children.length + 1}`)
		targ.appendChild(newStroke)

	} else if (targ.classList.contains('circle') && eraseMode) {
		svgEl = targ.parentElement;
		svg.removeChild(targ)
	}
}

const startTouch = (e) => {
	const { target, touches } = e
	if (!target.closest('#svg') && !target.classList.contains('circle')) return;
	if (touches && touches.length === 1 && (target.id === 'svg' || target.classList.contains('circle'))) {
		paintWithMouse(e)
		if (clicks <= 5) {
			++clicks
			radius += clicks;
		} else {
			clicks = 0;
			radius = 2;
		}
		document.addEventListener('touchmove', paintWithFinger, true);
		document.addEventListener('touchend', function(e) {
			document.removeEventListener("touchmove", paintWithMouse, true);
		});
	}
}
document.addEventListener('touchstart', startTouch)


// !!! MOUSE PAINTING


function paintWithMouse(e) {
	const targ = e.target
	if (!targ.closest('#svg')) return;
	const eraseMode = e.ctrlKey;

	if ((targ.id === 'svg' || targ.classList.contains('circle')) && !eraseMode) {
		if (targ.children.length > 250) {
			const firstCircleChild = [...targ.children].find(child => child.classList.contains('circle'));
			targ.removeChild(firstCircleChild);
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
		svg.removeChild(targ)
	}
}

document.addEventListener('mousedown', function(e) {
	e.stopPropagation()
	const targ = e.target
	if (!targ.closest('#svg') && !targ.classList.contains('circle')) return;
	paintWithMouse(e)
	if (targ.id === 'svg' || targ.classList.contains('circle')) {
		if (clicks <= 5) {
			++clicks
			radius += clicks;
		} else {
			clicks = 0;
			radius = 2;
		}
	}

	document.addEventListener('mousemove', paintWithMouse, true);

	document.addEventListener('mouseup', function(e) {
		document.removeEventListener("mousemove", paintWithMouse, true);
	});
})