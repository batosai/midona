import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'files'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().notNullable().index()

      table.string('name', 255).notNullable()
      table.string('mime_type', 255)
      table.integer('size')
      table.json('file_data').notNullable()

      table.uuid('content_id').references('contents.id').onDelete('CASCADE')
      table.uuid('user_id').notNullable().references('users.id').onDelete('CASCADE')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
