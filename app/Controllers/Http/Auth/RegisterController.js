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

	async register({ request, session, response }) {
		// Validate form Data
		const validation = await validateAll(request.all(), {
			email: 'required|email|unique:users,email',
			phone: 'required|unique:users,phone',
			username: 'required|unique:users,username',
			password: 'required'
		})

		// Check if validation fails
		if(validation.fails()) {
			session.withErrors(validation.messages()).flashExcept(['password'])
			// return response.redirect('back')
			return response.send("Ko le werk!")
		}

		// Create  user
		const user = await User.create({
			username: request.input('username'),
			email: request.input('email'),
			phone: request.input('phone'),
			password: await Hash.make(request.input('password')),
			confirmation_token: randomString({ length:40 })
		})
		// Send confirmation email
		await Mail.send('auth.emails.confirm_email', user.toJSON(), message => {
			message.to(user.email)
			.from('hello@productify.com')
			.subject('PLEASE CONFIRM YOUR EMAIL ADDRESS')
		})

		// Display Success Message
		session.flash({
			notification: {
				type: 'success',
				message: 'Registration Successful! A mail has been sent to your address for confirmation'
			}
		})

		// return response.redirect('/login')
		return response.send("Check!!!!!")
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
