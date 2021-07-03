const footerMenu1 = document.querySelector('.menu1');
const footerMenu2 = document.querySelector('.menu2');
const menus = document.querySelectorAll('.footer-menu')
const toggle1 = document.querySelector('.toggle1');
const toggle2 = document.querySelector('.toggle2');
const toggles = document.querySelectorAll('.toggle-button')
const svg = document.querySelector('svg');
// const toggle = document.querySelector('.toggle-button');

const displayTypes = {
	hide: 'hide',
	show: 'show'
}


menus.forEach((_, i) => {
	_.dataset.displayState = displayTypes.hide;
	_.classList.add(displayTypes.hide)
	_.dataset.id = i
})

toggles.forEach((btn, i) => {
	btn.dataset.id = i;
	btn.addEventListener('click', ({ target }) => {
		const { hide, show } = displayTypes
		const menu = [...menus].find(_ => _.dataset.id === target.dataset.id)
		const hideState = menu.dataset.displayState

		if (hideState === hide) {
			menu.classList.remove(hide)
			menu.dataset.id === '0' ? menus[1].classList.add(hide) : menus[0].classList.add(hide)
			menu.dataset.displayState = show
		} else {
			menu.classList.add(hide)
			menu.dataset.id === '0' ? menus[1].classList.remove(hide) : menus[0].classList.remove(hide)
			menu.dataset.displayState = hide
		}
		btn.classList.remove('inactive-button')
		btn.dataset.id === '0' ? toggles[1].classList.add('inactive-button') : toggles[0].classList.add('inactive-button')
		
// console.log(men);
		// menu.dataset.hide = !hideState
		// console.log(hideState);
		// const	hideState = Boolean(menu.dataset.hide) === true ? Boolean(menu.dataset.hide) :
		// const hideState = !Boolean(menu.dataset.hide) = !Boolean(menu.dataset.hide)
	})
} )




// const createLine = event => {
// 	// const line = document.createElementNS()
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