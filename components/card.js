import { store } from '../store/index.js'

export default {
	template: '#card',
	props: {
		shift: Object,
		selectedCardId: Number,
		editCardId: Number
	},
	data() {
		return {
			shiftData: this.shift,
			newShiftData: {
				id: this.shift.id,
				date: this.shift.date,
				details: this.shift.details,
				hours: this.shift.hours,
			},
		}
	},
	methods: {
		updateHours(e) {
			this.newShiftData.hours = parseInt(e.target.textContent)
		},
		updateDetails(e) {
			this.newShiftData.details = e.target.textContent
		},
		emitCardSelected() {
			store.dispatch('handleSelectedCard', {
				cardId: this.shiftData.id,
				cardRef: this.cardRef
			})
		},
		deleteCard() {
			store.commit('toggleDeleteModal')
		},
		toggleEdit() { this.editMode && this.isSelected ? this.$emit('toggle-edit', this.shift.id) : this.$emit('toggle-edit', this.shiftData.id) },
		saveEdit() {
			console.log(this.newShiftData);
			store.commit('saveCardEdit', this.newShiftData);

			this.toggleEdit()

			// this.$emit('save-edit', this.newShiftData)
		},
		cancelEditCard() {
			this.$emit('cancel-edit', this.shiftData.id)
		},
	},
	computed: {
		refName() {
			return `item${this.shift.id}`
		},
		cardRef() {
			return this.$refs[this.refName]
		},
		isSelected() {
			return this.selectedCardId == this.shiftData.id ? true : false
		},
		editMode() {
			return this.editCardId == this.shiftData.id && this.isSelected ? true : false
		},
	},
	filters: {
		dayDate(inputDate) {
			const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
			const newDate = new Date(inputDate)
			const day = days[newDate.getDay()];
			const date = newDate.getDate();
			const fDate = `${date} ${day}`;
			return fDate;
		},
		month(inputDate) {
			const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', ]
			const newDate = new Date(inputDate)
			const mo = months[newDate.getMonth()];
			const fDate = `${mo}`;
			return fDate;
		}
	}
}