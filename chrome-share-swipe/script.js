const footerMenu = document.querySelector('.footer-menu');
const toggle = document.querySelector('.toggle-button');
const svg = document.querySelector('svg');

// const createLine = event => {
// 	var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
// 	svg.style.backgroundColor = 'red'
// 	const touch = event.touches[0]

// 	line.x1 = touch.clientX;
// 	line.setAttributeNS('x1', touch.clientX)
// 	line.setAttributeNS('y1', touch.clientY)
// 	line.setAttributeNS('x2', touch.clientX + 100)
// 	line.setAttributeNS('y2', touch.clientY + 100)
// 	line.y1 = touch.clientY;
// 	line.x2 = touch.clientX + 100;
// 	line.y2 = touch.clientY + 100;
// 	line.strokeWidth = '1px';
// 	line.stroke = '#000';
// 	svg.appendChild(line)
// 	console.log(touch);
// 	console.log(line);
// }

// document.addEventListener('touchstart', createLine)



let showFooterMenu = false;

// toggle.addEventListener('click', e => {
// 	showFooterMenu = !showFooterMenu

// 	if (showFooterMenu) {
// 		footerMenu.classList.remove('hide')
// 	} else {
// 		footerMenu.classList.add('hide')
// 	}
// });



const startDrag = (e) => {
	const topBarCheck = e.path.some(el => el.id === 'menu-top-bar');
	if (topBarCheck) {
		// const targ = e.target;
		const topBar = e.path.find(el => el.id === 'menu-top-bar');
		const footer = e.path.find(el => el.id === 'footer-menu');
		console.log(footer);
		// const currentHeight = parseInt(getComputedStyle(footer).height)
		topBar.addEventListener('touchmove', dragMenu, true)
		topBar.addEventListener('touchend', stopDrag, true)
	} else {
		console.log(e.path);
		console.log('targ not bar');
		return;
	}
};

const stopDrag = (e) => {
	console.log('stopDrag');
	e.path
		.find(el => el.id === 'menu-top-bar')
		.removeEventListener('touchmove', dragMenu, true)

	// e.target.removeEventListener('touchmove', dragMenu)
}


const dragMenu = (e) => {
	console.log(e);
	// if (e.target.id === 'menu-top-bar') {
	const topBar = e.path.find(el => el.id === 'menu-top-bar');
	const footer = e.path.find(el => el.id === 'footer-menu');
	const currentHeight = parseInt(getComputedStyle(footer).height)
	
	const touch = e.touches[0].clientY
	const finTouch = e.changedTouches[0].clientY
	console.log(startTouch, finTouch);
	console.log('fin t', e.changedTouches);
	if (touch <  (currentHeight - 5) ||touch >  (currentHeight + 5)) {
		console.log('scrollin');
	} else if (startY > (finishingTouch + swipeMin)) {}

	const dragPosition = Math.floor(e.targetTouches[0].clientY);
	footer.style.height = `${dragPosition}px`
	console.log('curr height', Math.floor(currentHeight));
	console.log('targ touches', Math.floor(e.targetTouches[0].clientY));
	console.log('touches', Math.floor(e.touches[0].clientY));
	console.log(getComputedStyle(footer).height);
	// } else {
	// re/turn;
	// }
}



document.querySelector('#menu-top-bar').addEventListener('touchstart', startDrag)