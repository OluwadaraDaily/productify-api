'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AlterUsersSchema extends Schema {
  up () {
    this.table('alter_users', (table) => {
      // alter table
      table.dropColumn('confirmation_token');
      table.dropColumn('is_active')
    })
  }

  down () {
    this.table('alter_users', (table) => {
      // reverse alternations
    })
  }
}

module.exports = AlterUsersSchema
