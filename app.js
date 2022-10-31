import { store } from './store/index.js'
import { workHistory } from './data/work-data.js'
import { exportAsJson, exportAsCsv } from './services/fileSaver.js';
import deleteCardModal from './components/deleteCardModal.js'
import modalDimmer from './components/modalDimmer.js'
import appNav from './components/appNav.js'
import appHeader from './components/appHeader.js'
import cardView from './components/cardView.js'
import addShiftView from './components/addShiftView.js'
import weekGroup from './components/weekGroup.js'
import chartOverlay from './components/chartOverlay.js'
import card from './components/card.js'

const CardView = Vue.component('card-view', cardView)
const AddShiftView = Vue.component('add-shift-view', addShiftView);
const DeleteCardModal = Vue.component('delete-card-modal', deleteCardModal);
const AppNav = Vue.component('app-nav', appNav);
const AppHeader = Vue.component('app-header', appHeader);
const ModalDimmer = Vue.component('modal-dimmer', modalDimmer);
const Card = Vue.component('card', card)
const WeekGroup = Vue.component('week-group', weekGroup)
const ChartOverlay = Vue.component('chart-overlay', chartOverlay)

const router = new VueRouter({
	routes: [{
			path: '/',
			component: CardView,
			name: 'card-view',
			props: true
		},
		{
			path: '/add-shift-view',
			component: AddShiftView,
			name: 'add-shift-view',
			props: true
		},
	]
});

const EventBus = new Vue();

const app = new Vue({
	router: router,
	data() { return { workData: workHistory, } },
	computed: {
		activeRoute() { return store.getters.activeRoute },
		workHistory() { return store.getters.workHistory },
		showNav() { return store.getters.showNav },
		showDeleteModal() { return store.getters.showDeleteModal }
	},
	watch: {
		activeRoute(newVal) {
			console.log('newval', newVal);
			router.push(`/${newVal}`)
			
		}
	},
	
	methods: { 
		handleExportAsJson() { exportAsJson(this.workHistory) },
		handleExportAsCsv() { exportAsCsv(this.workHistory) },
	},
	created() { store.dispatch('fetchLocalStorageData') }
}).$mount('#app')





// !! SCRATCH
// function findProduct(productId) {
// 	return products[findProductKey(productId)];
// };

// function findProductKey(productId) {
// 	for (var key = 0; key < products.length; key++) {
// 		if (products[key].id == productId) {
// 			return key;
// 		}
// 	}
// };


// const products = [{
// 		id: 1,
// 		name: 'Angular',
// 		description: 'Superheroic JavaScript MVW Framework.',
// 		price: 100
// 	},
// 	{
// 		id: 2,
// 		name: 'Ember',
// 		description: 'A framework for creating ambitious web applications.',
// 		price: 100
// 	},
// 	{
// 		id: 3,
// 		name: 'React',
// 		description: 'A JavaScript Library for building user interfaces.',
// 		price: 100
// 	}
// ];

// const ProductEdit = Vue.extend({
// 	template: '#product-edit',
// 	data() {
// 		return {
// 			product: findProduct(this.$route.params.product_id)
// 		}
// 	},
// 	methods: {
// 		updateProduct() {
// 			const product = this.product;

// 			products[findProductKey(product.id)] = {
// 				id: product.id,
// 				name: product.name,
// 				description: product.description,
// 				price: product.price
// 			};
// 			router.push('/');
// 		}
// 	}
// });

// const ProductDelete = Vue.extend({
// 	template: '#product-delete',
// 	data: function() {
// 		return { product: findProduct(this.$route.params.product_id) };
// 	},
// 	methods: {
// 		deleteProduct() {
// 			products.splice(findProductKey(this.$route.params.product_id), 1);
// 			router.push('/');
// 		}
// 	}
// });

// const AddProduct = Vue.extend({
// 	template: '#add-product',
// 	data() {
// 		return {
// 			product: {
// 				name: '',
// 				description: '',
// 				price: ''
// 			}
// 		}
// 	},
// 	methods: {
// 		createProduct() {
// 			let product = this.product;
// 			products.push({
// 				id: Math.random().toString().split('.')[1],
// 				name: product.name,
// 				description: product.description,
// 				price: product.price
// 			});
// 			router.push('/');
// 		}
// 	}
// });