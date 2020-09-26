'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class AuthenticateAdmin {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ request, auth, response }, next) {

  	try {
      auth.check()

      if(auth.user.is_admin) {
        await next()
  		}
      else {
        
        return response.redirect("/")
      }

  	} 

    catch (error) {

      return response.redirect("/login")
    }
    
  }
}

module.exports = AuthenticateAdmin
