const footerMenu = document.querySelector('.footer-menu');
const toggle = document.querySelector('.toggle-button');
const svg = document.querySelector('svg');
const app = document.querySelector('.app');

const startDrag = (e) => {
	const topBarCheck = e.path.some(el => el.id === 'menu-top-bar');

	if (topBarCheck) {
		const footer = e.path.find(el => el.id === 'footer-menu');
		const topBar = e.path.find(el => el.id === 'menu-top-bar');
		topBar.classList.add('pressed')

		app.addEventListener('touchmove', dragMenu, true)
		app.addEventListener('touchend', stopDrag, true)
	} else return;
};

const stopDrag = (e) => {
	e.path.find(el => el.id === 'menu-top-bar')
		.classList.remove('pressed')

	app.removeEventListener('touchmove', dragMenu, true)
	app.removeEventListener('touchend', stopDrag, true)
}

const dragMenu = (e) => {
	const topBar = e.path.find(el => el.id === 'menu-top-bar');
	const footer = e.path.find(el => el.id === 'footer-menu');
	const currentHeight = parseInt(getComputedStyle(footer).height)
	const maxHeight = 450;
	const appHeight = parseInt(getComputedStyle(app).height)
	const touch = e.changedTouches[0].pageY

	if ((touch > (appHeight - 144))) {
		return;
	} else if (touch <= (appHeight - maxHeight)) {
		footer.style.height = `${currentHeight}px`;
	} else {
		footer.style.height = `${(appHeight - touch)}px`;
	}
}

app.addEventListener('touchstart', startDrag);


const doubleClickMenuBar = (e) => {
	const topBar = e.path.find(el => el.id === 'menu-top-bar');
	const footer = e.path.find(el => el.id === 'footer-menu');

	if (footer.dataset.expanded === 'true') {
		footer.style.height = `${145}px`;
		footer.dataset.expanded = 'false';
	} else {
		footer.style.height = `${425}px`;
		footer.dataset.expanded = 'true';
	}
}

document.querySelector('#menu-top-bar')
	.addEventListener('dblclick', doubleClickMenuBar);