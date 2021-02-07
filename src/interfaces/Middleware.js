class Middleware {
  constructor() {
    this.isDev = process.env.NODE_ENV !== 'production'
    this.pattern = null
  }

  async init() {}

  pipe(req, res, next) {
    next()
  }
}

module.exports = Middleware
