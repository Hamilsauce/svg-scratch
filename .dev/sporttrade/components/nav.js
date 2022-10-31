export class Nav {
	constructor(root, linkData) {
		this.root = root;
		this.linkData = linkData;
	}

	_data = {
		// links: this.linkData,
		isExpanded: false
	}

	get data() {
		return this._data;
	}

	get isExpanded() {
		return this._data.isExpanded;
	}

	set isExpanded(val) {
		this._data.isExpanded = val;
	}

	toggleNav() {
		if (this.root.classList.contains('navExpand')) {
			setTimeout(() => {
				this.root.classList.remove('navExpand')
			}, 200)
		} else {
			setTimeout(() => {
				this.root.classList.add('navExpand')
			}, 200)
		}
	}

	closeNav() {
		const nav = document.querySelector('.nav');
		this.root.classList.toggle('navExpand')
	}

	template() {
		return `
				<div class="nav-head">
					<div class="close-nav">
						X
					</div>
				</div>
				<a class="home-link nav-link" href="#">home</a>
				<div class="new-card-link nav-link">New Card</div>
				<a class="music-link nav-link" href="https://hamilsauce.github.io/music-library-app/">ham radio</a>
				<a class="about-link nav-link" href="#">About</a>
				<a class="contact-link nav-link" href="#">Contact</a>
				<a class="github-link nav-link" href="#">github</a>
		`;
	}
	render() {
		this.root.insertAdjacentHTML('beforeend', this.template());
		this.root.addEventListener('toggleNav', this.toggleNav)
		this.root.querySelector('.close-nav')
			.addEventListener('click', e => {
				const toggleNavEvent = new CustomEvent('toggleNav', {
					detail: {},
					bubbles: true
				});
				e.target.dispatchEvent(toggleNavEvent)
			})
	}
}

{
	Nav
}