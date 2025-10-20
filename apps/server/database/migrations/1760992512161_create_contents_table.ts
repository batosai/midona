import { BaseSchema } from '@adonisjs/lucid/schema'
import ContentTypes from '#enums/content_types'

export default class extends BaseSchema {
  protected tableName = 'contents'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().notNullable().index()
      table.string('title', 255).notNullable()
      table.string('slug', 255).notNullable().unique()
      table.text('text')
      table.json('extra')
      table.enu('content_type', Object.values(ContentTypes)).notNullable().defaultTo(ContentTypes.NOTE)

      table.uuid('user_id').notNullable().references('users.id').onDelete('CASCADE')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
