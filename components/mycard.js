export class Card {
	constructor(props) {
		this.root = document.createElement('div');
		this.props = props;
	}

	_data = {
		date: this.props.date,
		hours: this.props.hours,
		detail: this.props.detail,
		iSelected: false
	}

	get data() {
		return this._data;
	}

	get isSelected() {
		return this._data.isSelected;
	}

	set isSelected(val) {
		this._data.isSelected = val;
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