import { test } from '@japa/runner'
import { UserFactory } from '#database/factories/user_factory'
import User from '#models/user'
import Roles from '#enums/roles'

test.group('Users', (group) => {
  group.each.setup(async () => {
    // Clean database before each test
    await User.query().delete()
  })
  test('should list users with pagination', async ({ client, route }) => {
    // Create admin user for authentication
    const admin = await UserFactory.merge({
      role: Roles.ADMIN,
      password: 'Secret2025!',
    }).create()

    // Create some test users
    await UserFactory.createMany(5)

    const response = await client
      .get(route('api.v1.users.index'))
      .withGuard('api')
      .loginAs(admin)
      .redirects(0)

    response.assertStatus(200)
    response.assertBodyContains({
      data: [],
      meta: {
        currentPage: 1,
        perPage: 25,
        total: 6, // admin + 5 users
      }
    })
  })

  test('should list users with custom pagination', async ({ client, route }) => {
    const admin = await UserFactory.merge({
      role: Roles.ADMIN,
      password: 'Secret2025!',
    }).create()

    await UserFactory.createMany(3)

    const response = await client
      .get(route('api.v1.users.index'))
      .qs({ page: 1, limit: 2 })
      .withGuard('api')
      .loginAs(admin)
      .redirects(0)

    response.assertStatus(200)
    response.assertBodyContains({
      meta: {
        currentPage: 1,
        perPage: 2,
        total: 4, // admin + 3 users
      }
    })
  })

  test('should not list users without authentication', async ({ client, route }) => {
    const response = await client
      .get(route('api.v1.users.index'))
      .redirects(0)

    response.assertStatus(401)
  })

  test('should not list users without admin role', async ({ client, route }) => {
    const user = await UserFactory.merge({
      role: Roles.USER,
      password: 'Secret2025!',
    }).create()

    const response = await client
      .get(route('api.v1.users.index'))
      .withGuard('api')
      .loginAs(user)
      .redirects(0)

    response.assertStatus(403)
  })

  test('should show a specific user', async ({ client, route }) => {
    const admin = await UserFactory.merge({
      role: Roles.ADMIN,
      password: 'Secret2025!',
    }).create()

    const user = await UserFactory.create()

    const response = await client
      .get(route('api.v1.users.show', { id: user.id }))
      .withGuard('api')
      .loginAs(admin)
      .redirects(0)

    response.assertStatus(200)
    response.assertBodyContains({
      user: {
        id: user.id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
      }
    })
  })

  test('should return 404 for non-existent user', async ({ client, route }) => {
    const admin = await UserFactory.merge({
      role: Roles.ADMIN,
      password: 'Secret2025!',
    }).create()

    const response = await client
      .get(route('api.v1.users.show', { id: '00000000-0000-0000-0000-000000000000' }))
      .withGuard('api')
      .loginAs(admin)
      .redirects(0)

    response.assertStatus(404)
  })

  test('should create a new user', async ({ client, route }) => {
    const admin = await UserFactory.merge({
      role: Roles.ADMIN,
      password: 'Secret2025!',
    }).create()

    const userData = {
      firstname: 'John',
      lastname: 'Doe',
      email: 'john.doe@example.com',
      password: 'Secret2025!',
      passwordConfirmation: 'Secret2025!',
      role: Roles.USER,
    }

    const response = await client
      .post(route('api.v1.users.store'))
      .withGuard('api')
      .loginAs(admin)
      .fields(userData)
      .redirects(0)

    response.assertStatus(200)
    response.assertBodyContains({
      user: {
        firstname: 'john', // transformed by validator
        lastname: 'doe', // transformed by validator
        email: userData.email,
        role: userData.role,
      }
    })
  })

  test('should not create user with invalid email', async ({ client, route }) => {
    const admin = await UserFactory.merge({
      role: Roles.ADMIN,
      password: 'Secret2025!',
    }).create()

    const userData = {
      firstname: 'John',
      lastname: 'Doe',
      email: 'invalid-email',
      password: 'Secret2025!',
      passwordConfirmation: 'Secret2025!',
    }

    const response = await client
      .post(route('api.v1.users.store'))
      .withGuard('api')
      .loginAs(admin)
      .fields(userData)
      .redirects(0)

    response.assertStatus(422)
    response.assertBodyContains({
      errors: [
        {
          field: 'email',
          message: 'The email field must be a valid email address'
        }
      ]
    })
  })

  test('should not create user with weak password', async ({ client, route }) => {
    const admin = await UserFactory.merge({
      role: Roles.ADMIN,
      password: 'Secret2025!',
    }).create()

    const userData = {
      firstname: 'John',
      lastname: 'Doe',
      email: 'john.doe@example.com',
      password: 'weak',
      passwordConfirmation: 'weak',
    }

    const response = await client
      .post(route('api.v1.users.store'))
      .withGuard('api')
      .loginAs(admin)
      .fields(userData)
      .redirects(0)

    response.assertStatus(422)
    response.assertBodyContains({
      errors: [
        {
          field: 'password',
          message: 'The password field must have at least 8 characters'
        }
      ]
    })
  })

  test('should not create user with missing required fields', async ({ client, route }) => {
    const admin = await UserFactory.merge({
      role: Roles.ADMIN,
      password: 'Secret2025!',
    }).create()

    const userData = {
      firstname: 'John',
      // missing lastname and email
      password: 'Secret2025!',
      passwordConfirmation: 'Secret2025!',
    }

    const response = await client
      .post(route('api.v1.users.store'))
      .withGuard('api')
      .loginAs(admin)
      .fields(userData)
      .redirects(0)

    response.assertStatus(422)
    response.assertBodyContains({
      errors: [
        {
          field: 'lastname',
        },
        {
          field: 'email',
        }
      ]
    })
  })

  test('should update an existing user', async ({ client, route }) => {
    const admin = await UserFactory.merge({
      role: Roles.ADMIN,
      password: 'Secret2025!',
    }).create()

    const user = await UserFactory.create()

    const updateData = {
      firstname: 'Updated',
      lastname: 'Name',
      email: user.email, // Keep same email
    }

    const response = await client
      .put(route('api.v1.users.update', { id: user.id }))
      .withGuard('api')
      .loginAs(admin)
      .fields(updateData)
      .redirects(0)

    response.assertStatus(200)
    response.assertBodyContains({
      user: {
        id: user.id,
        firstname: 'updated', // transformed by validator
        lastname: 'name', // transformed by validator
        email: user.email.toLowerCase(), // email is transformed to lowercase
      }
    })
  })

  test('should update user password', async ({ client, route }) => {
    const admin = await UserFactory.merge({
      role: Roles.ADMIN,
      password: 'Secret2025!',
    }).create()

    const user = await UserFactory.create()

    const updateData = {
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      password: 'NewSecret2025!',
      passwordConfirmation: 'NewSecret2025!',
    }

    const response = await client
      .put(route('api.v1.users.update', { id: user.id }))
      .withGuard('api')
      .loginAs(admin)
      .fields(updateData)
      .redirects(0)

    response.assertStatus(200)
    response.assertBodyContains({
      user: {
        id: user.id,
      }
    })
  })

  test('should not update non-existent user', async ({ client, route }) => {
    const admin = await UserFactory.merge({
      role: Roles.ADMIN,
      password: 'Secret2025!',
    }).create()

    const updateData = {
      firstname: 'Updated',
      lastname: 'Name',
      email: 'test@example.com',
    }

    const response = await client
      .put(route('api.v1.users.update', { id: '00000000-0000-0000-0000-000000000000' }))
      .withGuard('api')
      .loginAs(admin)
      .fields(updateData)
      .redirects(0)

    response.assertStatus(404)
  })

  test('should not update user with invalid data', async ({ client, route }) => {
    const admin = await UserFactory.merge({
      role: Roles.ADMIN,
      password: 'Secret2025!',
    }).create()

    const user = await UserFactory.create()

    const updateData = {
      firstname: 'A', // Too short
      lastname: 'B', // Too short
      email: 'invalid-email', // Invalid email
    }

    const response = await client
      .put(route('api.v1.users.update', { id: user.id }))
      .withGuard('api')
      .loginAs(admin)
      .fields(updateData)
      .redirects(0)

    response.assertStatus(422)
    response.assertBodyContains({
      errors: [
        {
          field: 'firstname',
        },
        {
          field: 'lastname',
        },
        {
          field: 'email',
        }
      ]
    })
  })

  test('should delete an existing user', async ({ client, route }) => {
    const admin = await UserFactory.merge({
      role: Roles.ADMIN,
      password: 'Secret2025!',
    }).create()

    const user = await UserFactory.create()

    const response = await client
      .delete(route('api.v1.users.destroy', { id: user.id }))
      .withGuard('api')
      .loginAs(admin)
      .redirects(0)

    response.assertStatus(204)
  })

  test('should not delete non-existent user', async ({ client, route }) => {
    const admin = await UserFactory.merge({
      role: Roles.ADMIN,
      password: 'Secret2025!',
    }).create()

    const response = await client
      .delete(route('api.v1.users.destroy', { id: '00000000-0000-0000-0000-000000000000' }))
      .withGuard('api')
      .loginAs(admin)
      .redirects(0)

    response.assertStatus(404)
  })

  test('should not allow user to delete themselves', async ({ client, route }) => {
    const admin = await UserFactory.merge({
      role: Roles.ADMIN,
      password: 'Secret2025!',
    }).create()

    const response = await client
      .delete(route('api.v1.users.destroy', { id: admin.id }))
      .withGuard('api')
      .loginAs(admin)
      .redirects(0)

    response.assertStatus(401)
  })

  test('should not delete user without authentication', async ({ client, route }) => {
    const user = await UserFactory.create()

    const response = await client
      .delete(route('api.v1.users.destroy', { id: user.id }))
      .redirects(0)

    response.assertStatus(401)
  })

  test('should not delete user without admin role', async ({ client, route }) => {
    const user = await UserFactory.merge({
      role: Roles.USER,
      password: 'Secret2025!',
    }).create()

    const targetUser = await UserFactory.create()

    const response = await client
      .delete(route('api.v1.users.destroy', { id: targetUser.id }))
      .withGuard('api')
      .loginAs(user)
      .redirects(0)

    response.assertStatus(403)
  })

  test('should create user with admin role when current user is admin', async ({ client, route }) => {
    const admin = await UserFactory.merge({
      role: Roles.ADMIN,
      password: 'Secret2025!',
    }).create()

    const userData = {
      firstname: 'Admin',
      lastname: 'User',
      email: 'admin.user@example.com',
      password: 'Secret2025!',
      passwordConfirmation: 'Secret2025!',
      role: Roles.ADMIN,
    }

    const response = await client
      .post(route('api.v1.users.store'))
      .withGuard('api')
      .loginAs(admin)
      .fields(userData)
      .redirects(0)

    response.assertStatus(200)
    response.assertBodyContains({
      user: {
        role: Roles.ADMIN,
      }
    })
  })

  test('should not allow non-admin to create admin user', async ({ client, route }) => {
    const user = await UserFactory.merge({
      role: Roles.USER,
      password: 'Secret2025!',
    }).create()

    const userData = {
      firstname: 'Admin',
      lastname: 'User',
      email: 'admin.user@example.com',
      password: 'Secret2025!',
      passwordConfirmation: 'Secret2025!',
      role: Roles.ADMIN,
    }

    const response = await client
      .post(route('api.v1.users.store'))
      .withGuard('api')
      .loginAs(user)
      .fields(userData)
      .redirects(0)

    response.assertStatus(403)
  })

  test('should disable user', async ({ client, route }) => {
    const admin = await UserFactory.merge({
      role: Roles.ADMIN,
      password: 'Secret2025!',
    }).create()

    const user = await UserFactory.create()

    const updateData = {
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      disabled: true,
    }

    const response = await client
      .put(route('api.v1.users.update', { id: user.id }))
      .withGuard('api')
      .loginAs(admin)
      .fields(updateData)
      .redirects(0)

    response.assertStatus(200)
    response.assertBodyContains({
      user: {
        id: user.id,
        disabled: true,
      }
    })
  })
})
