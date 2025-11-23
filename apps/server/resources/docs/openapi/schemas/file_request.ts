import { ApiProperty } from '@foadonis/openapi/decorators'

export class FileUploadRequest {
  @ApiProperty({ type: 'string', format: 'binary', description: 'File to upload (multipart/form-data)' })
  declare file_data: string
}

export class FileBase64UploadRequest {
  @ApiProperty({ description: 'Base64 encoded file content' })
  declare file_data: string

  @ApiProperty({ required: false, description: 'File name (optional)' })
  declare name?: string
}

export class FileUrlUploadRequest {
  @ApiProperty({ description: 'URL of the file to download' })
  declare url: string

  @ApiProperty({ required: false, description: 'File name (optional)' })
  declare name?: string
}

