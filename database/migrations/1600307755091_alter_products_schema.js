'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AlterProductsSchema extends Schema {
  up () {
    this.alter('products', (table) => {
      // alter table
      table.decimal('price', 8, 2).alter()
    })
  }

  down () {
    this.table('alter_products', (table) => {
      // reverse alternations
    })
  }
}

module.exports = AlterProductsSchema
