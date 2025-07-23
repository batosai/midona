import type Document from '#models/document'
import type DocumentTypes from '#enums/document_types'

import { BaseModelDto } from '@adocasts.com/dto/base'
import UserDto from '#dtos/user'

export default class DocumentDto extends BaseModelDto {
  declare id: string
  declare type: DocumentTypes
  declare userId: string
  declare parentId: string | null
  declare file: {
    keyId: string
    name: string
    size: number
    url: string
    thumbnail: {
      url: string
    }
  } | null
  declare mimeType: string | null
  declare content: string | null
  declare views: number
  declare name: string
  declare size: number
  declare user: UserDto | null
  declare parent: DocumentDto | null

  declare isFolder: boolean
  declare isFile: boolean
  declare isImage: boolean
  declare isVideo: boolean
  declare isAudio: boolean
  declare isPdf: boolean
  declare isWord: boolean
  declare isExcel: boolean
  declare isZip: boolean
  declare isRar: boolean

  declare thumbnail: string | undefined
  declare key: string

  constructor(document?: Document) {
    super()

    if (!document) return
    this.id = document.id
    this.type = document.type
    this.userId = document.userId
    this.parentId = document.parentId
    this.file = document.file?.toJSON() as {
      keyId: string
      name: string
      size: number
      url: string
      thumbnail: {
        url: string
      }
    } | null
    this.mimeType = document.mimeType
    this.content = document.content
    this.views = document.views
    this.name = document.name
    this.size = document.size
    this.user = document.user && new UserDto(document.user)
    this.parent = document.parent && new DocumentDto(document.parent)

    this.isFolder = document.isFolder ?? false
    this.isFile = document.isFile ?? false
    this.isImage = document.isImage ?? false
    this.isVideo = document.isVideo ?? false
    this.isAudio = document.isAudio ?? false
    this.isPdf = document.isPdf ?? false
    this.isWord = document.isWord ?? false
    this.isExcel = document.isExcel ?? false
    this.isZip = document.isZip ?? false
    this.isRar = document.isRar ?? false

    this.thumbnail = this.file?.thumbnail?.url
    this.key = this.file?.keyId ?? ''
  }
}
