// const canvas = document.querySelector('canvas');
// const ctx = canvas.getContext('2d');

// ctx.fillStyle = 'white';
// ctx.fillRect(20, 20, 100, 100);

// const contentViews = document.querySelectorAll('.content-view');
// const contentEl = document.querySelectorAll('.content');
const optionButtons = document.querySelectorAll('.option');
const menuButton = document.querySelector('.header-menu-button');
const nav = document.querySelector('.app-nav');
const navClose = document.querySelector('.close-nav');
const activeOption = null;
console.log(...optionButtons);

menuButton
	.addEventListener('click', ({ target }) => {
		console.log('click');
		nav.classList.add('navExpand')
	});
navClose
	.addEventListener('click', ({ target }) => {
		nav.classList.remove('navExpand')
	});

optionButtons.forEach(b => {
	// console.log(b);
	b.addEventListener('click', ({ target }) => {
		console.log(target);
		[...optionButtons].forEach(_ => _.classList.remove('active-option'))
		target.classList.add('active-option')

		// const option = target.dataset.contentName
		// const contentName = target.dataset.contentName
		// console.log(contentName);

		// [...contentViews].forEach(v => { v.classList.remove('show') })

		// const view = [...contentViews].find(v => {
		// 	return v.dataset.contentName === contentName
		// })
		// console.log(view);

	})
})

const ctx = document.getElementById('chart').getContext('2d');
const chart = new Chart(ctx, {
	type: 'bar',
	data: {
		labels: ['red', 'green', 'blue'],
		datasets: [{
			label: '# of Votes',
			data: [12, 19, 3],
			backgroundColor: ['red', 'green', 'blue'],
			borderColor: ['red', 'green', 'blue'],
			borderWidth: 1
			}]
	},
	options: { scales: { yAxes: [{ ticks: { beginAtZero: true } }] } }
});

const card = document.querySelector('.card')
const chartContainer = document.querySelector('.chart-container')
const chartEl = document.querySelector('.chart')

card.addEventListener('click', e => {
	chartContainer.classList.toggle('hide')
	// chartContainer.classList.toggle('hide')
})

chartContainer.addEventListener('click', e => {
	console.log('container click');
	// chartContainer.classList.toggle('hide')
})

chartEl.addEventListener('click', e => {
	// chartContainer.classList.toggle('hide')
	console.log('chart click');
})