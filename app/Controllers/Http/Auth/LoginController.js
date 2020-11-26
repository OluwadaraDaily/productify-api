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
				Object.assign(user, accessToken)
				
				return response.json({"user": user, "access_token": accessToken})
			}
		}	

		catch (e) {
			return response.json({message: "Not registered", error: e, email: email, password: password })
		}
		
	}

	async getUser({ response, auth }) {
		try {
			if(await auth.check()) {
				return await auth.getUser()
			}
		}
		catch(e) {
			return response.json({message: "Unauthenticated"})
		}
	}
}

module.exports = LoginController
