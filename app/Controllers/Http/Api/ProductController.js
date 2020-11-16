'use strict'
const Product = use('App/Models/Product')

class ProductController {
	async getProducts({ response }) {
		let products = await Product.all()

		response.send(products.toJSON())
	}
}

module.exports = ProductController
