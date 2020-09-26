'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AlterUsersSchema extends Schema {
  up () {
    this.alter('users', (table) => {
      // alter table
      table.boolean('is_admin').defaultTo(0)
    })
  }

  down () {
    this.table('alter_users', (table) => {
      // reverse alternations
    })
  }
}

module.exports = AlterUsersSchema
