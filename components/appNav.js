
import { store } from '../store/index.js'

export default {
	template: '#app-nav',
	props: {},
	computed: {
		showNav() {
			return store.getters.showNav
		}
	},
	methods: {
		closeNav() {
			setTimeout(() => {
				store.commit('toggleShowNav')
			}, 200)
		},
		exportJsonClicked() {
			this.$emit('export-json')
		},
		exportCsvClicked() {
			this.$emit('export-csv')
		}
	},
};