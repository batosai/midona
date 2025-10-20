import { BaseSchema } from '@adonisjs/lucid/schema'
import Taxonomies from '#enums/taxonomies'

export default class extends BaseSchema {
  protected tableName = 'terms'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().notNullable().index()
      table.string('name', 255).notNullable()
      table.string('slug', 255).notNullable().unique()
      table.text('description')
      table.integer('position').notNullable().defaultTo(0)
      table.enu('taxonomy', Object.values(Taxonomies)).notNullable().defaultTo(Taxonomies.CATEGORY)

      table.uuid('parent_id').references('terms.id').onDelete('CASCADE')
      table.uuid('user_id').notNullable().references('users.id').onDelete('CASCADE')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
