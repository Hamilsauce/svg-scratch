export default {
	name: 'chart-overlay',
	template: '#chart-overlay',
	props: {
		wTotals: Object,
		weekNumber: Number,
		week: Array,
		collapse: false
		
	},
	data() {
		return {
			elem: this.$refs.chart
		}
	},
	computed: {
		canvasElement() {
			return this.$refs.chart;
		},
		weekId() {},
		totals() {
			const totalHours = this.week.reduce((sum, curr) => {
				return sum = sum + Number(curr.hours)
			}, 0);
			return {
				weekNumber: this.weekNumber,
				payRate: 35,
				data: {
					days: this.week.length,
					hours: this.week.reduce((sum, curr) => {
						return sum = sum + Number(curr.hours)
					}, 0),
					earnings: Intl.NumberFormat('en-US').format(totalHours * 35)
				}
			}
		},
		hoursPerDay() {
			return this.week.map(day => [day.date, day.hours])
		}
	},
	watch: {},
	methods: {
		chart(chartType = 'pie') {
			const labels = Object.keys(this.totals.data).map(_ => `${_[0].toUpperCase()}${_.slice(1)}`)
			const ctx = this.canvasElement.getContext('2d');
			const chart = new Chart(ctx, {
				type: chartType,
				data: {
					labels: this.hoursPerDay.map(_ => `${_[0]} Hours`),
					datasets: [{
						label: 'Totals',
						data: this.hoursPerDay.map(_ => _[1]),
						backgroundColor: ['red', 'green', 'blue'],
						borderColor: ['red', 'green', 'blue'],
						borderWidth: 1
					}]
				},
				// options: { scales: { yAxes: [{ ticks: { beginAtZero: true } }] } }
				options: {
					legend: {
						position: 'left'
					}
				}
			});
		}
	},
	created() {},
	mounted() {
		this.chart();
	}
}