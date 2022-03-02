const { Middleware } = require('../../src/interfaces')

class MyMiddleware extends Middleware {
  constructor() {
    super()
  }

  async init() {
    await super.init()

    this.pipelines.push({ pipe: this.setHeader.bind(this) })
  }

  setHeader(req, res, next) {
    res.set('X-Hello', 'World')

    next()
  }
}

module.exports = MyMiddleware
