class Line {
	constructor(pos) {
		this.el = document.createElementNS('http://www.w3.org/2000/svg', 'line');
		this.el.classList.add('line');
		this.el.setAttribute('stroke', 'red');
		this.el.setAttribute('stroke-width', '5');
		this.setPosition(pos);
	}

	setPosition(pos) {
		this.el.setAttribute('x1', pos.x1);
		this.el.setAttribute('y1', pos.y1);
		this.el.setAttribute('x2', pos.x2);
		this.el.setAttribute('y2', pos.y2);
	}

	getPosition() {
		return {
			x1: this.el.getAttribute('x1'),
			y1: this.el.getAttribute('y1'),
			x2: this.el.getAttribute('x2'),
			y2: this.el.getAttribute('y1'),
		};
	}

	setRotate(angle) {
		let newPos = pos = this.getPosition();
		newPos.x2 = pos - radius * Math.cos(angle);
		newPos.y2 = pos - radius * Math.sin(angle);
		this.setPosition(newPos);
	}

	getHtmlEl() {
		return this.el;
	}
}

// Graph

class Graph {
	constructor(el) {
		this.el = el;
		this.elements = [];
		this.mode = 'line';
		this.setSize();
		this.el.onmousedown = this.mouseDown.bind(this);
		this.el.onmouseup = this.mouseUp.bind(this);
		this.el.onmouseout = this.mouseUp.bind(this);
		this.el.onmousemove = this.mouseMove.bind(this);
	}

	setMode(mode) {
		this.mode = mode;
	}

	mouseDown(event) {
		this.drawStart = true;
		let line = new Line({
			x1: event.pageX,
			y1: event.pageY,
			x2: event.pageX,
			y2: event.pageY
		});
		this.current = line;
		this.el.appendChild(line.getHtmlEl());
	}

	mouseUp(event) {
		this.drawStart = false;
		this.current = null;
	}

	mouseMove(event) {
		if (this.drawStart && this.current) {
			let pos = this.current.getPosition();
			pos.x2 = event.pageX;
			pos.y2 = event.pageY;
			this.current.setPosition(pos);
		}
	}

	setSize() {
		this.el.setAttribute('width', window.innerWidth);
		this.el.setAttribute('height', window.innerHeight);
	}
}


window.onload = () => {
	window.graph = new Graph(document.getElementById('graph'));
};