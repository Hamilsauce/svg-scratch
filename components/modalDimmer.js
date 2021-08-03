import { store } from '../store/index.js'

export default {
	template: '#modal-dimmer',
	props: {},
	data() {
		return {}
	},
	computed: {
		showNav() {
			return store.getters.showNav
		},
		showDimmer() {
			return this.showNav === true || store.getters.showDeleteModal === true ? true : false;
		},
	},
	watch: {
		showDimmer() {}
	},
	methods: {
		handleDimmerClick() {
			if (this.showNav) {
				store.commit('toggleShowNav')
			} else if (store.getters.showDeleteModal) {
				store.commit('toggleDeleteModal')
			}
		}
	}
}