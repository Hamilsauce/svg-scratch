const footerMenu = document.querySelector('.footer-menu');
const toggle = document.querySelector('.toggle-button');
const svg = document.querySelector('svg');

const createLine = event => {
	// const line = document.createElementNS()
	var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
svg.style.backgroundColor = 'red'
	
	const touch = event.touches[0]
	
	
	line.x1 = touch.clientX;
	line.setAttributeNS('x1', touch.clientX)
	line.setAttributeNS('y1', touch.clientY)
	line.setAttributeNS('x2', touch.clientX + 100)
	line.setAttributeNS('y2', touch.clientY + 100)
	line.y1 = touch.clientY;
	line.x2 = touch.clientX + 100;
	line.y2 = touch.clientY + 100;
	line.strokeWidth = '1px';
	line.stroke = '#000';
svg.appendChild(line)
	console.log(touch);
	console.log(line);
}

document.addEventListener('touchstart', createLine)



let showFooterMenu = false;

toggle.addEventListener('click', e => {
 showFooterMenu =	!showFooterMenu
	
	if (showFooterMenu) {
		footerMenu.classList.remove('hide')
	} else {
		footerMenu.classList.add('hide')
	}
})

