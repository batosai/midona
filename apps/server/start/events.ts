// https://docs.adonisjs.com/guides/references/events
import string from '@adonisjs/core/helpers/string'
import app from '@adonisjs/core/services/app'
import emitter from '@adonisjs/core/services/emitter'
import logger from '@adonisjs/core/services/logger'
import db from '@adonisjs/lucid/services/db'

if (app.inDev) {
  emitter.on('db:query', db.prettyPrint)

  emitter.on('http:request_completed', (event) => {
    const method = event.ctx.request.method()
    const url = event.ctx.request.url(true)
    const duration = event.duration

    logger.info(`${method} ${url}: ${string.prettyHrTime(duration)}`)
  })

  emitter.on('access_tokens_auth:authentication_attempted', (event) => {
    logger.info(event.guardName)
  })


  emitter.on('access_tokens_auth:authentication_succeeded', (event) => {
    logger.info(event.guardName)
    logger.info(event.user)
    logger.info(event.token)
  })

  emitter.on('access_tokens_auth:authentication_failed', (event) => {
    logger.info(event.guardName)
    logger.info(event.error)
  })

  emitter.on('authorization:finished', (event) => {
    logger.info(event.user)
    logger.info(event.response)
    logger.info(event.parameters)
    logger.info(event.action)
  })



  emitter.on('i18n:missing:translation', function (event) {
    logger.warn(`Translation missing: ${event.locale}, ${event.identifier}`)
  })

  emitter.on('mail:sending', (event) => {
    logger.info(`Mail ${event.mailerName} is sending: ${event.message.subject}`)
  })

  emitter.on('mail:sent', (event) => {
    logger.info(event.response)

    logger.info(event.message)
    logger.info(event.views)
  })

  /*emitter.on('mail:queueing', (event) => {
    logger.info(event.mailerName)
    logger.info(event.message)
    logger.info(event.views)
  })

  emitter.on('mail:queued', (event) => {
    logger.info(event.mailerName)
    logger.info(event.message)
    logger.info(event.views)
  })*/

  emitter.on('queued:mail:error', (event) => {
    logger.info(event.error)
    logger.info(event.mailerName)
  })

}
