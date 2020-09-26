'use strict'
const User = use('App/Models/User')
const Hash = use('Hash')

class LoginController {
	async showLoginForm({ view }) {
		return view.render('auth.login')	
	}

	async login({ request, session, response, auth, view }) {
		// Get form Data
		const { email, password, remember } = request.all()

		// Get user based on form Data & Confirm user is active
		const user = await User.query()
		.where('email', email)
		.where('is_active', true)
		.first()

		// Verify user password
		if(user) {
			const passwordVerified = await Hash.verify(password, user.password)
	
			if(passwordVerified) {
				// Grant access to home page
				await auth.remember(!!remember).login(user)
				return response.redirect('/')
			}
			else {
				session.flash({
					notification: {
						type: 'danger',
						message: 'Incorrect Password!'
					}
				})
				// return view.render('auth.login', {
				// 	p1: password,
				// 	p2: user.password,
				// 	p3: p3,
				// 	p4: p4

				// })
				return response.redirect('back')
			}
		}
		// Else, you display an error message
		session.flash({
			notification: {
				type: 'danger',
				message: 'We could not verify your credentials. Make sure you have confirmed your email address'
			}
		})
		return view.render('auth.login', {
			user: user
		})
		return response.redirect('back')
		
	}
}

module.exports = LoginController
