const { Nuxt, Builder } = require('nuxt')

const {
  Interfaces: { Middleware },
} = require('../../src')

class NuxtMiddleware extends Middleware {
  constructor() {
    super()

    this.nuxt = new Nuxt({ telemetry: false })
  }

  async init() {
    await this.nuxt.ready()

    // Build only in dev mode
    if (this.isDev) {
      const builder = new Builder(this.nuxt)
      await builder.build()
    }
  }

  pipe(req, res, next) {
    this.nuxt.render(req, res, next)
  }
}

module.exports = NuxtMiddleware
