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

const startDrag = (e) => {
	const topBarCheck = e.path.some(el => el.id === 'menu-top-bar');
	if (topBarCheck) {
		const footer = e.path.find(el => el.id === 'footer-menu');
		const topBar = e.path.find(el => el.id === 'menu-top-bar');
		topBar.classList.add('pressed')

		document.addEventListener('touchmove', dragMenu, true)
		document.addEventListener('touchend', stopDrag, true)
	} else {
		return;
	}
};

const stopDrag = (e) => {
	e.path.find(el => el.id === 'menu-top-bar')
		.classList.remove('pressed')

	document.removeEventListener('touchmove', dragMenu, true)
}

const dragMenu = (e) => {
	const app = document.querySelector('.app');
	const topBar = e.path.find(el => el.id === 'menu-top-bar');
	const footer = e.path.find(el => el.id === 'footer-menu');
	const currentHeight = parseInt(getComputedStyle(footer).height)
	const appHeight = parseInt(getComputedStyle(app).height)
	const touch = e.changedTouches[0].pageY

	if ((touch > (appHeight - 130))) {} else if (touch <= 130) {
		footer.style.height = `${currentHeight}px`
	} else {
		footer.style.height = `${(appHeight - touch) + 20}px`
	}
	topBar.focused = false
}

document.addEventListener('touchstart', startDrag)