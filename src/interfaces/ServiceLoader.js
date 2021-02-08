class ServiceLoader {
  constructor() {
    this.isDev = process.env.NODE_ENV !== 'production'
    this._rapidfire = null
  }

  load({ express, Service }) {
    const service = new Service({ router: express.Router() })

    service.$rapidfire = this.$rapidfire

    return service
  }

  get $rapidfire() {
    return this._rapidfire
  }
  set $rapidfire($rapidfire) {
    this._rapidfire = $rapidfire
  }
}

module.exports = ServiceLoader
