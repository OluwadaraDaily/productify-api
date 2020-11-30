'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class OrderItemSchema extends Schema {
  up () {
    this.alter('order_items', (table) => {
      // alter table
      table.string('image_url').nullable()
    })
  }

  down () {
    this.table('order_items', (table) => {
      // reverse alternations
    })
  }
}

module.exports = OrderItemSchema
