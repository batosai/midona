import { ApiProperty } from '@foadonis/openapi/decorators'

export class Login {
  @ApiProperty()
  declare email: string
  @ApiProperty()
  declare password: string
}

export class LoginResponse {
  @ApiProperty({ example: 'bearer' })
  declare type: 'bearer';

  @ApiProperty({ nullable: true, type: String })
  declare name: string | null;

  @ApiProperty({ example: 'xxxxxx' })
  declare token: string;

  @ApiProperty({ type: [String], example: ['*'] })
  declare abilities: string;

  @ApiProperty({ nullable: true, type: String })
  declare lastUsedAt: string | null;

  @ApiProperty({ nullable: true, type: String })
  declare expiresAt: string | null;
}

export class ForgotPassword {
  @ApiProperty({ example: 'jeremy@chaufourier.fr' })
  declare email: string;

  @ApiProperty({ example: 'https://example.com' })
  declare resetPasswordUrl: string;
}

export class ResetPassword {
  @ApiProperty({ example: 'Secret123!' })
  declare password: string;

  @ApiProperty({ example: 'Secret123!' })
  declare passwordConfirmation: string;
}
