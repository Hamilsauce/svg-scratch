class Line {
	constructor(pos, color, graph) {
		this.graph = graph;
		this.el = document.createElementNS('http://www.w3.org/2000/svg', 'line');
		this.el.classList.add('line');
		this.el.setAttribute('stroke', color);
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
	constructor(pos, color, graph) {
		this.graph = graph;
		this.el = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
		this.el.classList.add('rect');
		this.el.setAttribute('stroke', 'red');
		this.el.setAttribute('fill', color);
		this.el.setAttribute('stroke-width', '2');
		this.setCoords(pos);
		this.setSize(pos);
		this.el.addEventListener('click', this.handleClick.bind(this));
	}

	handleClick(e) {
		console.log('e', e);
		console.log('rect graph', this);
		if (this.graph.selectMode) {
			const evt = new CustomEvent('shapeSelected', { bubbles: true, detail: { event: e } })
			e.target.dispatchEvent(evt);
			console.log('shape click w select mide on', evt);
		}
	}

	setCoords(pos) {
		this.el.setAttribute('x', pos.x);
		this.el.setAttribute('y', pos.y);
	}

	setSize(width, height) {
		this.el.setAttribute('width', width);
		this.el.setAttribute('height', height);
	}

	getPosition() {
		return {
			x: this.el.getAttribute('x'),
			y: this.el.getAttribute('y'),
			width: this.el.getAttribute('width'),
			height: this.el.getAttribute('height'),
		}
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
		this._shapeColor = 'grey';
		this._selectedShape = undefined;
		this._selectMode = false;
		this.el = el;
		this.elements = [];
		this.mode = 'line';
		this.setSize();

		this.el.addEventListener('shapeSelected', this.handleShapeSelect.bind(this))
		this.el.addEventListener('shapeColorChange', this.handleColorChange.bind(this))
		this.el.ontouchstart = this.mouseDown.bind(this);
		this.el.ontouchend = this.mouseUp.bind(this);
		this.el.onmouseout = this.mouseUp.bind(this);
		this.el.ontouchmove = this.mouseMove.bind(this);
	}

	set shapeColor(c) {
		this._shapeColor = c;
		console.log('hraph color', this._shapeColor);
	}

	set selectMode(s) {
		this._selectMode = s;
		this.toggleSelectMode(s)
	}
	get selectMode() {
		return this._selectMode;
	}

	set selectedShape(el) {
		if (this._selectedShape != el) {
			if (this._selectedShape != undefined) this._selectedShape.classList.remove('selected-shape')
			this._selectedShape = el;
			this._selectedShape.classList.add('selected-shape')

		} else {
			this._selectedShape.classList.remove('selected-shape')
			this._selectedShape = undefined;
		}
	}
	
	get selectedShape() {
		return this._selectedShape;
	}

	toggleSelectMode(s) {
		console.log('toggleSelect S', s);
		console.log('toggleSelect this', this);
		if (this.selectMode) {
			// this.selectedShape = e.target
			console.log(this);
			console.log('toggle on', this.el.children);
		} else {
			console.log('toggle off', this.el.children);

		}
	}

	handleShapeSelect(e) {
		if (this.selectMode) {
			console.log('shape click in gtaph', e);
			this.selectedShape = e.target
			console.log(this.selectedShape);

		}
	}


	handleColorChange(e) {
		const color = e.detail.color
		console.log('handlecolorchsnge in graph', color);
	}
	setMode() {
		this.mode = mode;
	}

	mouseDown(event) {
		this.drawStart = true;
		if (this.mode === 'line') {
			let line = new Line({
				x1: event.touches[0].pageX,
				y1: event.touches[0].pageY,
				x2: event.touches[0].pageX,
				y2: event.touches[0].pageY
			}, this._shapeColor, this);

			this.current = line;
			this.el.appendChild(line.getHtmlEl());
		} else {
			let rect = new Rect({
				x: event.touches[0].clientX,
				y: event.touches[0].clientY,
				width: event.touches[0].clientX,
				height: event.touches[0].clientY
			}, this._shapeColor, this);
			this.current = rect;
			this.el.appendChild(rect.getHtmlEl());
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
	}

	mouseUp(event) {
		this.drawStart = false;
		this.current = null;
	}

	mouseMove(event) {
		if (this.drawStart && this.current) {

			if (this.mode === 'line') {
				let pos = this.current.getPosition();

				pos.x2 = event.touches[0].clientX;
				pos.y2 = event.touches[0].clientY;
				this.current.setPosition(pos);

			} else {
				let pos = this.current.getPosition();

				pos.width = +event.touches[0].clientX;
				pos.height = +event.touches[0].clientY;
				this.current.setSize(pos.width, pos.height);
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
	});
};