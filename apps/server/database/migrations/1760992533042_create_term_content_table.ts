import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'term_content'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('term_id').notNullable().references('terms.id').onDelete('CASCADE')
      table.uuid('content_id').notNullable().references('contents.id').onDelete('CASCADE')

      table.unique(['term_id', 'content_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
