'use strict'
const { validate, validateAll } = use("Validator")
const User = use("App/Models/User")
const PasswordReset = use("App/Models/PasswordReset")
const randomString = require('random-string')
const Mail = use('Mail')
const Hash  = use('Hash')

class PasswordResetController {
	showLinkRequestForm({ view }) {
		return view.render('auth.passwords.email')
	}

	async sendResetLinkEmail({ request, session, response }) {
		// Validate Form data
		const validation = await validate(request.only('email'), {
			email: 'required|email'
		})

		if(validation.fails()) {
			session.withErrors(validation.messages()).flashAll()

			return response.redirect('back')
		}

		try {
			// Get user
			const user = await User.findBy('email', request.input('email'))
			
			// Get reset password token and delete if available
			await PasswordReset.query().where('email', user.email).delete()

			const { token } = await PasswordReset.create({
				email: user.email,
				token: randomString({ length:40 })
			})

			const mailData = {
				user: user.toJSON(),
				token
			}

			// Send mail
			await Mail.send('auth.emails.password_reset', mailData, message => {
				message
				.to(user.email)
				.from('hello@productify.com')
				.subject("PASSWORD RESET LINK")
			})

			//Send Success Message
			session.flash({
				notification: {
					type: 'success',
					message: "A password reset link has been sent to your email address"
				}
			})

			return response.redirect('back') 
		}
		catch (error) {
			// If user not found, flash an error message
			//Send Success Message
			session.flash({
				notification: {
					type: 'danger',
					message: "Oops! The email address sent does not match any user in the database"
				}
			})

			return response.redirect('back')
		}

	}

	async showResetForm ({ params, view }) {
		return view.render('auth.passwords.reset', { token: params.token })
	}

	async reset({ request, session, response }) {
		// Validate form input
		const validation = await validateAll(request.all(), {
			token: 'required',
			email: 'required|email',
			password: 'required|confirmed'
		})

		if(validation.fails()) {
			session.withErrors(validation.messages()).flashExcept(['password', 'password_confirmation'])

			return response.redirect('back')
		}

		try {
			// Get user by provided email
			const user = await User.findBy('email', request.input('email'))

			// Check if password token exists for this user on the Password Reset table
			const token = await PasswordReset.query()
			.where('email', user.email)
			.where('token', request.input('token'))
			.first()

			if(!token) {
				session.flash({
					notification: {
						type: 'danger',
						message: 'This Password reset token does not exist!'
					}
				})

				return response.redirect('back')	
			}

			// persist new password to the DB
			user.password = await Hash.make(request.input('password'))

			await user.save()

			// Delete reset token
			await PasswordReset.query()
			.where('email', user.email)
			.delete()

			// Display a success flash message and redirect user to the login page
			session.flash({
				notification: {
					type: 'success',
					message: 'Your password has been changed successfully!'
				}
			})

			return response.redirect('/login')

		} catch (error) {
			// display appropriate error message
			session.flash({
				notification: {
					type: 'danger',
					message: 'Oops! Email supplied does not match any registered account. Try Again.'
				}
			})

			return response.redirect('back')
		}



		
	}
}

module.exports = PasswordResetController
