class Line {
	constructor(pos) {
		this.el = document.createElementNS('http://www.w3.org/2000/svg', 'line');
		this.el.classList.add('line');
		this.el.setAttribute('stroke', 'red');
		this.el.setAttribute('stroke-width', '');
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
			y2: this.el.getAttribute('y2'),
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


class Rect {
	constructor(pos) {
		this.el = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
		this.el.classList.add('rect');
		this.el.setAttribute('stroke', 'red');
		this.el.setAttribute('stroke-width', '2');
		this.setCoords(pos);
	}

	setCoords(pos) {
		this.el.setAttribute('x', pos.x);
		this.el.setAttribute('y', pos.y);
	}

	setSize(x, y) {
		this.el.setAttribute('width', x) ;
		this.el.setAttribute('height', y) ;
	}

	getPosition() {
		return {
			x: this.el.getAttribute('x'),
			y: this.el.getAttribute('y'),
			// width: this.el.getAttribute('width'),
			// height: this.el.getAttribute('height'),
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

		this.el.ontouchstart = this.mouseDown.bind(this);
		this.el.ontouchend = this.mouseUp.bind(this);
		this.el.onmouseout = this.mouseUp.bind(this);
		this.el.ontouchmove = this.mouseMove.bind(this);
	}

	setMode() {
		console.log('in graph set mode', this.mode);
		// this.mode = mode;
	}


	mouseDown(event) {
		this.drawStart = true;
		if (this.mode === 'line') {
			let line = new Line({
				x1: event.touches[0].clientX,
				y1: event.touches[0].clientY,
				x2: event.touches[0].clientX,
				y2: event.touches[0].clientY
			});
			this.current = line;
			this.el.appendChild(line.getHtmlEl());
			console.log(line);

		} else {
			let rect = new Rect({
				x: event.touches[0].clientX,
				y: event.touches[0].clientY,
				width: event.touches[0].clientX,
				height: event.touches[0].clientY
			});
			this.current = rect;
			this.el.appendChild(rect.getHtmlEl());
			console.log(rect);
		}
	}

	mouseDownRect(event) {
		this.drawStart = true;
		let rect = new Rect({
			x: event.touches[0].clientX,
			y: event.touches[0].clientY,
		});
		this.current = rect;
		this.el.appendChild(rect.getHtmlEl());
		console.log(rect);
	}

	mouseUp(event) {
		this.drawStart = false;
		this.current = null;
	}

	mouseMove(event) {
		console.log(event.touches);
		if (this.drawStart && this.current) {
			if (this.mode === 'line') {

				let pos = this.current.getPosition();
				pos.x2 = event.touches[0].clientX;
				pos.y2 = event.touches[0].clientY;
				// pos.x2 = event.pageX;
				// pos.y2 = event.pageY;
				this.current.setPosition(pos);
			} else {
				let pos = this.current.getPosition();
				pos.width = +pos.x + +event.touches[0].clientX;
				pos.height = +pos.y + +event.touches[0].clientY;
			console.log('pos', pos);
				// pos.x2 = event.pageX;
				// pos.y2 = event.pageY;
			
				this.current.setSize(pos.width,pos.height);

			}
		}
	}

	setSize() {
		this.el.setAttribute('width', window.innerWidth);
		this.el.setAttribute('height', window.innerHeight);
	}
}






window.onload = () => {
	window.graph = new Graph(document.getElementById('graph'));

	window.addEventListener('drawchange', e => {
		const mode = e.detail.drawRect
		if (mode) {
			window.graph.mode = 'rect'

		} else {
			window.graph.mode = 'line'

		}
		console.log(window.graph);
	});
};