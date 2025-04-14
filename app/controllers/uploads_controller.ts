import type { HttpContext } from '@adonisjs/core/http'

import User from '#models/user'

export default class UploadsController {

  async handle({ request, response }: HttpContext) {
    const user = await User.first()

    const uploads = request.files('uploads')
    console.log(uploads)

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
