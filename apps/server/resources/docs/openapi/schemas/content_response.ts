import { ApiProperty } from '@foadonis/openapi/decorators'
import Content from '#models/content'

export default function Response() {
  abstract class ContentResponse {
    @ApiProperty()
    declare content: Content
  }

  return ContentResponse
}
