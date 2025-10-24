import { test } from '@japa/runner'
import { UserFactory } from '#database/factories/user_factory'
import { TermFactory } from '#database/factories/term_factory'
import User from '#models/user'
import Term from '#models/term'
import Roles from '#enums/roles'
import Taxonomies from '#enums/taxonomies'

test.group('Terms', (group) => {
  group.each.setup(async () => {
    // Clean database before each test
    await Term.query().delete()
    await User.query().delete()
  })

  test('should list terms with pagination', async ({ client, route }) => {
    // Create admin user for authentication
    const admin = await UserFactory.merge({
      role: Roles.ADMIN,
      password: 'Secret2025!',
    }).create()

    // Create some test terms
    await TermFactory.merge({ userId: admin.id }).createMany(5)

    const response = await client
      .get(route('api.v1.terms.index'))
      .withGuard('api')
      .loginAs(admin)
      .redirects(0)

    response.assertStatus(200)
    response.assertBodyContains({
      data: [],
      meta: {
        currentPage: 1,
        perPage: 25,
        total: 5,
      }
    })
  })

  test('should list terms with custom pagination', async ({ client, route }) => {
    const admin = await UserFactory.merge({
      role: Roles.ADMIN,
      password: 'Secret2025!',
    }).create()

    await TermFactory.merge({ userId: admin.id }).createMany(3)

    const response = await client
      .get(route('api.v1.terms.index'))
      .qs({ page: 1, limit: 2 })
      .withGuard('api')
      .loginAs(admin)
      .redirects(0)

    response.assertStatus(200)
    response.assertBodyContains({
      meta: {
        currentPage: 1,
        perPage: 2,
        total: 3,
      }
    })
  })

  test('should filter terms by taxonomy', async ({ client, route }) => {
    const admin = await UserFactory.merge({
      role: Roles.ADMIN,
      password: 'Secret2025!',
    }).create()

    // Create terms with different taxonomies
    await TermFactory.merge({
      userId: admin.id,
      taxonomy: Taxonomies.CATEGORY
    }).createMany(2)

    await TermFactory.merge({
      userId: admin.id,
      taxonomy: Taxonomies.TAG
    }).createMany(3)

    const response = await client
      .get(route('api.v1.terms.index'))
      .qs({ taxonomy: Taxonomies.CATEGORY })
      .withGuard('api')
      .loginAs(admin)
      .redirects(0)

    response.assertStatus(200)
    response.assertBodyContains({
      meta: {
        total: 2,
      }
    })
  })

  test('should not list terms without authentication', async ({ client, route }) => {
    const response = await client
      .get(route('api.v1.terms.index'))
      .redirects(0)

    response.assertStatus(401)
  })

  test('should show a specific term', async ({ client, route }) => {
    const admin = await UserFactory.merge({
      role: Roles.ADMIN,
      password: 'Secret2025!',
    }).create()

    const term = await TermFactory.merge({ userId: admin.id }).create()

    const response = await client
      .get(route('api.v1.terms.show', { id: term.id }))
      .withGuard('api')
      .loginAs(admin)
      .redirects(0)

    response.assertStatus(200)
    response.assertBodyContains({
      term: {
        id: term.id,
        name: term.name,
        slug: term.slug,
        taxonomy: term.taxonomy,
      }
    })
  })

  test('should return 404 for non-existent term', async ({ client, route }) => {
    const admin = await UserFactory.merge({
      role: Roles.ADMIN,
      password: 'Secret2025!',
    }).create()

    const response = await client
      .get(route('api.v1.terms.show', { id: '00000000-0000-0000-0000-000000000000' }))
      .withGuard('api')
      .loginAs(admin)
      .redirects(0)

    response.assertStatus(404)
  })

  test('should create a new term', async ({ client, route }) => {
    const user = await UserFactory.merge({
      role: Roles.USER,
      password: 'Secret2025!',
    }).create()

    const termData = {
      name: 'Test Category',
      slug: 'test-category',
      taxonomy: Taxonomies.CATEGORY,
    }

    const response = await client
      .post(route('api.v1.terms.store'))
      .withGuard('api')
      .loginAs(user)
      .fields(termData)
      .redirects(0)

    response.assertStatus(200)
    response.assertBodyContains({
      term: {
        name: termData.name,
        slug: termData.slug,
        taxonomy: termData.taxonomy,
        userId: user.id,
      }
    })
  })

  test('should not create term with invalid taxonomy', async ({ client, route }) => {
    const user = await UserFactory.merge({
      role: Roles.USER,
      password: 'Secret2025!',
    }).create()

    const termData = {
      name: 'Test Category',
      slug: 'test-category',
      taxonomy: 'invalid-taxonomy',
    }

    const response = await client
      .post(route('api.v1.terms.store'))
      .withGuard('api')
      .loginAs(user)
      .fields(termData)
      .redirects(0)

    response.assertStatus(422)
    response.assertBodyContains({
      errors: [
        {
          field: 'taxonomy',
        }
      ]
    })
  })

  test('should not create term with invalid slug format', async ({ client, route }) => {
    const user = await UserFactory.merge({
      role: Roles.USER,
      password: 'Secret2025!',
    }).create()

    const termData = {
      name: 'Test Category',
      slug: 'Invalid Slug!', // Invalid format
      taxonomy: Taxonomies.CATEGORY,
    }

    const response = await client
      .post(route('api.v1.terms.store'))
      .withGuard('api')
      .loginAs(user)
      .fields(termData)
      .redirects(0)

    response.assertStatus(422)
    response.assertBodyContains({
      errors: [
        {
          field: 'slug',
        }
      ]
    })
  })

  test('should not create term with duplicate slug', async ({ client, route }) => {
    const user = await UserFactory.merge({
      role: Roles.USER,
      password: 'Secret2025!',
    }).create()

    // Create first term
    await TermFactory.merge({
      userId: user.id,
      slug: 'duplicate-slug'
    }).create()

    const termData = {
      name: 'Another Term',
      slug: 'duplicate-slug', // Same slug
      taxonomy: Taxonomies.CATEGORY,
    }

    const response = await client
      .post(route('api.v1.terms.store'))
      .withGuard('api')
      .loginAs(user)
      .fields(termData)
      .redirects(0)

    response.assertStatus(422)
    response.assertBodyContains({
      errors: [
        {
          field: 'slug',
        }
      ]
    })
  })

  test('should not create term with missing required fields', async ({ client, route }) => {
    const user = await UserFactory.merge({
      role: Roles.USER,
      password: 'Secret2025!',
    }).create()

    const termData = {
      name: 'Test Category',
      // missing slug and taxonomy
    }

    const response = await client
      .post(route('api.v1.terms.store'))
      .withGuard('api')
      .loginAs(user)
      .fields(termData)
      .redirects(0)

    response.assertStatus(422)
    response.assertBodyContains({
      errors: [
        {
          field: 'slug',
        },
        {
          field: 'taxonomy',
        }
      ]
    })
  })

  test('should update an existing term', async ({ client, route }) => {
    const user = await UserFactory.merge({
      role: Roles.USER,
      password: 'Secret2025!',
    }).create()

    const term = await TermFactory.merge({ userId: user.id }).create()

    const updateData = {
      name: 'Updated Term',
      slug: 'updated-term',
      taxonomy: Taxonomies.TAG,
    }

    const response = await client
      .put(route('api.v1.terms.update', { id: term.id }))
      .withGuard('api')
      .loginAs(user)
      .fields(updateData)
      .redirects(0)

    response.assertStatus(200)
    response.assertBodyContains({
      term: {
        id: term.id,
        name: updateData.name,
        slug: updateData.slug,
        taxonomy: updateData.taxonomy,
      }
    })
  })

  test('should not update non-existent term', async ({ client, route }) => {
    const user = await UserFactory.merge({
      role: Roles.USER,
      password: 'Secret2025!',
    }).create()

    const updateData = {
      name: 'Updated Term',
      slug: 'updated-term',
      taxonomy: Taxonomies.TAG,
    }

    const response = await client
      .put(route('api.v1.terms.update', { id: '00000000-0000-0000-0000-000000000000' }))
      .withGuard('api')
      .loginAs(user)
      .fields(updateData)
      .redirects(0)

    response.assertStatus(404)
  })

  test('should not update term with invalid data', async ({ client, route }) => {
    const user = await UserFactory.merge({
      role: Roles.USER,
      password: 'Secret2025!',
    }).create()

    const term = await TermFactory.merge({ userId: user.id }).create()

    const updateData = {
      name: 'A', // Too short
      slug: 'Invalid Slug!', // Invalid format
      taxonomy: 'invalid-taxonomy', // Invalid taxonomy
    }

    const response = await client
      .put(route('api.v1.terms.update', { id: term.id }))
      .withGuard('api')
      .loginAs(user)
      .fields(updateData)
      .redirects(0)

    response.assertStatus(422)
    response.assertBodyContains({
      errors: [
        {
          field: 'name',
        },
        {
          field: 'slug',
        },
        {
          field: 'taxonomy',
        }
      ]
    })
  })

  test('should delete an existing term', async ({ client, route }) => {
    const user = await UserFactory.merge({
      role: Roles.USER,
      password: 'Secret2025!',
    }).create()

    const term = await TermFactory.merge({ userId: user.id }).create()

    const response = await client
      .delete(route('api.v1.terms.destroy', { id: term.id }))
      .withGuard('api')
      .loginAs(user)
      .redirects(0)

    response.assertStatus(204)
  })

  test('should not delete non-existent term', async ({ client, route }) => {
    const user = await UserFactory.merge({
      role: Roles.USER,
      password: 'Secret2025!',
    }).create()

    const response = await client
      .delete(route('api.v1.terms.destroy', { id: '00000000-0000-0000-0000-000000000000' }))
      .withGuard('api')
      .loginAs(user)
      .redirects(0)

    response.assertStatus(404)
  })

  test('should not delete term without authentication', async ({ client, route }) => {
    const user = await UserFactory.merge({
      role: Roles.USER,
      password: 'Secret2025!',
    }).create()

    const term = await TermFactory.merge({ userId: user.id }).create()

    const response = await client
      .delete(route('api.v1.terms.destroy', { id: term.id }))
      .redirects(0)

    response.assertStatus(401)
  })

  test('should not allow user to access other user terms', async ({ client, route }) => {
    const user1 = await UserFactory.merge({
      role: Roles.USER,
      password: 'Secret2025!',
    }).create()

    const user2 = await UserFactory.merge({
      role: Roles.USER,
      password: 'Secret2025!',
    }).create()

    const term = await TermFactory.merge({ userId: user1.id }).create()

    // User2 tries to access user1's term
    const response = await client
      .get(route('api.v1.terms.show', { id: term.id }))
      .withGuard('api')
      .loginAs(user2)
      .redirects(0)

    response.assertStatus(403)
  })

  test('should not allow user to update other user terms', async ({ client, route }) => {
    const user1 = await UserFactory.merge({
      role: Roles.USER,
      password: 'Secret2025!',
    }).create()

    const user2 = await UserFactory.merge({
      role: Roles.USER,
      password: 'Secret2025!',
    }).create()

    const term = await TermFactory.merge({ userId: user1.id }).create()

    const updateData = {
      name: 'Hacked Term',
      slug: 'hacked-term',
      taxonomy: Taxonomies.TAG,
    }

    // User2 tries to update user1's term
    const response = await client
      .put(route('api.v1.terms.update', { id: term.id }))
      .withGuard('api')
      .loginAs(user2)
      .fields(updateData)
      .redirects(0)

    response.assertStatus(403)
  })

  test('should not allow user to delete other user terms', async ({ client, route }) => {
    const user1 = await UserFactory.merge({
      role: Roles.USER,
      password: 'Secret2025!',
    }).create()

    const user2 = await UserFactory.merge({
      role: Roles.USER,
      password: 'Secret2025!',
    }).create()

    const term = await TermFactory.merge({ userId: user1.id }).create()

    // User2 tries to delete user1's term
    const response = await client
      .delete(route('api.v1.terms.destroy', { id: term.id }))
      .withGuard('api')
      .loginAs(user2)
      .redirects(0)

    response.assertStatus(403)
  })

  test('should allow admin to access all terms', async ({ client, route }) => {
    const admin = await UserFactory.merge({
      role: Roles.ADMIN,
      password: 'Secret2025!',
    }).create()

    const user = await UserFactory.merge({
      role: Roles.USER,
      password: 'Secret2025!',
    }).create()

    const term = await TermFactory.merge({ userId: user.id }).create()

    // Admin can access user's term
    const response = await client
      .get(route('api.v1.terms.show', { id: term.id }))
      .withGuard('api')
      .loginAs(admin)
      .redirects(0)

    response.assertStatus(200)
    response.assertBodyContains({
      term: {
        id: term.id,
      }
    })
  })

  test('should allow admin to update all terms', async ({ client, route }) => {
    const admin = await UserFactory.merge({
      role: Roles.ADMIN,
      password: 'Secret2025!',
    }).create()

    const user = await UserFactory.merge({
      role: Roles.USER,
      password: 'Secret2025!',
    }).create()

    const term = await TermFactory.merge({ userId: user.id }).create()

    const updateData = {
      name: 'Admin Updated Term',
      slug: 'admin-updated-term',
      taxonomy: Taxonomies.TAG,
    }

    // Admin can update user's term
    const response = await client
      .put(route('api.v1.terms.update', { id: term.id }))
      .withGuard('api')
      .loginAs(admin)
      .fields(updateData)
      .redirects(0)

    response.assertStatus(200)
    response.assertBodyContains({
      term: {
        id: term.id,
        name: updateData.name,
        slug: updateData.slug,
        taxonomy: updateData.taxonomy,
      }
    })
  })

  test('should allow admin to delete all terms', async ({ client, route }) => {
    const admin = await UserFactory.merge({
      role: Roles.ADMIN,
      password: 'Secret2025!',
    }).create()

    const user = await UserFactory.merge({
      role: Roles.USER,
      password: 'Secret2025!',
    }).create()

    const term = await TermFactory.merge({ userId: user.id }).create()

    // Admin can delete user's term
    const response = await client
      .delete(route('api.v1.terms.destroy', { id: term.id }))
      .withGuard('api')
      .loginAs(admin)
      .redirects(0)

    response.assertStatus(204)
  })

  test('should create term with parent relationship', async ({ client, route }) => {
    const user = await UserFactory.merge({
      role: Roles.USER,
      password: 'Secret2025!',
    }).create()

    // Create parent term
    const parentTerm = await TermFactory.merge({
      userId: user.id,
      taxonomy: Taxonomies.CATEGORY
    }).create()

    const termData = {
      name: 'Child Category',
      slug: 'child-category',
      taxonomy: Taxonomies.CATEGORY,
      parentId: parentTerm.id,
    }

    const response = await client
      .post(route('api.v1.terms.store'))
      .withGuard('api')
      .loginAs(user)
      .fields(termData)
      .redirects(0)

    response.assertStatus(200)
    response.assertBodyContains({
      term: {
        name: termData.name,
        slug: termData.slug,
        taxonomy: termData.taxonomy,
        parentId: parentTerm.id,
        userId: user.id,
      }
    })
  })
})
