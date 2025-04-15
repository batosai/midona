import type { HttpContext } from '@adonisjs/core/http'

// import { DocumentValidator } from '#validators/document'


import User from '#models/user'

export default class UploadsController {

  async handle({ request, response }: HttpContext) {
    const user = await User.first()

    // const payload = await request.validateUsing(DocumentValidator)

    const files = request.file('uploads', {
      size: '2mb',
    })

    if (files && !files.isValid) {
      return response.badRequest({
        errors: files.errors[0]
      })
    }


    // const uploads = request.files('uploads')
    // console.log(uploads)

    return response.json({
      status: 'success',
      message: 'File uploaded successfully',
      fileInfo: {
        name: 'name.jpeg',
        size: 58745,
        url: `/uploads/name.jpeg`
      }
    })
  }
}
