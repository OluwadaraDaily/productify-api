'use strict'
const User = use('App/Models/User')
const Hash = use('Hash')

class LoginController {
	async showLoginForm({ view }) {
		return view.render('auth.login')	
	}

	async login({ request, response, auth }) {
		// Get form Data
		const email = request.input('email')
		const password = request.input('password')

		try{
			if(await auth.attempt(email, password)) {
				let user = await User.findBy("email", email)
				let accessToken = await auth.generate(user)
				return response.json({"user": user, "access_token": accessToken})
			}
		}	

		catch (e) {
			return response.json({message: "Not registered", error: e, email: email, password: password })
		}

		// Get user based on form Data
	// 	const user = await User.query()
	// 	.where('email', email)
	// 	.first()

	// 	// Verify user password
	// 	if(user) {
	// 		const passwordVerified = await Hash.verify(password, user.password)
	
	// 		if(passwordVerified) {
	// 			return response.json({"message": "User is "})
	// 		}
	// 		else {
	// 			session.flash({
	// 				notification: {
	// 					type: 'danger',
	// 					message: 'Incorrect Password!'
	// 				}
	// 			})
	// 			// return view.render('auth.login', {
	// 			// 	p1: password,
	// 			// 	p2: user.password,
	// 			// 	p3: p3,
	// 			// 	p4: p4

	// 			// })
	// 			return response.redirect('back')
	// 		}
	// 	}
	// 	// Else, you display an error message
	// 	session.flash({
	// 		notification: {
	// 			type: 'danger',
	// 			message: 'We could not verify your credentials. Make sure you have confirmed your email address'
	// 		}
	// 	})
	// 	return view.render('auth.login', {
	// 		user: user
	// 	})
	// 	return response.redirect('back')
		
	}
}

module.exports = LoginController
