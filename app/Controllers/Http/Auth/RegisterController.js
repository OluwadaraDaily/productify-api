'use strict'
// Import validator
const { validateAll } = use('Validator')

// Import User Model
const User = use('App/Models/User')

// Import random string module
const randomString = require("random-string")

// Import the Mail package
const Mail = use('Mail')

const Hash = use('Hash')

class RegisterController {
	async showRegisterForm({ view }) {
		return view.render('auth.register')
	}

	async register({ auth, request, session, response }) {
		// Get all user inputs
		const username = request.input('username')
		const password = request.input('password')
		const email = request.input('email')
		const phone = request.input('phone')

		// Check if user exists
		const check = await User.findBy('email', email)

		if(check) {
			return response.json({message: "Already existing account"})
		}

		// Create  user
		let user = new User()
		user.username = username
		user.email = email
		user.phone = phone
		user.password = await Hash.make(password)

		user = await user.save()
		
		// const user = await User.create({
		// 	username: username,
		// 	email: email,
		// 	phone: phone,
		// 	password: await Hash.make(password)
		// })

		let accessToken = await auth.generate(user)

		return response.json({"user": user, "access_token": accessToken})
	}

	async confirmEmail({ params, session, response }) {
		// Get user with token
		const user = await User.findBy('confirmation_token', params.token)
		
		// Set confirmation token to null & Change active status
		user.confirmation_token = null
		user.is_active = true
		
		// Save changes to DB
		await user.save()

		// Redirect to login with flash message saying the confirmation is complete
		session.flash({
			notification: {
				type: 'success',
				message: 'Your email address has been confirmed'
			}
		})

		return response.redirect('/login')
	}
}

module.exports = RegisterController
