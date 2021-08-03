import {store} from '../store/index.js'

export default {
	name: 'card-view',
	template: '#card-view',
	props: {},
	data() {
		return {
			searchInput: '',
			editCardId: -1,
			deleteIdArray: [],
		}
	},
	methods: {
		// setEditCardId(cardId) {
		// 	this.editCardId = this.editCardId === cardId ? -1 : cardId
		// },
		// saveCardEdit(newData) {
		// 	newData.id === this.editCardId ?
		// 		store.commit('saveCardEdit', newData) :
		// 		null;
		// 	this.editCardId = -1;
		// },
		// cancelCardEdit() {
		// 	this.editCardId = -1
		// },
		// handleDeleteCard(cardId) {
		// 	this.deleteIdArray.push(cardId)
		// 	store.commit('deleteCard')
		// }
	},
	computed: {
		selectedCardId() {
			return store.getters.selectedCardId
		},
		selectedCardScroll() {
			return store.getters.selectedCardScroll
		},
		cardViewElement() {
			return this.$refs.cardView
		},
		cardListElement() {
			return this.$refs.cardList
		},
		workHistory() {
			return store.getters.workHistory
		},
		weekGroups() {
			const groupObj = this.workHistory
				.reduce((weeks, shift) => {
					// group shifts by week number, by creating or updating object props
					const weekNum = String(dayjs(shift.date).week())
					// create prop array if doesnt exist
					weeks[weekNum] = weeks[weekNum] || [];
					// push new week to array
					weeks[weekNum].push({
						...shift,
						weekNumber: Number(weekNum)
					})

					weeks[weekNum]
						.sort((a, b) => {
							const aDate = new Date(a.date)
							const bDate = new Date(b.date)
							return bDate.getDate() - aDate.getDate();
						});
					return weeks
				}, {})

			return Object.entries(groupObj).map(([num, shifts]) => [Number(num), dayjs(shifts[0].date).weekday(0).format('MM/DD/YYYY'), shifts]).sort((a, b) => a[0] - b[0]);
		},

		filteredWorkData() {
			const sortedShifts = this.workHistory
				.sort((a, b) => {
					const aDate = new Date(a.date)
					const bDate = new Date(b.date)
					return bDate.getMonth() - aDate.getMonth() == 0 ?
						bDate.getDate() - aDate.getDate() :
						bDate.getMonth() - aDate.getMonth();
				});

			if (!this.searchInput) return sortedShifts;

			const filterVal = dayjs(this.searchInput).format('MM/DD/YYYY');
			const filteredShifts = sortedShifts.filter(shift => filterVal === dayjs(shift.date).format('MM/DD/YYYY'));

			return filteredShifts
		}
	},
	watch: {
		selectedCardId(newId, oldId) {
			this.editCardId = newId !== oldId ? -1 : newId
		},
		selectedCardScroll() {
			setTimeout(() => {
				this.cardListElement.scrollTop = store.getters.selectedCardScroll
				document.documentElement.scrollTop = store.getters.selectedCardScroll
			}, 100)
		}
	},
	mounted() {}
}