class Middleware {
  constructor() {
    this.isDev = process.env.NODE_ENV !== 'production'
    this.$rapidfire = null
    this.pattern = null
    this.order = 0
  }

  async init() {}

  pipe(req, res, next) {
    next()
  }
}

module.exports = Middleware
