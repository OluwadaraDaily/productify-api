'use strict'
const Product = use('App/Models/Product')
const CloudinaryService = use('App/Services/CloudinaryService')

class ProductController {
	showCreateProductForm({ view }) {
		return view.render('store.create')
	}

	async create({ request, session, response }) {
		const { name, price } = request.all()
		const file = request.file('image')

		try {
			const cloudinaryResponse = await CloudinaryService.v2.uploader.upload(file.tmpPath, {
				folder: 'productify', width: 536, height: 402, crop: "scale"
			})

			const product = new Product()
			product.name = name
			product.price = price
			product.image_url = cloudinaryResponse.secure_url

			await product.save()

			session.flash({
				notification: {
					type: 'success',
					message: "Successfully added product"
				}
			})

			return response.redirect("/")

		} catch (error) {
			session.flash({
				notification: {
					type: 'danger',
					message: "Product was not added"
				}
			})

			return response.redirect("/")
		}
	}
}

module.exports = ProductController
