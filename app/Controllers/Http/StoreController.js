'use strict'
const Product = use('App/Models/Product')
const Database = use('Database')
const User = use('App/Models/User')
const Order = use('App/Models/Order')
const OrderItem = use('App/Models/OrderItem')
const Mail = use('Mail')
const Twilio = require('twilio')

class StoreController {

	async showProducts({ auth, view }) {
		const products = await Product.all()
		return view.render('store.index', {
			products: products.toJSON()
		})
	}

	async cartView({ auth, view, response }) {
		// Get all Order Items corresponding to this user
		const get_order = await Order.findBy('user_id', auth.user.id)

		const get_order_items = await OrderItem.query()
		.where('order_id', get_order.id)
		.fetch()

		const product = await Product.findBy('name', get_order_items.name)

		return response.json({order_items: get_order_items.toJSON(), image_url: product.image_url})

		// return view.render('store.cart', {
		// 	order_items: get_order_items.toJSON()
		// })
	}

	async addToCart({ response, request, auth }) {
		const body = request.post()

		// Check if user has an existing order
		const order = await Order.findBy('user_id', auth.user.id)

		// If yes, just add items to the order item table with the order ID
		if(order) {
			const item = await Product.findBy('id', body['id'])
			
			const order_items = await OrderItem.create({
				name: item.name,
				price: item.price,
				order_id: order.id
			})

			const mailData = {
				user: auth.user.toJSON(),
				order: order_items
			}

			//Send Mail 
			await Mail.send('store.mail_item', mailData , message => {
				message.to(auth.user.email)
				.from('hello@productify.com')
				.subject("ITEM ADDED TO CART")
			})

			// Send SMS
			var accountSid = 'AC21ac7a5f38c844565b73dc1cc06c22f5'; // Your Account SID from www.twilio.com/console
			var authToken = 'da953a156271c1e04a7d608782ffbdf5';   // Your Auth Token from www.twilio.com/console

			var client = new Twilio(accountSid, authToken);


			client.messages
			  .create({
			    to: "+234" + auth.user.phone.substring(1,12),
			    from: '+16413816559',
			    body: "New Product Added. Product Name:" + order_items.name + ". Product Price:" + order_items.price
			  })
			  .then(message => console.log(message.sid));

			  return response.json({message:"Added to Cart", order: order, order_item: order_items})
		}

		// If not, create order and add order item
		else {
			const created_order = await Order.create({
				user_id: auth.user.id
			})
			const order_items = await OrderItem.create({
				name: item.name,
				price: item.price,
				order_id: created_order.id
			})

			const mailData = {
				user: auth.user.toJSON(),
				order: order_item
			}

			//Send Mail 
			await Mail.send('store.mail_item', mailData , message => {
				message.to(auth.user.email)
				.from('hello@productify.com')
				.subject("ITEM ADDED TO CART")
			})

			// Send SMS
			var accountSid = 'AC21ac7a5f38c844565b73dc1cc06c22f5'; // Your Account SID from www.twilio.com/console
			var authToken = 'da953a156271c1e04a7d608782ffbdf5';   // Your Auth Token from www.twilio.com/console

			var client = new Twilio(accountSid, authToken);


			client.messages
			  .create({
			    to: "+234" + auth.user.phone.substring(1,12),
			    from: '+16413816559',
			    body: "New Product Added. Product Name:" + order_items.name + ". Product Price:" + order_items.price
			  })
			  .then(message => console.log(message.sid));

			return response.json({message: "Added to Cart!", order: order, order_item: order_items})
		}

	}
		
}

module.exports = StoreController
