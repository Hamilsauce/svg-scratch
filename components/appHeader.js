import { store } from '../store/index.js'


export default {
	template: '#app-header',
	data() {
		return {
			title: 'Work Tracker'
		}
	},
	methods: {
		handleMenuClick() {
			store.commit('toggleShowNav')
		}
	}
};