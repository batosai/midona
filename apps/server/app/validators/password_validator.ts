import vine from '@vinejs/vine'

export const PASSWORD_MIN_LENGTH = 8
export const PASSWORD_MAX_LENGTH = 255

export const ForgotPasswordValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email(),
    resetPasswordUrl: vine.string().trim().url(),
  })
)

export const ResetPasswordValidator = vine.compile(
  vine.object({
    password: vine
      .string()
      .confirmed({
        confirmationField: 'passwordConfirmation'
      })
      .minLength(PASSWORD_MIN_LENGTH)
      .maxLength(PASSWORD_MAX_LENGTH)
      .oneLowerCaseAtLeast()
      .oneNumericAtLeast()
      .oneUpperCaseAtLeast()
      .oneSpecialCharacterAtLeast(),
  })
)
