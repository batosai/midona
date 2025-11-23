import { ApiProperty } from '@foadonis/openapi/decorators'
import File from '#models/file'

export default function Response() {
  abstract class FileResponse {
    @ApiProperty()
    declare file: File
  }

  return FileResponse
}

