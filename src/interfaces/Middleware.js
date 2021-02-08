class Middleware {
  constructor() {
    this.isDev = process.env.NODE_ENV !== 'production'
    this._pattern = null
    this._rapidfire = null
  }

  async init() {}

  pipe(req, res, next) {
    next()
  }

  get $rapidfire() {
    return this._rapidfire
  }
  set $rapidfire($rapidfire) {
    this._rapidfire = $rapidfire
  }

  get pattern() {
    return this._pattern
  }
  set pattern(pattern) {
    this._pattern = pattern
  }
}

module.exports = Middleware
