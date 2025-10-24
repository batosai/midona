import { test } from '@japa/runner'
import { UserFactory } from '#database/factories/user_factory'
import { ContentFactory } from '#database/factories/content_factory'
import User from '#models/user'
import Content from '#models/content'
import Roles from '#enums/roles'
import ContentTypes from '#enums/content_types'

test.group('Contents', (group) => {
  group.each.setup(async () => {
    // Clean database before each test
    await Content.query().delete()
    await User.query().delete()
  })

  test('should list contents with pagination', async ({ client, route }) => {
    // Create admin user for authentication
    const admin = await UserFactory.merge({
      role: Roles.ADMIN,
      password: 'Secret2025!',
    }).create()

    // Create some test contents
    await ContentFactory.merge({ userId: admin.id }).createMany(5)

    const response = await client
      .get(route('api.v1.contents.index'))
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

  test('should list contents with custom pagination', async ({ client, route }) => {
    const admin = await UserFactory.merge({
      role: Roles.ADMIN,
      password: 'Secret2025!',
    }).create()

    await ContentFactory.merge({ userId: admin.id }).createMany(3)

    const response = await client
      .get(route('api.v1.contents.index'))
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

  test('should filter contents by type', async ({ client, route }) => {
    const admin = await UserFactory.merge({
      role: Roles.ADMIN,
      password: 'Secret2025!',
    }).create()

    // Create contents with different types
    await ContentFactory.merge({
      userId: admin.id,
      contentType: ContentTypes.NOTE
    }).createMany(2)

    await ContentFactory.merge({
      userId: admin.id,
      contentType: ContentTypes.BOOKMARK
    }).createMany(3)

    const response = await client
      .get(route('api.v1.contents.index'))
      .qs({ contentType: ContentTypes.NOTE })
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

  test('should not list contents without authentication', async ({ client, route }) => {
    const response = await client
      .get(route('api.v1.contents.index'))
      .redirects(0)

    response.assertStatus(401)
  })

  test('should show a specific content', async ({ client, route }) => {
    const admin = await UserFactory.merge({
      role: Roles.ADMIN,
      password: 'Secret2025!',
    }).create()

    const content = await ContentFactory.merge({ userId: admin.id }).create()

    const response = await client
      .get(route('api.v1.contents.show', { id: content.id }))
      .withGuard('api')
      .loginAs(admin)
      .redirects(0)

    response.assertStatus(200)
    response.assertBodyContains({
      content: {
        id: content.id,
        title: content.title,
        slug: content.slug,
        contentType: content.contentType,
      }
    })
  })

  test('should return 404 for non-existent content', async ({ client, route }) => {
    const admin = await UserFactory.merge({
      role: Roles.ADMIN,
      password: 'Secret2025!',
    }).create()

    const response = await client
      .get(route('api.v1.contents.show', { id: '00000000-0000-0000-0000-000000000000' }))
      .withGuard('api')
      .loginAs(admin)
      .redirects(0)

    response.assertStatus(404)
  })

  test('should create a new content', async ({ client, route }) => {
    const user = await UserFactory.merge({
      role: Roles.USER,
      password: 'Secret2025!',
    }).create()

    const contentData = {
      title: 'Test Note',
      slug: 'test-note',
      text: 'This is a test note content',
      contentType: ContentTypes.NOTE,
    }

    const response = await client
      .post(route('api.v1.contents.store'))
      .withGuard('api')
      .loginAs(user)
      .json(contentData)
      .redirects(0)

    response.assertStatus(200)
    response.assertBodyContains({
      content: {
        title: contentData.title,
        slug: contentData.slug,
        text: contentData.text,
        contentType: contentData.contentType,
        userId: user.id,
      }
    })
  })

  test('should not create content with invalid type', async ({ client, route }) => {
    const user = await UserFactory.merge({
      role: Roles.USER,
      password: 'Secret2025!',
    }).create()

    const contentData = {
      title: 'Test Content',
      slug: 'test-content',
      text: 'This is a test content',
      contentType: 'invalid-type',
    }

    const response = await client
      .post(route('api.v1.contents.store'))
      .withGuard('api')
      .loginAs(user)
      .json(contentData)
      .redirects(0)

    response.assertStatus(422)
    response.assertBodyContains({
      errors: [
        {
          field: 'contentType',
        }
      ]
    })
  })

  test('should not create content with invalid slug format', async ({ client, route }) => {
    const user = await UserFactory.merge({
      role: Roles.USER,
      password: 'Secret2025!',
    }).create()

    const contentData = {
      title: 'Test Content',
      slug: 'Invalid Slug!', // Invalid format
      text: 'This is a test content',
      contentType: ContentTypes.NOTE,
    }

    const response = await client
      .post(route('api.v1.contents.store'))
      .withGuard('api')
      .loginAs(user)
      .json(contentData)
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

  test('should not create content with duplicate slug', async ({ client, route }) => {
    const user = await UserFactory.merge({
      role: Roles.USER,
      password: 'Secret2025!',
    }).create()

    // Create first content
    await ContentFactory.merge({
      userId: user.id,
      slug: 'duplicate-slug'
    }).create()

    const contentData = {
      title: 'Another Content',
      slug: 'duplicate-slug', // Same slug
      text: 'This is another content',
      contentType: ContentTypes.NOTE,
    }

    const response = await client
      .post(route('api.v1.contents.store'))
      .withGuard('api')
      .loginAs(user)
      .json(contentData)
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

  test('should not create content with missing required fields', async ({ client, route }) => {
    const user = await UserFactory.merge({
      role: Roles.USER,
      password: 'Secret2025!',
    }).create()

    const contentData = {
      title: 'Test Content',
      // missing slug and type
    }

    const response = await client
      .post(route('api.v1.contents.store'))
      .withGuard('api')
      .loginAs(user)
      .json(contentData)
      .redirects(0)

    response.assertStatus(422)
    response.assertBodyContains({
      errors: [
        {
          field: 'slug',
        },
        {
          field: 'contentType',
        }
      ]
    })
  })

  test('should update an existing content', async ({ client, route }) => {
    const user = await UserFactory.merge({
      role: Roles.USER,
      password: 'Secret2025!',
    }).create()

    const content = await ContentFactory.merge({ userId: user.id }).create()

    const updateData = {
      title: 'Updated Content',
      slug: 'updated-content',
      text: 'Updated content text',
      contentType: ContentTypes.BOOKMARK,
    }

    const response = await client
      .put(route('api.v1.contents.update', { id: content.id }))
      .withGuard('api')
      .loginAs(user)
      .json(updateData)
      .redirects(0)

    response.assertStatus(200)
    response.assertBodyContains({
      content: {
        id: content.id,
        title: updateData.title,
        slug: updateData.slug,
        text: updateData.text,
        contentType: updateData.contentType,
      }
    })
  })

  test('should not update non-existent content', async ({ client, route }) => {
    const user = await UserFactory.merge({
      role: Roles.USER,
      password: 'Secret2025!',
    }).create()

    const updateData = {
      title: 'Updated Content',
      slug: 'updated-content',
      text: 'Updated content text',
      contentType: ContentTypes.BOOKMARK,
    }

    const response = await client
      .put(route('api.v1.contents.update', { id: '00000000-0000-0000-0000-000000000000' }))
      .withGuard('api')
      .loginAs(user)
      .json(updateData)
      .redirects(0)

    response.assertStatus(404)
  })

  test('should not update content with invalid data', async ({ client, route }) => {
    const user = await UserFactory.merge({
      role: Roles.USER,
      password: 'Secret2025!',
    }).create()

    const content = await ContentFactory.merge({ userId: user.id }).create()

    const updateData = {
      title: 'A', // Too short
      slug: 'Invalid Slug!', // Invalid format
      contentType: 'invalid-type', // Invalid type
    }

    const response = await client
      .put(route('api.v1.contents.update', { id: content.id }))
      .withGuard('api')
      .loginAs(user)
      .json(updateData)
      .redirects(0)

    response.assertStatus(422)
    response.assertBodyContains({
      errors: [
        {
          field: 'title',
        },
        {
          field: 'slug',
        },
        {
          field: 'contentType',
        }
      ]
    })
  })

  test('should delete an existing content', async ({ client, route }) => {
    const user = await UserFactory.merge({
      role: Roles.USER,
      password: 'Secret2025!',
    }).create()

    const content = await ContentFactory.merge({ userId: user.id }).create()

    const response = await client
      .delete(route('api.v1.contents.destroy', { id: content.id }))
      .withGuard('api')
      .loginAs(user)
      .redirects(0)

    response.assertStatus(204)
  })

  test('should not delete non-existent content', async ({ client, route }) => {
    const user = await UserFactory.merge({
      role: Roles.USER,
      password: 'Secret2025!',
    }).create()

    const response = await client
      .delete(route('api.v1.contents.destroy', { id: '00000000-0000-0000-0000-000000000000' }))
      .withGuard('api')
      .loginAs(user)
      .redirects(0)

    response.assertStatus(404)
  })

  test('should not delete content without authentication', async ({ client, route }) => {
    const user = await UserFactory.merge({
      role: Roles.USER,
      password: 'Secret2025!',
    }).create()

    const content = await ContentFactory.merge({ userId: user.id }).create()

    const response = await client
      .delete(route('api.v1.contents.destroy', { id: content.id }))
      .redirects(0)

    response.assertStatus(401)
  })

  test('should not allow user to access other user contents', async ({ client, route }) => {
    const user1 = await UserFactory.merge({
      role: Roles.USER,
      password: 'Secret2025!',
    }).create()

    const user2 = await UserFactory.merge({
      role: Roles.USER,
      password: 'Secret2025!',
    }).create()

    const content = await ContentFactory.merge({ userId: user1.id }).create()

    // User2 tries to access user1's content
    const response = await client
      .get(route('api.v1.contents.show', { id: content.id }))
      .withGuard('api')
      .loginAs(user2)
      .redirects(0)

    response.assertStatus(403)
  })

  test('should not allow user to update other user contents', async ({ client, route }) => {
    const user1 = await UserFactory.merge({
      role: Roles.USER,
      password: 'Secret2025!',
    }).create()

    const user2 = await UserFactory.merge({
      role: Roles.USER,
      password: 'Secret2025!',
    }).create()

    const content = await ContentFactory.merge({ userId: user1.id }).create()

    const updateData = {
      title: 'Hacked Content',
      slug: 'hacked-content',
      text: 'This content was hacked',
      contentType: ContentTypes.NOTE,
    }

    // User2 tries to update user1's content
    const response = await client
      .put(route('api.v1.contents.update', { id: content.id }))
      .withGuard('api')
      .loginAs(user2)
      .json(updateData)
      .redirects(0)

    response.assertStatus(403)
  })

  test('should not allow user to delete other user contents', async ({ client, route }) => {
    const user1 = await UserFactory.merge({
      role: Roles.USER,
      password: 'Secret2025!',
    }).create()

    const user2 = await UserFactory.merge({
      role: Roles.USER,
      password: 'Secret2025!',
    }).create()

    const content = await ContentFactory.merge({ userId: user1.id }).create()

    // User2 tries to delete user1's content
    const response = await client
      .delete(route('api.v1.contents.destroy', { id: content.id }))
      .withGuard('api')
      .loginAs(user2)
      .redirects(0)

    response.assertStatus(403)
  })

  test('should allow admin to access all contents', async ({ client, route }) => {
    const admin = await UserFactory.merge({
      role: Roles.ADMIN,
      password: 'Secret2025!',
    }).create()

    const user = await UserFactory.merge({
      role: Roles.USER,
      password: 'Secret2025!',
    }).create()

    const content = await ContentFactory.merge({ userId: user.id }).create()

    // Admin can access user's content
    const response = await client
      .get(route('api.v1.contents.show', { id: content.id }))
      .withGuard('api')
      .loginAs(admin)
      .redirects(0)

    response.assertStatus(200)
    response.assertBodyContains({
      content: {
        id: content.id,
      }
    })
  })

  test('should allow admin to update all contents', async ({ client, route }) => {
    const admin = await UserFactory.merge({
      role: Roles.ADMIN,
      password: 'Secret2025!',
    }).create()

    const user = await UserFactory.merge({
      role: Roles.USER,
      password: 'Secret2025!',
    }).create()

    const content = await ContentFactory.merge({ userId: user.id }).create()

    const updateData = {
      title: 'Admin Updated Content',
      slug: 'admin-updated-content',
      text: 'This content was updated by admin',
      contentType: ContentTypes.BOOKMARK,
    }

    // Admin can update user's content
    const response = await client
      .put(route('api.v1.contents.update', { id: content.id }))
      .withGuard('api')
      .loginAs(admin)
      .json(updateData)
      .redirects(0)

    response.assertStatus(200)
    response.assertBodyContains({
      content: {
        id: content.id,
        title: updateData.title,
        slug: updateData.slug,
        text: updateData.text,
        contentType: updateData.contentType,
      }
    })
  })

  test('should allow admin to delete all contents', async ({ client, route }) => {
    const admin = await UserFactory.merge({
      role: Roles.ADMIN,
      password: 'Secret2025!',
    }).create()

    const user = await UserFactory.merge({
      role: Roles.USER,
      password: 'Secret2025!',
    }).create()

    const content = await ContentFactory.merge({ userId: user.id }).create()

    // Admin can delete user's content
    const response = await client
      .delete(route('api.v1.contents.destroy', { id: content.id }))
      .withGuard('api')
      .loginAs(admin)
      .redirects(0)

    response.assertStatus(204)
  })

  test('should create content with extra data', async ({ client, route }) => {
    const user = await UserFactory.merge({
      role: Roles.USER,
      password: 'Secret2025!',
    }).create()

    const contentData = {
      title: 'Bookmark Content',
      slug: 'bookmark-content',
      text: 'This is a bookmark',
      contentType: ContentTypes.BOOKMARK,
      extra: {
        url: 'https://example.com',
        tags: ['web', 'bookmark'],
        metadata: {
          author: 'John Doe',
          publishedAt: '2024-01-01'
        }
      }
    }

    const response = await client
      .post(route('api.v1.contents.store'))
      .withGuard('api')
      .loginAs(user)
      .json(contentData)
      .redirects(0)

    response.assertStatus(200)
    response.assertBodyContains({
      content: {
        title: contentData.title,
        slug: contentData.slug,
        text: contentData.text,
        contentType: contentData.contentType,
        extra: contentData.extra,
        userId: user.id,
      }
    })
  })

  test('should create content with different types', async ({ client, route }) => {
    const user = await UserFactory.merge({
      role: Roles.USER,
      password: 'Secret2025!',
    }).create()

    const contentTypes = [
      ContentTypes.NOTE,
      ContentTypes.BOOKMARK,
      ContentTypes.VIDEO,
      ContentTypes.AUDIO,
      ContentTypes.PHOTO,
      ContentTypes.BOOK,
      ContentTypes.VIDEO_GAME,
      ContentTypes.POST,
    ]

    for (const type of contentTypes) {
      const contentData = {
        title: `Test ${type}`,
        slug: `test-${type.replace(/_/g, '-')}`,
        text: `This is a ${type}`,
        contentType: type,
      }

      const response = await client
        .post(route('api.v1.contents.store'))
        .withGuard('api')
        .loginAs(user)
        .json(contentData)
        .redirects(0)

      response.assertStatus(200)
      response.assertBodyContains({
        content: {
          contentType: type,
        }
      })
    }
  })
})
