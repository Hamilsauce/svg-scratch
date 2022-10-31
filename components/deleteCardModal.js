import { store } from '../store/index.js'
export default {
	template: '#delete-card-modal',
	methods: {
		deleteConfirmed() {
			store.commit('deleteCard');
			store.commit('toggleDeleteModal')
		},
		deleteCanceled() {
			store.commit('toggleDeleteModal')
		},
	},
};