import { ApiProperty } from '@foadonis/openapi/decorators'
import User from '#models/user'

export default function Response() {
  abstract class UserResponse {
    @ApiProperty()
    declare user: User
  }

  return UserResponse
}
