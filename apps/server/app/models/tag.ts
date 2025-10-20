import Taxonomies from '#enums/taxonomies'
import Term from '#models/term'

export default class Tag extends Term {
  static taxonomy = Taxonomies.TAG

  // Override the query builder to automatically filter by taxonomy
  static query() {
    return super.query().where('taxonomy', this.taxonomy) as any
  }
}
