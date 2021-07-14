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
		this._selectedShapeZPosition = null;
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

	set shapeColor(c) { this._shapeColor = c };

	set selectMode(s) {
		this._selectMode = s;
		this.toggleSelectMode(s);
	}
	get selectMode() { return this._selectMode };

	set selectedShapeZPosition(z) {this._selectedShapeZPosition = z};
	get selectedShapeZPosition() { return this._selectedShapeZPosition }

	set selectedShape(el) {
		if (this._selectedShape != el) {
			if (this._selectedShape != undefined) this._selectedShape.classList.remove('selected-shape')
			this._selectedShape = el;
			this._selectedShape.classList.add('selected-shape')
			this.selectedShapeZPosition = [...this.el.children].findIndex((c) => {
				return c == el
			})
			this.el.removeChild(this._selectedShape);
			this.el.insertBefore(this._selectedShape, this.el.children[-1]);
		} else {
			this.selectedShape.classList.remove('selected-shape')
			this.selectedShape = undefined;
		}
	};
	get selectedShape() {return this._selectedShape};


	toggleSelectMode(s) {
		if (this.selectMode) {
			console.log('toggle on', this);
		} else {
			if (this.selectedShape) this.selectedShape.classList.remove('selected-shape')
			this.selectedShape = undefined;
			console.log('toggle off', this);
		}
	}

	handleShapeSelect(e) {
		if (this.selectedShape != undefined) {
			const refNode = this.el.children[this.selectedShapeZPosition]
			this.selectedShape.classList.remove('selected-shape')
			this.selectedShape.classList.add('prev-selected-shape')
			this.el.insertBefore(this.selectedShape, refNode)
		}
		this.selectedShapeZPosition = [...this.el.children].findIndex((c) => {
			return c = e.target
		})
		console.log('sel sh pos', this.selectedShapeZPosition);

		if (this.selectMode) this.selectedShape = e.target
	}

	moveBox(e) {
		const targ = e.target;
		let xPos = Math.round(parseInt(e.touches[0].pageX));
		let yPos = e.touches[0].pageY;
		let currX = targ.style.left.replace('px', '');
		let currY = targ.style.top;

		targ.style.left = `${parseInt(xPos) - 75}px`
		targ.style.top = `${parseInt(yPos) - 75}px`

		// this.graph.children.forEach(b => b.style.zIndex = 0)
		targ.style.zIndex = 30;
	}

	handleColorChange(e) { const color = e.detail.color }

	setMode() { this.mode = mode }

	mouseDown(event) {
		if (!this._selectMode) {
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
					x: event.touches[0].pageX,
					y: event.touches[0].pageY,
					width: event.touches[0].clientX,
					height: event.touches[0].clientY
				}, this._shapeColor, this);
				this.current = rect;
				this.el.appendChild(rect.getHtmlEl());
			}
		} else {
			this.moveBox(event)
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
		if (!this._selectMode) {

			if (this.drawStart && this.current) {

				if (this.mode === 'line') {
					let pos = this.current.getPosition();

					pos.x2 = event.touches[0].clientX;
					pos.y2 = event.touches[0].clientY;
					this.current.setPosition(pos);

				} else {
					let pos = this.current.getPosition();

					pos.width = event.touches[0].pageX;
					pos.height = event.touches[0].pageY;
					this.current.setSize(pos.width, pos.height);
				}
			}
		} else {
			this._selectedShape.setAttribute('x', event.touches[0].pageX - (parseInt(this._selectedShape.getAttribute('width')) / 2));
			this._selectedShape.setAttribute('y', event.touches[0].pageY - (parseInt(this._selectedShape.getAttribute('height'))));
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