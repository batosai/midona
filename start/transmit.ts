import transmit from '@adonisjs/transmit/services/main'
import type { HttpContext } from '@adonisjs/core/http'

transmit.authorize('notifications', async (ctx: HttpContext) => {
  await ctx.auth.check()
  return ctx.auth.isAuthenticated
})
