'use strict'
const Product = use('App/Models/Product')

class ProductController {
	async getProducts({ response }) {
		let products = await Product.all()

		return response.json(products)
	}
}

module.exports = ProductController
