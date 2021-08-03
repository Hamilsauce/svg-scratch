// import Vue from './.vue/vue.js'

export default {
	template: '<div>card view</div>',
	data() {
		return {
			product: {
				name: '',
				description: '',
				price: ''
			}
		}
	},
	methods: {
		createProduct() {
			let product = this.product;
			products.push({
				id: Math.random().toString().split('.')[1],
				name: product.name,
				description: product.description,
				price: product.price
			});
			// router.push('/');
		}
	}
}