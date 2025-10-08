import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class UserAdminMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {

    if (!ctx.auth.user?.isAdmin) {
      return ctx.response.unauthorized()
    }

    /**
     * Call next method in the pipeline and return its output
     */
    const output = await next()
    return output
  }
}
