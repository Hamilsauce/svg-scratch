import {store} from '../store/index.js'

export default {
	name: 'week-group',
	template: '#week-group',
	props: {
		week: Array,
		weekNumber: Number
	},
	data() {
		return {
			weekString: '',
			editCardId: -1,
			deleteIdArray: [],
			collapse: false,
			showChart: false
		}
	},
	methods: {
		toggleChart() {
			this.showChart = !this.showChart;
		},

		getTotals() {
			const totalHours = this.week.reduce((sum, curr) => {
				return sum = sum + Number(curr.hours)
			}, 0);

			this.totals2 = {
				payRate: 35,
				days: this.week.length,
				hours: this.week.reduce((sum, curr) => {
					return sum = sum + Number(curr.hours)
				}, 0),
				earnings: Intl.NumberFormat('en-US').format(totalHours * 35)
			}
		},

		collapseWeek() {
			this.collapse = !this.collapse
		},
		setEditCardId(cardId) {
			this.editCardId = this.editCardId === cardId ? -1 : cardId
		},
		saveCardEdit(newData) {
			newData.id === this.editCardId ?
				store.commit('saveCardEdit', newData) :
				null;
			this.editCardId = -1;
		},
		cancelCardEdit() {
			this.editCardId = -1
		},
		handleDeleteCard(cardId) {
			this.deleteIdArray.push(cardId)
			store.commit('deleteCard')
		}
	},

	computed: {

		workHistory() {
			return store.getters.workHistory
		},
		weekGroupElement() {
			return this.$refs.weekGroup
		},
		selectedCardId() {
			return store.getters.selectedCardId
		},
		totals() {
			const totalHours = this.week.reduce((sum, curr) => {
				return sum = sum + Number(curr.hours)
			}, 0);

			return {
				payRate: 35,
				days: this.week.length,
				hours: this.week.reduce((sum, curr) => {
					return sum = sum + Number(curr.hours)
				}, 0),
				earnings: Intl.NumberFormat('en-US').format(totalHours * 35)
			}
		}
	},
	watch: {
		week() {

		}
	},
	mounted() {
		// console.log('week');
		// console.log(this.week);
		// console.log(this.totals);

	}
}