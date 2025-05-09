import { BaseSchema } from '@adonisjs/lucid/schema'
import DocumentTypes from '#enums/document_types'

export default class extends BaseSchema {
  protected tableName = 'documents'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().index()
      table.enu('type', Object.values(DocumentTypes)).notNullable().defaultTo(DocumentTypes.FILE)
      table.json('file').nullable()
      table.string('mime_type').nullable()
      table.string('content').nullable()
      table.integer('views').notNullable().defaultTo(0)

      table.uuid('parent_id').nullable().references('documents.id').onDelete('CASCADE')
      table.uuid('user_id').notNullable().references('users.id').onDelete('CASCADE')

      table.timestamp('deleted_on').nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
