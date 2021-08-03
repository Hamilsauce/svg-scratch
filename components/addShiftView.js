import {store} from '../store/index.js'

export default {
	name: 'add-shift-view',
	template: '#add-shift-view',
	props: {
		data: String //work history array passed as json
	},
	data() {
		return {
			newShift: {
				date: null,
				hours: null,
				details: '',
				weekNumber: null,
				createdDate: null,
				modifiedDate: null
			}
		}
	},
	methods: {
		handleFormSubmit(e) {
			e.preventDefault()
			if (this.validateForm()) {
				this.newShift.date = dayjs(this.newShift.date).format('MM/DD/YYYY')
				this.newShift.weekNumber = dayjs(this.newShift.date).week();
				this.newShift.createdDate = dayjs().format('MM/DD/YYYY');
				this.newShift.modifiedDate = dayjs().format('MM/DD/YYYY');

				store.dispatch('storeHistory', this.newShift);
				// this.$emit('shift-submitted')
				// router.push('/');
				store.commit('updateActiveRoute', 'cardView')
			}
		},
		handleFormCancel() {
			router.push('/')
		},
		validateForm() {
			return !this.newShift.date || !this.newShift.hours ? false : true
		}
	},
};