'use strict'

const { hooks } = require('@adonisjs/ignitor')

// Making sure the url of the app is available to be used in the view
hooks.after.providersBooted(() => {
	const View = use('View')
	const Env = use('Env')
	const Exception = use('Exception')

	View.global('appUrl', path => {
		const APP_URL = Env.get("APP_URL")

		return path ? `${APP_URL}/${path}`: APP_URL
	})

	// Handling the InvalidSessionException for  authentication
	Exception.handle('InvalidSessionException', (error, { response }) => {
		return response.redirect("/login")
	})
})