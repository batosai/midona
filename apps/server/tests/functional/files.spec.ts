import { test } from '@japa/runner'
import { UserFactory } from '#database/factories/user_factory'
import { ContentFactory } from '#database/factories/content_factory'
import drive from '@adonisjs/drive/services/main'
import fileGenerator from '@poppinss/file-generator'


import User from '#models/user'
import Content from '#models/content'
import File from '#models/file'
import Roles from '#enums/roles'

test.group('Files', (group) => {
  group.each.setup(async () => {
    // Clean database before each test
    await File.query().delete()
    await Content.query().delete()
    await User.query().delete()
  })

  // ============================================
  // Tests for upload (multipart file)
  // ============================================

  test('should upload a file to a content', async ({ client, route, cleanup }) => {
    drive.fake('fs')
    cleanup(() => drive.restore('fs'))

    const user = await UserFactory.merge({
      role: Roles.USER,
      password: 'Secret2025!',
    }).create()

    const content = await ContentFactory.merge({ userId: user.id }).create()

    const { contents, mime, name } = await fileGenerator.generatePng('1mb')

    const response = await client
      .post(route('api.v1.contents.files.upload', { content_id: content.id }))
      .withGuard('api')
      .loginAs(user)
      .file('file_data', contents, {
        filename: name,
        contentType: mime,
      })
      .redirects(0)

    response.assertStatus(200)
    response.assertBodyContains({
      file: {
        contentId: content.id,
      }
    })
  })

  test('should not upload file without authentication', async ({ client, route }) => {
    const user = await UserFactory.merge({
      role: Roles.USER,
      password: 'Secret2025!',
    }).create()

    const content = await ContentFactory.merge({ userId: user.id }).create()

    const fileBuffer = Buffer.from('test file content')
    const fileName = 'test.txt'

    const response = await client
      .post(route('api.v1.contents.files.upload', { content_id: content.id }))
      .file('file_data', fileBuffer, { filename: fileName })
      .redirects(0)

    response.assertStatus(401)
  })

  test('should not upload file to non-existent content', async ({ client, route }) => {
    const user = await UserFactory.merge({
      role: Roles.USER,
      password: 'Secret2025!',
    }).create()

    const fakeContentId = '00000000-0000-0000-0000-000000000000'
    const fileBuffer = Buffer.from('test file content')
    const fileName = 'test.txt'

    const response = await client
      .post(route('api.v1.contents.files.upload', { content_id: fakeContentId }))
      .withGuard('api')
      .loginAs(user)
      .file('file_data', fileBuffer, { filename: fileName })
      .redirects(0)

    response.assertStatus(404)
  })

  test('should not upload file without file_data field', async ({ client, route }) => {
    const user = await UserFactory.merge({
      role: Roles.USER,
      password: 'Secret2025!',
    }).create()

    const content = await ContentFactory.merge({ userId: user.id }).create()

    const response = await client
      .post(route('api.v1.contents.files.upload', { content_id: content.id }))
      .withGuard('api')
      .loginAs(user)
      .redirects(0)

    response.assertStatus(422)
  })

  // ============================================
  // Tests for uploadFromBase64
  // ============================================

  test('should upload a file from base64 to a content', async ({ client, route, cleanup }) => {
    drive.fake('fs')
    cleanup(() => drive.restore('fs'))

    const user = await UserFactory.merge({
      role: Roles.USER,
      password: 'Secret2025!',
    }).create()

    const content = await ContentFactory.merge({ userId: user.id }).create()

    // Create a base64 encoded file (simple text file)
    const fileContent = 'test file content'
    const base64Content = Buffer.from(fileContent).toString('base64')

    const response = await client
      .post(route('api.v1.contents.files.uploadFromBase64', { content_id: content.id }))
      .withGuard('api')
      .loginAs(user)
      .json({
        base64: base64Content,
        name: 'test.txt',
      })
      .redirects(0)

    response.assertStatus(200)
    response.assertBodyContains({
      file: {
        contentId: content.id,
      }
    })
  })

  test('should upload a file from base64 without name', async ({ client, route, cleanup }) => {
    drive.fake('fs')
    cleanup(() => drive.restore('fs'))

    const user = await UserFactory.merge({
      role: Roles.USER,
      password: 'Secret2025!',
    }).create()

    const content = await ContentFactory.merge({ userId: user.id }).create()

    const fileContent = 'test file content'
    const base64Content = Buffer.from(fileContent).toString('base64')

    const response = await client
      .post(route('api.v1.contents.files.uploadFromBase64', { content_id: content.id }))
      .withGuard('api')
      .loginAs(user)
      .json({
        base64: base64Content,
      })
      .redirects(0)

    response.assertStatus(200)
    response.assertBodyContains({
      file: {
        contentId: content.id,
      }
    })
  })

  test('should not upload file from base64 without authentication', async ({ client, route }) => {
    const user = await UserFactory.merge({
      role: Roles.USER,
      password: 'Secret2025!',
    }).create()

    const content = await ContentFactory.merge({ userId: user.id }).create()

    const fileContent = 'test file content'
    const base64Content = Buffer.from(fileContent).toString('base64')

    const response = await client
      .post(route('api.v1.contents.files.uploadFromBase64', { content_id: content.id }))
      .json({
        base64: base64Content,
        name: 'test.txt',
      })
      .redirects(0)

    response.assertStatus(401)
  })

  test('should not upload file from base64 to non-existent content', async ({ client, route }) => {
    const user = await UserFactory.merge({
      role: Roles.USER,
      password: 'Secret2025!',
    }).create()

    const fakeContentId = '00000000-0000-0000-0000-000000000000'
    const fileContent = 'test file content'
    const base64Content = Buffer.from(fileContent).toString('base64')

    const response = await client
      .post(route('api.v1.contents.files.uploadFromBase64', { content_id: fakeContentId }))
      .withGuard('api')
      .loginAs(user)
      .json({
        base64: base64Content,
        name: 'test.txt',
      })
      .redirects(0)

    response.assertStatus(404)
  })

  test('should not upload file from base64 without base64 field', async ({ client, route }) => {
    const user = await UserFactory.merge({
      role: Roles.USER,
      password: 'Secret2025!',
    }).create()

    const content = await ContentFactory.merge({ userId: user.id }).create()

    const response = await client
      .post(route('api.v1.contents.files.uploadFromBase64', { content_id: content.id }))
      .withGuard('api')
      .loginAs(user)
      .json({
        name: 'test.txt',
      })
      .redirects(0)

    response.assertStatus(422)
  })

  test('should not upload file from base64 with empty base64 field', async ({ client, route }) => {
    const user = await UserFactory.merge({
      role: Roles.USER,
      password: 'Secret2025!',
    }).create()

    const content = await ContentFactory.merge({ userId: user.id }).create()

    const response = await client
      .post(route('api.v1.contents.files.uploadFromBase64', { content_id: content.id }))
      .withGuard('api')
      .loginAs(user)
      .json({
        base64: '',
        name: 'test.txt',
      })
      .redirects(0)

    response.assertStatus(422)
  })

  // ============================================
  // Tests for uploadFromUrl
  // ============================================

  test('should upload a file from URL to a content', async ({ client, route, cleanup }) => {
    drive.fake('fs')
    cleanup(() => drive.restore('fs'))

    const user = await UserFactory.merge({
      role: Roles.USER,
      password: 'Secret2025!',
    }).create()

    const content = await ContentFactory.merge({ userId: user.id }).create()

    // Use a publicly accessible test image URL
    const testUrl = 'https://placehold.co/600x400'

    const response = await client
      .post(route('api.v1.contents.files.uploadFromUrl', { content_id: content.id }))
      .withGuard('api')
      .loginAs(user)
      .json({
        url: testUrl,
        name: 'test-image.png',
      })
      .redirects(0)

    response.assertStatus(200)
    response.assertBodyContains({
      file: {
        contentId: content.id,
      }
    })
  })

  test('should upload a file from URL without name', async ({ client, route, cleanup }) => {
    drive.fake('fs')
    cleanup(() => drive.restore('fs'))

    const user = await UserFactory.merge({
      role: Roles.USER,
      password: 'Secret2025!',
    }).create()

    const content = await ContentFactory.merge({ userId: user.id }).create()

    const testUrl = 'https://placehold.co/600x400'

    const response = await client
      .post(route('api.v1.contents.files.uploadFromUrl', { content_id: content.id }))
      .withGuard('api')
      .loginAs(user)
      .json({
        url: testUrl,
      })
      .redirects(0)

    response.assertStatus(200)
    response.assertBodyContains({
      file: {
        contentId: content.id,
      }
    })
  })

  test('should not upload file from URL without authentication', async ({ client, route }) => {
    const user = await UserFactory.merge({
      role: Roles.USER,
      password: 'Secret2025!',
    }).create()

    const content = await ContentFactory.merge({ userId: user.id }).create()

    const testUrl = 'https://placehold.co/600x400'

    const response = await client
      .post(route('api.v1.contents.files.uploadFromUrl', { content_id: content.id }))
      .json({
        url: testUrl,
        name: 'test-image.png',
      })
      .redirects(0)

    response.assertStatus(401)
  })

  test('should not upload file from URL to non-existent content', async ({ client, route }) => {
    const user = await UserFactory.merge({
      role: Roles.USER,
      password: 'Secret2025!',
    }).create()

    const fakeContentId = '00000000-0000-0000-0000-000000000000'
    const testUrl = 'https://placehold.co/600x400'

    const response = await client
      .post(route('api.v1.contents.files.uploadFromUrl', { content_id: fakeContentId }))
      .withGuard('api')
      .loginAs(user)
      .json({
        url: testUrl,
        name: 'test-image.png',
      })
      .redirects(0)

    response.assertStatus(404)
  })

  test('should not upload file from URL without url field', async ({ client, route }) => {
    const user = await UserFactory.merge({
      role: Roles.USER,
      password: 'Secret2025!',
    }).create()

    const content = await ContentFactory.merge({ userId: user.id }).create()

    const response = await client
      .post(route('api.v1.contents.files.uploadFromUrl', { content_id: content.id }))
      .withGuard('api')
      .loginAs(user)
      .json({
        name: 'test-image.png',
      })
      .redirects(0)

    response.assertStatus(422)
  })

  test('should not upload file from URL with invalid URL format', async ({ client, route }) => {
    const user = await UserFactory.merge({
      role: Roles.USER,
      password: 'Secret2025!',
    }).create()

    const content = await ContentFactory.merge({ userId: user.id }).create()

    const response = await client
      .post(route('api.v1.contents.files.uploadFromUrl', { content_id: content.id }))
      .withGuard('api')
      .loginAs(user)
      .json({
        url: 'not-a-valid-url',
        name: 'test-image.png',
      })
      .redirects(0)

    response.assertStatus(422)
  })

  test('should not upload file from URL with empty URL field', async ({ client, route }) => {
    const user = await UserFactory.merge({
      role: Roles.USER,
      password: 'Secret2025!',
    }).create()

    const content = await ContentFactory.merge({ userId: user.id }).create()

    const response = await client
      .post(route('api.v1.contents.files.uploadFromUrl', { content_id: content.id }))
      .withGuard('api')
      .loginAs(user)
      .json({
        url: '',
        name: 'test-image.png',
      })
      .redirects(0)

    response.assertStatus(422)
  })

  // ============================================
  // Tests for permissions (ContentPolicy)
  // ============================================

  test('should allow admin to upload file to any content', async ({ client, route, cleanup }) => {
    drive.fake('fs')
    cleanup(() => drive.restore('fs'))

    const admin = await UserFactory.merge({
      role: Roles.ADMIN,
      password: 'Secret2025!',
    }).create()

    const user = await UserFactory.merge({
      role: Roles.USER,
      password: 'Secret2025!',
    }).create()

    const content = await ContentFactory.merge({ userId: user.id }).create()

    const fileBuffer = Buffer.from('test file content')
    const fileName = 'test.txt'

    const response = await client
      .post(route('api.v1.contents.files.upload', { content_id: content.id }))
      .withGuard('api')
      .loginAs(admin)
      .file('file_data', fileBuffer, { filename: fileName })
      .redirects(0)

    response.assertStatus(200)
    response.assertBodyContains({
      file: {
        contentId: content.id,
      }
    })
  })

  test('should allow user to upload file to their own content', async ({ client, route, cleanup }) => {
    drive.fake('fs')
    cleanup(() => drive.restore('fs'))

    const user = await UserFactory.merge({
      role: Roles.USER,
      password: 'Secret2025!',
    }).create()

    const content = await ContentFactory.merge({ userId: user.id }).create()

    const fileBuffer = Buffer.from('test file content')
    const fileName = 'test.txt'

    const response = await client
      .post(route('api.v1.contents.files.upload', { content_id: content.id }))
      .withGuard('api')
      .loginAs(user)
      .file('file_data', fileBuffer, { filename: fileName })
      .redirects(0)

    response.assertStatus(200)
    response.assertBodyContains({
      file: {
        contentId: content.id,
      }
    })
  })
})

