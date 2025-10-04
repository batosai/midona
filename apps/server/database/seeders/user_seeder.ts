import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Roles from '#enums/roles'
import User from '#models/user'

export default class extends BaseSeeder {
  async run() {
    const user = await User.create({
      role: Roles.ADMIN,
      lastname: 'Chaufourier',
      firstname: 'Jeremy',
      email: 'jeremy@chaufourier.fr',
      password: 'secret',
    })

    await user.save()
  }
}
