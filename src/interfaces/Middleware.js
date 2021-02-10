class Middleware {
  constructor() {
    this.isDev = process.env.NODE_ENV !== 'production'
    this.$rapidfire = null
    this.pattern = null
    this.pipelines = []
    this.order = 0
  }

  async init() {}
}

module.exports = Middleware
