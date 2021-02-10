class Middleware {
  constructor() {
    this.$rapidfire = null
    this.pipelines = []
    this.order = 0
  }

  async init() {}
}

module.exports = Middleware
