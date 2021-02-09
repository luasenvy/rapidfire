class ServiceLoader {
  constructor() {
    this.isDev = process.env.NODE_ENV !== 'production'
    this.$rapidfire = null
  }

  load({ express, Service }) {
    const service = new Service({ router: express.Router() })

    service.$rapidfire = this.$rapidfire

    return service
  }
}

module.exports = ServiceLoader
