import { ApiProperty } from '@foadonis/openapi/decorators'
import Term from '#models/term'

export default function Response() {
  abstract class TermResponse {
    @ApiProperty()
    declare term: Term
  }

  return TermResponse
}
